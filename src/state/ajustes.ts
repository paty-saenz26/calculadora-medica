// Ajustes del dispositivo (Zustand + AsyncStorage): si ya se vio la pantalla de bienvenida (F01, D1b) y la apariencia (claro/oscuro).
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export type PreferenciaTema = 'sistema' | 'claro' | 'oscuro';

export type EstadoAjustes = {
  bienvenidaVista: boolean;
  marcarBienvenidaVista: () => void;
  /** Apariencia: la del teléfono o forzada a claro u oscuro. */
  tema: PreferenciaTema;
  cambiarTema: (tema: PreferenciaTema) => void;
};

export const NOMBRE_AJUSTES = 'calculadora-medica-ajustes';

export function crearAjustes(storage: StateStorage) {
  return create<EstadoAjustes>()(
    persist(
      (set) => ({
        bienvenidaVista: false,
        marcarBienvenidaVista: () => set({ bienvenidaVista: true }),
        tema: 'sistema',
        cambiarTema: (tema) => set({ tema }),
      }),
      {
        name: NOMBRE_AJUSTES,
        storage: createJSONStorage(() => storage),
        partialize: (s) => ({ bienvenidaVista: s.bienvenidaVista, tema: s.tema }),
      },
    ),
  );
}
