import type { CampoNumero, Unidad } from './tipos';

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

/** Lo que el usuario escribió originalmente, para restaurarlo exacto al volver a su unidad (D13). */
export type OrigenConversion = { texto: string; unidadId: string };

export type EstadoUnidad = {
  texto: string;
  unidadId: string;
  origen?: OrigenConversion;
};

/**
 * Cambia la unidad de un campo (D13). Convierte siempre desde lo escrito originalmente, así los
 * redondeos no se acumulan, y al volver a la unidad original restaura el texto exacto.
 */
export function cambiarUnidad(
  campo: CampoNumero,
  actual: EstadoUnidad,
  nuevaUnidadId: string,
): EstadoUnidad {
  const buscar = (id: string): Unidad => campo.unidades.find((u) => u.id === id) ?? campo.unidades[0];

  if (actual.texto.trim() === '') {
    return { texto: actual.texto, unidadId: nuevaUnidadId };
  }

  const origen = actual.origen ?? { texto: actual.texto, unidadId: actual.unidadId };
  if (nuevaUnidadId === origen.unidadId) {
    return { texto: origen.texto, unidadId: nuevaUnidadId };
  }

  return {
    texto: convertirTexto(origen.texto, buscar(origen.unidadId), buscar(nuevaUnidadId)),
    unidadId: nuevaUnidadId,
    origen,
  };
}

/** Deja pasar solo dígitos y un único punto decimal; la coma y otros caracteres no se aceptan. */
export function limpiarTecleo(texto: string, entero = false): string {
  if (entero) {
    return texto.replace(/[^0-9]/g, '');
  }
  const soloValidos = texto.replace(/[^0-9.]/g, '');
  const primero = soloValidos.indexOf('.');
  if (primero === -1) {
    return soloValidos;
  }
  return soloValidos.slice(0, primero + 1) + soloValidos.slice(primero + 1).replace(/\./g, '');
}
