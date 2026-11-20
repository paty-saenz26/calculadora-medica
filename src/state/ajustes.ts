// Ajustes del dispositivo (Zustand + AsyncStorage): por ahora, si ya se vio la pantalla de bienvenida (F01, D1b).
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export type EstadoAjustes = {
  bienvenidaVista: boolean;
  marcarBienvenidaVista: () => void;
};

export const NOMBRE_AJUSTES = 'calculadora-medica-ajustes';

export function crearAjustes(storage: StateStorage) {
  return create<EstadoAjustes>()(
    persist(
      (set) => ({
        bienvenidaVista: false,
        marcarBienvenidaVista: () => set({ bienvenidaVista: true }),
      }),
      {
        name: NOMBRE_AJUSTES,
        storage: createJSONStorage(() => storage),
        partialize: (s) => ({ bienvenidaVista: s.bienvenidaVista }),
      },
    ),
  );
}
