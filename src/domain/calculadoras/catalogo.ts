import { aclaramientoCreatinina } from './aclaramiento-creatinina';
import { chaDsVa } from './cha2ds2-va';
import { chaDsVasc } from './cha2ds2-vasc';
import { ckdEpi2021 } from './ckd-epi-2021';
import { deficitBicarbonato } from './deficit-bicarbonato';
import { fib4 } from './fib4';
import { imcSuperficieCorporal } from './imc-superficie-corporal';
import { pam } from './pam';
import { stopBang } from './stop-bang';
import type { Calculadora } from '../tipos';

/** Registro de todas las calculadoras. Agregar una = un archivo nuevo + una línea aquí (P7). */
export const catalogo: Calculadora[] = [
  pam,
  chaDsVasc,
  aclaramientoCreatinina,
  imcSuperficieCorporal,
  fib4,
  chaDsVa,
  deficitBicarbonato,
  ckdEpi2021,
  stopBang,
];

export function obtenerCalculadora(id: string): Calculadora | undefined {
  return catalogo.find((c) => c.id === id);
}
