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

/** Dirección pública de las páginas de las calculadoras (GitHub Pages, carpeta docs/). */
export const URL_BASE = 'https://paty-saenz26.github.io/calculadora-medica';

/** Enlace a la página de una calculadora. WhatsApp y otras apps lo muestran como tarjeta con imagen. */
export function urlCalculadora(calculadoraId: string): string {
  return `${URL_BASE}/c/${calculadoraId}/`;
}

/**
 * Mensaje para compartir con tarjeta: una línea con el resultado y el enlace.
 * Nunca incluye la nota ni datos del usuario (R4).
 */
export function construirMensajeEnlace(calculadora: Calculadora, calculo: CalculoGuardado): string {
  const r = calculo.resultado;
  return `${calculadora.nombre}: ${r.valor}${r.unidad ? ` ${r.unidad}` : ''}\n${urlCalculadora(calculadora.id)}`;
}
