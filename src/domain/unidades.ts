import type { Unidad } from './tipos';

/** Convierte un valor entre dos unidades de un mismo campo (pasando por la base). */
export function convertirValor(valor: number, desde: Unidad, hacia: Unidad): number {
  return (valor * desde.factor) / hacia.factor;
}

/** Redondea a `decimales` y quita ceros sobrantes: 1.00 -> "1", 88.4 -> "88.4". */
export function formatearNumero(valor: number, decimales = 2): string {
  const redondeado = Number(valor.toFixed(decimales));
  return String(Object.is(redondeado, -0) ? 0 : redondeado);
}

/** Convierte el texto escrito de una unidad a otra y lo deja listo para mostrarse. */
export function convertirTexto(texto: string, desde: Unidad, hacia: Unidad): string {
  const valor = Number(texto);
  if (texto.trim() === '' || Number.isNaN(valor)) {
    return texto;
  }
  return formatearNumero(convertirValor(valor, desde, hacia), hacia.decimales);
}
