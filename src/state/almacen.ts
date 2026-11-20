// Estado global (Zustand): historial y favoritos, persistidos en el dispositivo.
// Cada elemento pertenece a una cuenta (usuarioId) o al invitado (sin usuarioId). Con cuenta, la nube es
// la fuente de verdad (D6): los cambios se envían a Firestore y al iniciar sesión se descarga lo de la cuenta.
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import { almacenamientoLocal } from '../data/local';
import type { Nube } from '../data/nube';
import { alternarFavorito, esFavorita } from '../domain/favoritos';
import { buscarDuplicado, validarNota, type CalculoGuardado, type Favorito } from '../domain/historial';

export type EstadoAlmacen = {
  calculos: CalculoGuardado[];
  favoritos: Favorito[];
  /** R10: no guarda si es idéntico al último de esa calculadora (del mismo dueño). */
  guardarCalculo: (calculo: CalculoGuardado) => 'guardado' | 'duplicado';
  /** R2: la nota es lo único editable. Texto vacío la elimina (R9). */
  editarNota: (id: string, texto: string) => { ok: true } | { ok: false; mensaje: string };
  eliminarCalculo: (id: string) => void;
  alternarFavorito: (calculadoraId: string, uid?: string, fecha?: number) => void;
  esFavorita: (calculadoraId: string, uid?: string) => boolean;
  /** Descarga lo de la cuenta y reemplaza lo local de esa cuenta (nube = fuente de verdad). */
  importarDeNube: (uid: string) => Promise<void>;
  /** D8: pasa a la cuenta lo que se hizo como invitado y lo sube a la nube. */
  reclamarInvitado: (uid: string) => void;
  cantidadInvitado: () => number;
};

export const NOMBRE_ALMACEN = 'calculadora-medica-datos';

/** La sincronización es "lo mejor posible": si falla (sin red), lo local sigue funcionando. */
const intentar = (accion: Promise<unknown> | undefined) => {
  accion?.catch(() => undefined);
};

/** Fábrica con almacenamiento y nube inyectables (las pruebas usan versiones simuladas). */
export function crearAlmacen(storage: StateStorage, nube?: Nube) {
  return create<EstadoAlmacen>()(
    persist(
      (set, get) => ({
        calculos: [],
        favoritos: [],
        guardarCalculo: (calculo) => {
          const repetido = buscarDuplicado(calculo, get().calculos);
          if (repetido) {
            // Mismo cálculo otra vez: no se duplica, pero sube al inicio del historial.
            const subido = { ...repetido, fecha: Math.max(calculo.fecha, repetido.fecha) };
            set((s) => ({ calculos: s.calculos.map((c) => (c.id === repetido.id ? subido : c)) }));
            if (subido.usuarioId) intentar(nube?.guardarCalculo(subido.usuarioId, subido));
            return 'duplicado';
          }
          set((s) => ({ calculos: [...s.calculos, calculo] }));
          if (calculo.usuarioId) intentar(nube?.guardarCalculo(calculo.usuarioId, calculo));
          return 'guardado';
        },
        editarNota: (id, texto) => {
          const r = validarNota(texto);
          if (!r.ok) return r;
          let actualizado: CalculoGuardado | undefined;
          set((s) => ({
            calculos: s.calculos.map((c) => {
              if (c.id !== id) return c;
              const { nota: _anterior, ...resto } = c;
              actualizado = r.nota ? { ...resto, nota: r.nota } : resto;
              return actualizado;
            }),
          }));
          if (actualizado?.usuarioId) intentar(nube?.guardarCalculo(actualizado.usuarioId, actualizado));
          return { ok: true };
        },
        eliminarCalculo: (id) => {
          const calculo = get().calculos.find((c) => c.id === id);
          set((s) => ({ calculos: s.calculos.filter((c) => c.id !== id) }));
          if (calculo?.usuarioId) intentar(nube?.eliminarCalculo(calculo.usuarioId, id));
        },
        alternarFavorito: (calculadoraId, uid, fecha = Date.now()) => {
          const eraFavorita = esFavorita(get().favoritos, calculadoraId, uid);
          set((s) => ({ favoritos: alternarFavorito(s.favoritos, calculadoraId, fecha, uid) }));
          if (!uid) return;
          intentar(
            eraFavorita
              ? nube?.eliminarFavorito(uid, calculadoraId)
              : nube?.guardarFavorito(uid, { usuarioId: uid, calculadoraId, fecha }),
          );
        },
        esFavorita: (calculadoraId, uid) => esFavorita(get().favoritos, calculadoraId, uid),
        importarDeNube: async (uid) => {
          if (!nube) return;
          const { calculos, favoritos } = await nube.descargar(uid);
          set((s) => ({
            calculos: [...s.calculos.filter((c) => c.usuarioId !== uid), ...calculos],
            favoritos: [...s.favoritos.filter((f) => f.usuarioId !== uid), ...favoritos],
          }));
        },
        reclamarInvitado: (uid) => {
          const calculosNuevos = get()
            .calculos.filter((c) => !c.usuarioId)
            .map((c) => ({ ...c, usuarioId: uid }));
          const favoritosNuevos = get()
            .favoritos.filter((f) => !f.usuarioId)
            .map((f) => ({ ...f, usuarioId: uid }));
          const yaTiene = (c: CalculoGuardado) => get().calculos.some((x) => x.usuarioId === uid && x.id === c.id);
          const calculosPasan = calculosNuevos.filter((c) => !yaTiene(c));
          const favoritosPasan = favoritosNuevos.filter((f) => !esFavorita(get().favoritos, f.calculadoraId, uid));
          set((s) => ({
            // Lo que ya estaba en la cuenta se conserva; el resto del invitado pasa a la cuenta.
            calculos: [...s.calculos.filter((c) => c.usuarioId), ...calculosPasan],
            favoritos: [...s.favoritos.filter((f) => f.usuarioId), ...favoritosPasan],
          }));
          calculosPasan.forEach((c) => intentar(nube?.guardarCalculo(uid, c)));
          favoritosPasan.forEach((f) => intentar(nube?.guardarFavorito(uid, f)));
        },
        cantidadInvitado: () =>
          get().calculos.filter((c) => !c.usuarioId).length + get().favoritos.filter((f) => !f.usuarioId).length,
      }),
      {
        name: NOMBRE_ALMACEN,
        storage: createJSONStorage(() => storage),
        partialize: (s) => ({ calculos: s.calculos, favoritos: s.favoritos }),
      },
    ),
  );
}
