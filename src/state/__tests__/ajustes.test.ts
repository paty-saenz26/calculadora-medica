import type { StateStorage } from 'zustand/middleware';

import { crearAjustes, NOMBRE_AJUSTES } from '../ajustes';

const memoria = (): StateStorage & { datos: Record<string, string> } => {
  const datos: Record<string, string> = {};
  return {
    datos,
    getItem: (k) => datos[k] ?? null,
    setItem: (k, v) => void (datos[k] = v),
    removeItem: (k) => void delete datos[k],
  };
};

describe('F01 pantalla de bienvenida: solo la primera vez', () => {
  it('empieza sin verse y, una vez marcada, no vuelve a mostrarse al reabrir la app', async () => {
    const mem = memoria();
    const primera = crearAjustes(mem);
    expect(primera.getState().bienvenidaVista).toBe(false);
    primera.getState().marcarBienvenidaVista();
    expect(mem.datos[NOMBRE_AJUSTES]).toBeDefined();

    const reabierta = crearAjustes(mem); // app cerrada y abierta de nuevo
    await reabierta.persist.rehydrate();
    expect(reabierta.getState().bienvenidaVista).toBe(true);
  });
});
