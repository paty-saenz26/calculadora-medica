import type { StateStorage } from 'zustand/middleware';

import type { Nube } from '../../data/nube';
import { obtenerCalculadora } from '../../domain/calculadoras/catalogo';
import { construirCalculo, type CalculoGuardado } from '../../domain/historial';
import { evaluar } from '../../domain/motor';
import { crearAlmacen, NOMBRE_ALMACEN } from '../almacen';

const memoria = (): StateStorage & { datos: Record<string, string> } => {
  const datos: Record<string, string> = {};
  return {
    datos,
    getItem: (k) => datos[k] ?? null,
    setItem: (k, v) => void (datos[k] = v),
    removeItem: (k) => void delete datos[k],
  };
};

const nubeSimulada = () => {
  const nube = {
    guardarCalculo: jest.fn().mockResolvedValue(undefined),
    eliminarCalculo: jest.fn().mockResolvedValue(undefined),
    guardarFavorito: jest.fn().mockResolvedValue(undefined),
    eliminarFavorito: jest.fn().mockResolvedValue(undefined),
    descargar: jest.fn().mockResolvedValue({ calculos: [], favoritos: [] }),
  };
  return nube as typeof nube & Nube;
};

const pam = obtenerCalculadora('pam')!;
const calculo = (pas: string, pad: string, id: string, fecha: number, uid?: string) => {
  const entradas = { valores: { pas, pad } };
  return construirCalculo(pam, entradas, evaluar(pam, entradas).resultado!, id, fecha, uid);
};

describe('almacén de historial y favoritos (invitado)', () => {
  it('guarda y rechaza duplicados', () => {
    const useA = crearAlmacen(memoria());
    expect(useA.getState().guardarCalculo(calculo('120', '80', 'a', 1))).toBe('guardado');
    expect(useA.getState().guardarCalculo(calculo('120', '80', 'b', 2))).toBe('duplicado');
    expect(useA.getState().calculos).toHaveLength(1);
  });

  it('un duplicado no se agrega pero sube al inicio del historial', () => {
    const useA = crearAlmacen(memoria());
    useA.getState().guardarCalculo(calculo('120', '80', 'a', 1));
    useA.getState().guardarCalculo(calculo('100', '60', 'b', 2));
    useA.getState().guardarCalculo(calculo('100', '60', 'c', 5));
    const fechas = Object.fromEntries(useA.getState().calculos.map((c) => [c.id, c.fecha]));
    expect(useA.getState().calculos).toHaveLength(2);
    expect(fechas.b).toBe(5);
  });

  it('edita la nota, la valida y la quita con texto vacío', () => {
    const useA = crearAlmacen(memoria());
    useA.getState().guardarCalculo(calculo('120', '80', 'a', 1));
    expect(useA.getState().editarNota('a', 'paciente 1')).toEqual({ ok: true });
    expect(useA.getState().calculos[0].nota).toBe('paciente 1');
    expect(useA.getState().editarNota('a', 'x'.repeat(201)).ok).toBe(false);
    expect(useA.getState().calculos[0].nota).toBe('paciente 1');
    useA.getState().editarNota('a', '  ');
    expect('nota' in useA.getState().calculos[0]).toBe(false);
  });

  it('elimina un cálculo', () => {
    const useA = crearAlmacen(memoria());
    useA.getState().guardarCalculo(calculo('120', '80', 'a', 1));
    useA.getState().eliminarCalculo('a');
    expect(useA.getState().calculos).toEqual([]);
  });

  it('marca y quita favoritos', () => {
    const useA = crearAlmacen(memoria());
    useA.getState().alternarFavorito('pam', undefined, 10);
    expect(useA.getState().esFavorita('pam')).toBe(true);
    useA.getState().alternarFavorito('pam', undefined, 11);
    expect(useA.getState().esFavorita('pam')).toBe(false);
  });

  it('persiste y se recupera en un almacén nuevo (AsyncStorage simulado)', async () => {
    const mem = memoria();
    const a = crearAlmacen(mem);
    a.getState().guardarCalculo(calculo('120', '80', 'a', 1));
    a.getState().alternarFavorito('pam', undefined, 10);
    expect(mem.datos[NOMBRE_ALMACEN]).toBeDefined();

    const b = crearAlmacen(mem);
    await b.persist.rehydrate();
    expect(b.getState().calculos).toHaveLength(1);
    expect(b.getState().esFavorita('pam')).toBe(true);
  });

  it('el invitado no toca la nube', () => {
    const nube = nubeSimulada();
    const useA = crearAlmacen(memoria(), nube);
    useA.getState().guardarCalculo(calculo('120', '80', 'a', 1));
    useA.getState().alternarFavorito('pam', undefined, 5);
    expect(nube.guardarCalculo).not.toHaveBeenCalled();
    expect(nube.guardarFavorito).not.toHaveBeenCalled();
  });
});

