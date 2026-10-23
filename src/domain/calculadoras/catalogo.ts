import { pam } from './pam';
import type { Calculadora } from '../tipos';

/** Registro de todas las calculadoras. Agregar una = un archivo nuevo + una línea aquí (P7). */
export const catalogo: Calculadora[] = [pam];

export function obtenerCalculadora(id: string): Calculadora | undefined {
  return catalogo.find((c) => c.id === id);
}
