// Compartir resultado como texto (F06, D7). Función pura. La nota del historial NUNCA se incluye (R4).
import type { Calculadora } from './tipos';
import { describirValores, type CalculoGuardado } from './historial';

// btoa existe en Hermes (React Native) y en Node; se declara porque los tipos del proyecto no incluyen el DOM.
declare const btoa: (datos: string) => string;

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

export type CargaResultado = {
  /** Resultado principal */
  r: number;
  u?: string;
  /** Interpretación */
  i: string;
  /** Resultados secundarios [etiqueta, valor] */
  d?: [string, string][];
  /** Valores capturados [etiqueta, texto con unidad] */
  v: [string, string][];
};

const aBase64Url = (texto: string): string =>
  btoa(encodeURIComponent(texto).replace(/%([0-9A-F]{2})/g, (_, h: string) => String.fromCharCode(parseInt(h, 16))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

/** Lo que se ve al abrir el enlace: resultado, interpretación y valores. NUNCA la nota ni datos del usuario (R4). */
export function cargaResultado(calculadora: Calculadora, calculo: CalculoGuardado): CargaResultado {
  const r = calculo.resultado;
  return {
    r: r.valor,
    ...(r.unidad ? { u: r.unidad } : {}),
    i: r.interpretacion,
    ...(r.detalles?.length
      ? { d: r.detalles.map((x) => [x.etiqueta, `${x.valor}${x.unidad ? ` ${x.unidad}` : ''}`] as [string, string]) }
      : {}),
    v: describirValores(calculadora, calculo).map((l) => [l.etiqueta, l.texto] as [string, string]),
  };
}

/** Enlace a la página de la calculadora con el resultado dentro (la página lo lee del parámetro `d`). */
export function urlConResultado(calculadora: Calculadora, calculo: CalculoGuardado): string {
  return `${urlCalculadora(calculadora.id)}?d=${aBase64Url(JSON.stringify(cargaResultado(calculadora, calculo)))}`;
}

const ALFABETO = 'abcdefghijkmnpqrstuvwxyz23456789'; // sin letras que se confunden (l, o, 0, 1)

/** Identificador corto para el enlace (8 caracteres). */
export function generarIdCorto(aleatorio: () => number = Math.random): string {
  let id = '';
  for (let i = 0; i < 8; i++) id += ALFABETO[Math.floor(aleatorio() * ALFABETO.length)];
  return id;
}

/** Enlace corto: la página busca el resultado guardado con ese identificador. */
export function urlCorta(calculadoraId: string, idCorto: string): string {
  return `${urlCalculadora(calculadoraId)}?s=${idCorto}`;
}

/**
 * Mensaje para compartir con tarjeta: una línea con el resultado y el enlace.
 * Si no se da un enlace corto (por ejemplo sin conexión), se usa el enlace con el resultado dentro.
 * Nunca incluye la nota ni datos del usuario (R4).
 */
export function construirMensajeEnlace(calculadora: Calculadora, calculo: CalculoGuardado, enlace?: string): string {
  const r = calculo.resultado;
  return `${calculadora.nombre}: ${r.valor}${r.unidad ? ` ${r.unidad}` : ''}\n${enlace ?? urlConResultado(calculadora, calculo)}`;
}
