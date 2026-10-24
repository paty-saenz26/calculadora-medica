import { aclaramientoCreatinina } from './aclaramiento-creatinina';
import { chaDsVasc } from './cha2ds2-vasc';
import { imcSuperficieCorporal } from './imc-superficie-corporal';
import { pam } from './pam';
import type { Calculadora } from '../tipos';

/** Registro de todas las calculadoras. Agregar una = un archivo nuevo + una línea aquí (P7). */
export const catalogo: Calculadora[] = [pam, chaDsVasc, aclaramientoCreatinina, imcSuperficieCorporal];

export function obtenerCalculadora(id: string): Calculadora | undefined {
  return catalogo.find((c) => c.id === id);
}
