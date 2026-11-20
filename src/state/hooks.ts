import { useMemo } from 'react';

import { delUsuario } from '../domain/historial';
import { useAlmacen, useSesion } from './instancias';

/** uid de la cuenta activa, o undefined si se usa como invitado. */
export function useUid(): string | undefined {
  return useSesion((s) => s.usuario?.uid);
}

export function useMisCalculos() {
  const uid = useUid();
  const calculos = useAlmacen((s) => s.calculos);
  return useMemo(() => delUsuario(calculos, uid), [calculos, uid]);
}

export function useEsFavorita(calculadoraId: string): boolean {
  const uid = useUid();
  return useAlmacen((s) => s.favoritos.some((f) => f.calculadoraId === calculadoraId && f.usuarioId === uid));
}