describe('almacén con cuenta (sincronización con Firestore simulado)', () => {
  it('envía a la nube lo que se guarda, edita y elimina', () => {
    const nube = nubeSimulada();
    const useA = crearAlmacen(memoria(), nube);
    useA.getState().guardarCalculo(calculo('120', '80', 'a', 1, 'u1'));
    expect(nube.guardarCalculo).toHaveBeenCalledWith('u1', expect.objectContaining({ id: 'a' }));
    useA.getState().editarNota('a', 'hola');
    expect(nube.guardarCalculo).toHaveBeenLastCalledWith('u1', expect.objectContaining({ nota: 'hola' }));
    useA.getState().eliminarCalculo('a');
    expect(nube.eliminarCalculo).toHaveBeenCalledWith('u1', 'a');
  });

  it('envía favoritos a la nube y los quita', () => {
    const nube = nubeSimulada();
    const useA = crearAlmacen(memoria(), nube);
    useA.getState().alternarFavorito('pam', 'u1', 5);
    expect(nube.guardarFavorito).toHaveBeenCalledWith('u1', { usuarioId: 'u1', calculadoraId: 'pam', fecha: 5 });
    useA.getState().alternarFavorito('pam', 'u1', 6);
    expect(nube.eliminarFavorito).toHaveBeenCalledWith('u1', 'pam');
  });

  it('si la nube falla, lo local sigue funcionando', async () => {
    const nube = nubeSimulada();
    nube.guardarCalculo.mockRejectedValue(new Error('sin red'));
    const useA = crearAlmacen(memoria(), nube);
    expect(useA.getState().guardarCalculo(calculo('120', '80', 'a', 1, 'u1'))).toBe('guardado');
    await Promise.resolve();
    expect(useA.getState().calculos).toHaveLength(1);
  });

  it('importa de la nube y reemplaza solo lo de esa cuenta', async () => {
    const nube = nubeSimulada();
    const deNube: CalculoGuardado = calculo('110', '70', 'n1', 9, 'u1');
    nube.descargar.mockResolvedValue({ calculos: [deNube], favoritos: [{ usuarioId: 'u1', calculadoraId: 'pam', fecha: 3 }] });
    const useA = crearAlmacen(memoria(), nube);
    useA.getState().guardarCalculo(calculo('100', '60', 'invitado', 1)); // invitado
    useA.getState().guardarCalculo(calculo('90', '60', 'viejo', 2, 'u1')); // ya no está en la nube
    await useA.getState().importarDeNube('u1');
    const ids = useA.getState().calculos.map((c) => c.id).sort();
    expect(ids).toEqual(['invitado', 'n1']);
    expect(useA.getState().esFavorita('pam', 'u1')).toBe(true);
  });

  it('D8: reclamar pasa lo de invitado a la cuenta y lo sube', () => {
    const nube = nubeSimulada();
    const useA = crearAlmacen(memoria(), nube);
    useA.getState().guardarCalculo(calculo('120', '80', 'a', 1));
    useA.getState().alternarFavorito('pam', undefined, 4);
    expect(useA.getState().cantidadInvitado()).toBe(2);
    useA.getState().reclamarInvitado('u1');
    expect(useA.getState().cantidadInvitado()).toBe(0);
    expect(useA.getState().calculos[0].usuarioId).toBe('u1');
    expect(nube.guardarCalculo).toHaveBeenCalledWith('u1', expect.objectContaining({ id: 'a', usuarioId: 'u1' }));
    expect(nube.guardarFavorito).toHaveBeenCalledWith('u1', expect.objectContaining({ calculadoraId: 'pam' }));
  });

  it('D8 "No": lo de invitado se conserva sin cambios', () => {
    const useA = crearAlmacen(memoria(), nubeSimulada());
    useA.getState().guardarCalculo(calculo('120', '80', 'a', 1));
    expect(useA.getState().cantidadInvitado()).toBe(1);
    expect(useA.getState().calculos[0].usuarioId).toBeUndefined();
  });
});
