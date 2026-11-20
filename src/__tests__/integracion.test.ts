// Pruebas de integración: varias capas juntas (dominio + estado + servicios simulados de Firebase).
import type { StateStorage } from 'zustand/middleware';

import type { ServicioAuth } from '../data/autenticacion';
import type { Nube } from '../data/nube';
import { buscarCalculadoras } from '../domain/busqueda';
import { catalogo, obtenerCalculadora } from '../domain/calculadoras/catalogo';
import { construirMensajeEnlace, construirTextoCompartir } from '../domain/compartir';
import { derivarFavoritas, derivarRecientes } from '../domain/consultas';
import type { Usuario } from '../domain/cuenta';
import { construirCalculo, delUsuario, ordenarPorFecha, paginar } from '../domain/historial';
import { evaluar } from '../domain/motor';
import type { Entradas } from '../domain/tipos';
import { crearAlmacen } from '../state/almacen';
import { crearSesion } from '../state/sesion';

const memoria = (): StateStorage => {
  const datos: Record<string, string> = {};
  return {
    getItem: (k) => datos[k] ?? null,
    setItem: (k, v) => void (datos[k] = v),
    removeItem: (k) => void delete datos[k],
  };
};

/** Firestore simulado: guarda en memoria, por usuario. */
const nubeEnMemoria = () => {
  const calculos = new Map<string, Map<string, unknown>>();
  const favoritos = new Map<string, Map<string, unknown>>();
  const de = (m: Map<string, Map<string, unknown>>, uid: string) => m.get(uid) ?? m.set(uid, new Map()).get(uid)!;
  const nube: Nube = {
    guardarCalculo: async (uid, c) => void de(calculos, uid).set(c.id, c),
    eliminarCalculo: async (uid, id) => void de(calculos, uid).delete(id),
    guardarFavorito: async (uid, f) => void de(favoritos, uid).set(f.calculadoraId, f),
    eliminarFavorito: async (uid, id) => void de(favoritos, uid).delete(id),
    descargar: async (uid) => ({
      calculos: [...de(calculos, uid).values()] as never[],
      favoritos: [...de(favoritos, uid).values()] as never[],
    }),
  };
  return { nube, calculos, favoritos };
};

/** Firebase Auth simulado con una "base de usuarios" en memoria. */
const authEnMemoria = (): ServicioAuth => {
  const cuentas = new Map<string, { contrasena: string; usuario: Usuario }>();
  let actual: Usuario | null = null;
  const oyentes: ((u: Usuario | null) => void)[] = [];
  const emitir = () => oyentes.forEach((o) => o(actual));
  const error = (code: string) => Object.assign(new Error(code), { code });
  return {
    registrar: async (correo, contrasena) => {
      if (cuentas.has(correo)) throw error('auth/email-already-in-use');
      actual = { uid: `uid-${cuentas.size + 1}`, email: correo };
      cuentas.set(correo, { contrasena, usuario: actual });
      emitir();
      return actual;
    },
    iniciarSesion: async (correo, contrasena) => {
      const cuenta = cuentas.get(correo);
      if (!cuenta || cuenta.contrasena !== contrasena) throw error('auth/invalid-credential');
      actual = cuenta.usuario;
      emitir();
      return actual;
    },
    cerrarSesion: async () => {
      actual = null;
      emitir();
    },
    recuperar: async () => undefined,
    escuchar: (cb) => {
      oyentes.push(cb);
      return () => undefined;
    },
  };
};

const pam = obtenerCalculadora('pam')!;
const calcular = (entradas: Entradas, id: string, fecha: number, uid?: string) =>
  construirCalculo(pam, entradas, evaluar(pam, entradas).resultado!, id, fecha, uid);

describe('Integración 1: calcular, guardar en historial, anotar y compartir', () => {
  it('recorre el flujo completo y la nota nunca sale al compartir', () => {
    const almacen = crearAlmacen(memoria());
    const entradas = { valores: { pas: '120', pad: '80' } };

    const estado = evaluar(pam, entradas);
    expect(estado.resultado?.valor).toBe(93);

    expect(almacen.getState().guardarCalculo(calcular(entradas, 'c1', 1000))).toBe('guardado');
    expect(almacen.getState().guardarCalculo(calcular(entradas, 'c2', 2000))).toBe('duplicado'); // R10

    almacen.getState().editarNota('c1', 'paciente de la cama 4');
    const guardado = almacen.getState().calculos[0];
    expect(guardado.nota).toBe('paciente de la cama 4');

    const texto = construirTextoCompartir(pam, guardado);
    const mensaje = construirMensajeEnlace(pam, guardado);
    for (const salida of [texto, mensaje]) {
      expect(salida).not.toContain('cama 4');
      expect(salida).toContain('93');
    }

    almacen.getState().eliminarCalculo('c1');
    expect(almacen.getState().calculos).toHaveLength(0);
  });
});

