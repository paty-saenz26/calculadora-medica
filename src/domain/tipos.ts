// Tipos del dominio (02-data-model.md y F03). Sin dependencias de React, Expo ni Firebase (P7).

export type Rango = { min: number; max: number };

/** Unidad de un campo numérico. La primera de la lista es la base y tiene factor 1. */
export type Unidad = {
  id: string;
  etiqueta: string;
  /** valorEnBase = valorEnEstaUnidad * factor */
  factor: number;
  /** Decimales al mostrar o convertir a esta unidad. Por defecto 2. */
  decimales?: number;
};

export type CampoNumero = {
  tipo: 'numero';
  id: string;
  etiqueta: string;
  unidades: Unidad[];
  /** Rango válido, expresado en la unidad base. Rechaza errores de captura. */
  rangoValido: Rango;
  /** Pista informativa de valor esperado. Nunca bloquea. */
  pista?: string;
  /** Si es true, solo acepta enteros. */
  entero?: boolean;
  opcional?: boolean;
};

export type OpcionCampo = { valor: string; etiqueta: string; puntos?: number };

export type CampoOpcion = {
  tipo: 'opcion';
  id: string;
  etiqueta: string;
  opciones: OpcionCampo[];
  opcional?: boolean;
};

export type CampoSiNo = {
  tipo: 'sino';
  id: string;
  etiqueta: string;
  /** Puntos que suma si la respuesta es Sí. */
  puntos?: number;
  /** Si se define, el campo inicia con ese valor y no cuenta como pendiente (D15). */
  valorInicial?: boolean;
  opcional?: boolean;
};

export type Campo = CampoNumero | CampoOpcion | CampoSiNo;

/** Valores listos para calcular: números en unidad base, opciones como texto, sí/no como booleano. */
export type ValoresCalculo = Record<string, number | string | boolean | undefined>;

export type Resultado = {
  valor: number;
  unidad?: string;
  interpretacion: string;
  /** Resultados secundarios que se muestran junto al principal (por ejemplo, la superficie corporal). */
  detalles?: { etiqueta: string; valor: string; unidad?: string }[];
};

/** Regla entre campos. Se evalúa solo cuando todos los campos involucrados tienen valor. */
export type Regla = {
  id: string;
  mensaje: string;
  campos: string[];
  cumple: (valores: ValoresCalculo) => boolean;
};

export type Calculadora = {
  id: string;
  nombre: string;
  descripcion: string;
  especialidades: string[];
  palabrasClave?: string[];
  /** Sube cuando cambia la fórmula, los campos o el redondeo. */
  version: number;
  fuente: string;
  /** Nota visible sobre la fuente o limitaciones de la fórmula. */
  notaFuente?: string;
  campos: Campo[];
  reglas: Regla[];
  calcular: (valores: ValoresCalculo) => Resultado;
};

/** Lo que el usuario ha capturado, tal cual (D13: se conserva lo escrito). */
export type Entradas = {
  /** Texto de campos numéricos, valor de opciones, booleano de sí/no. */
  valores: Record<string, string | boolean | undefined>;
  /** Unidad elegida por campo numérico; si falta, se usa la base. */
  unidades?: Record<string, string>;
};
