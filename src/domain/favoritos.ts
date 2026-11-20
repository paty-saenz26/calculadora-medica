// Favoritos (F04). Funciones puras; cada favorito pertenece a una cuenta o al invitado (usuarioId indefinido).
import type { Favorito } from './historial';

export function esFavorita(favoritos: Favorito[], calculadoraId: string, uid?: string): boolean {
  return favoritos.some((f) => f.calculadoraId === calculadoraId && f.usuarioId === uid);
}

export function alternarFavorito(
  favoritos: Favorito[],
  calculadoraId: string,
  fecha: number,
  uid?: string,
): Favorito[] {
  if (esFavorita(favoritos, calculadoraId, uid)) {
    return favoritos.filter((f) => !(f.calculadoraId === calculadoraId && f.usuarioId === uid));
  }
  return [...favoritos, { ...(uid ? { usuarioId: uid } : {}), calculadoraId, fecha }];
}