describe('Integración 2: registro, aviso de datos de invitado y sincronización', () => {
  it('lo hecho como invitado pasa a la cuenta, se sube a la nube y vuelve en otro teléfono', async () => {
    const { nube, calculos } = nubeEnMemoria();
    const auth = authEnMemoria();
    const almacen = crearAlmacen(memoria(), nube);
    const sesion = crearSesion(auth, (u) => void almacen.getState().importarDeNube(u.uid));
    sesion.getState().iniciar();

    // Como invitado
    almacen.getState().guardarCalculo(calcular({ valores: { pas: '120', pad: '80' } }, 'a', 1));
    almacen.getState().alternarFavorito('pam', undefined, 5);
    expect(almacen.getState().cantidadInvitado()).toBe(2);

    // Registro y D8 "Sí"
    expect(await sesion.getState().registrar('medico@hospital.mx', 'clave1234')).toEqual({ ok: true });
    const uid = sesion.getState().usuario!.uid;
    almacen.getState().reclamarInvitado(uid);
    await Promise.resolve();

    expect(almacen.getState().cantidadInvitado()).toBe(0);
    expect(calculos.get(uid)?.size).toBe(1);

    // Otro teléfono: almacén vacío que inicia sesión y descarga
    const otro = crearAlmacen(memoria(), nube);
    await otro.getState().importarDeNube(uid);
    expect(delUsuario(otro.getState().calculos, uid)).toHaveLength(1);
    expect(otro.getState().esFavorita('pam', uid)).toBe(true);
  });
});

describe('Integración 3: credenciales incorrectas y correo repetido', () => {
  it('rechaza con mensajes en español y no abre sesión', async () => {
    const sesion = crearSesion(authEnMemoria());
    await sesion.getState().registrar('a@b.co', 'clave1234');
    await sesion.getState().cerrar();

    const mala = await sesion.getState().entrar('a@b.co', 'otraClave99');
    expect(mala).toEqual({ ok: false, mensaje: 'Correo o contraseña incorrectos' });
    const inexistente = await sesion.getState().entrar('nadie@b.co', 'clave1234');
    expect(inexistente).toEqual(mala); // mismo mensaje: no revela si la cuenta existe
    expect(sesion.getState().usuario).toBeNull();

    const repetido = await sesion.getState().registrar('a@b.co', 'clave1234');
    expect(repetido).toEqual({ ok: false, mensaje: 'Ya existe una cuenta con este correo' });
  });
});

describe('Integración 4: cerrar sesión separa los datos de la cuenta y del invitado', () => {
  it('al cerrar sesión solo se ve lo de invitado; al volver a entrar regresa lo de la cuenta', async () => {
    const { nube } = nubeEnMemoria();
    const auth = authEnMemoria();
    const almacen = crearAlmacen(memoria(), nube);
    const sesion = crearSesion(auth, (u) => void almacen.getState().importarDeNube(u.uid));
    sesion.getState().iniciar();

    await sesion.getState().registrar('a@b.co', 'clave1234');
    const uid = sesion.getState().usuario!.uid;
    almacen.getState().guardarCalculo(calcular({ valores: { pas: '120', pad: '80' } }, 'cuenta', 1, uid));
    await Promise.resolve();

    await sesion.getState().cerrar();
    expect(sesion.getState().usuario).toBeNull();
    almacen.getState().guardarCalculo(calcular({ valores: { pas: '110', pad: '70' } }, 'invitado', 2));

    const visibleInvitado = delUsuario(almacen.getState().calculos, sesion.getState().usuario?.uid);
    expect(visibleInvitado.map((c) => c.id)).toEqual(['invitado']);

    await sesion.getState().entrar('a@b.co', 'clave1234');
    await Promise.resolve();
    await Promise.resolve();
    const visibleCuenta = delUsuario(almacen.getState().calculos, sesion.getState().usuario?.uid);
    expect(visibleCuenta.map((c) => c.id)).toEqual(['cuenta']);
  });
});

describe('Integración 5: búsqueda, favoritos y recientes sobre el catálogo real', () => {
  it('encuentra por siglas, marca favoritas y deriva recientes del historial', () => {
    expect(buscarCalculadoras(catalogo, 'cockcroft')[0].id).toBe('aclaramiento-creatinina');
    expect(buscarCalculadoras(catalogo, 'PAM')[0].id).toBe('pam');

    const almacen = crearAlmacen(memoria());
    almacen.getState().alternarFavorito('fib4', undefined, 10);
    almacen.getState().alternarFavorito('pam', undefined, 20);
    expect(derivarFavoritas(almacen.getState().favoritos, catalogo).map((c) => c.id)).toEqual(['pam', 'fib4']);

    almacen.getState().guardarCalculo(calcular({ valores: { pas: '120', pad: '80' } }, 'a', 100));
    expect(derivarRecientes(almacen.getState().calculos, catalogo).map((c) => c.id)).toEqual(['pam']);

    almacen.getState().eliminarCalculo('a');
    expect(derivarRecientes(almacen.getState().calculos, catalogo)).toEqual([]); // D10
  });
});

describe('Integración 6: historial paginado con muchos cálculos', () => {
  it('ordena del más reciente y entrega 20 por página', () => {
    const almacen = crearAlmacen(memoria());
    for (let i = 0; i < 45; i++) {
      almacen.getState().guardarCalculo(calcular({ valores: { pas: String(100 + i), pad: '60' } }, `c${i}`, i));
    }
    const ordenados = ordenarPorFecha(almacen.getState().calculos);
    expect(ordenados[0].id).toBe('c44');
    expect(paginar(ordenados, 1).items).toHaveLength(20);
    expect(paginar(ordenados, 3)).toMatchObject({ hayMas: false });
    expect(paginar(ordenados, 3).items).toHaveLength(45);
  });
});
