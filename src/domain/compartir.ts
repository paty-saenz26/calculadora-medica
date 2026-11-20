// Compartir resultado como texto (F06, D7). Función pura. La nota del historial NUNCA se incluye (R4).
import type { Calculadora } from './tipos';
import { describirValores, type CalculoGuardado } from './historial';

export const NOMBRE_APP = 'Calculadora Médica';

/**
 * Texto para compartir. Usa los valores guardados en el cálculo (D9), no recalcula.
 * Solo toma calculadora, valores con unidad, resultado, interpretación y fuente: sin nota, correo ni usuario.
 */
export function construirTextoCompartir(calculadora: Calculadora, calculo: CalculoGuardado): string {
  const valores = describirValores(calculadora, calculo)
    .map((l) => `${l.etiqueta}: ${l.texto}`)
    .join('\n');
  const r = calculo.resultado;
  const principal = `Resultado: ${r.valor}${r.unidad ? ` ${r.unidad}` : ''}`;
  const detalles = (r.detalles ?? []).map((d) => `${d.etiqueta}: ${d.valor}${d.unidad ? ` ${d.unidad}` : ''}`);

  return [
    calculadora.nombre,
    valores,
    [principal, ...detalles].join('\n'),
    r.interpretacion,
    `Fuente: ${calculadora.fuente}`,
    NOMBRE_APP,
  ]
    .filter((bloque) => bloque.trim() !== '')
    .join('\n\n');
}
