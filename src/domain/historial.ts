// Historial local (F05, 02-data-model.md). Funciones puras: sin React, AsyncStorage ni Firebase (P7).
import type { Calculadora, Entradas, Resultado } from './tipos';

export const LIMITE_NOTA = 200; // R9
export const TAMANO_PAGINA = 20; // F05

export type CalculoGuardado = {
  id: string;
  usuarioId?: string;
  calculadoraId: string;
  calculadoraVersion: number;
  /** Lo que el usuario capturó, tal cual: texto de números, opción, sí/no. */
  valores: Record<string, string | boolean>;
  /** Unidad elegida por cada campo numérico. */
  unidades: Record<string, string>;
  resultado: Resultado;
  /** Milisegundos desde 1970. */
  fecha: number;
  nota?: string;
};

export type Favorito = { usuarioId?: string; calculadoraId: string; fecha: number };

/** Deja las entradas completas y normalizadas: sin espacios, con la unidad de cada número y los sí/no resueltos. */
export function normalizarEntradas(
  calculadora: Calculadora,
  entradas: Entradas,
): Pick<CalculoGuardado, 'valores' | 'unidades'> {
  const valores: Record<string, string | boolean> = {};
  const unidades: Record<string, string> = {};
  for (const campo of calculadora.campos) {
    const crudo = entradas.valores[campo.id];
    if (campo.tipo === 'numero') {
      if (typeof crudo === 'string' && crudo.trim() !== '') {
        valores[campo.id] = crudo.trim();
        unidades[campo.id] = entradas.unidades?.[campo.id] ?? campo.unidades[0].id;
      }
    } else if (campo.tipo === 'opcion') {
      if (typeof crudo === 'string') valores[campo.id] = crudo;
    } else {
      const valor = typeof crudo === 'boolean' ? crudo : campo.valorInicial;
      if (valor !== undefined) valores[campo.id] = valor;
    }
  }
  return { valores, unidades };
}

export function construirCalculo(
  calculadora: Calculadora,
  entradas: Entradas,
  resultado: Resultado,
  id: string,
  fecha: number,
  usuarioId?: string,
): CalculoGuardado {
  return {
    id,
    ...(usuarioId ? { usuarioId } : {}),
    calculadoraId: calculadora.id,
    calculadoraVersion: calculadora.version,
    ...normalizarEntradas(calculadora, entradas),
    resultado,
    fecha,
  };
}

const igualesPlano = (a: Record<string, unknown>, b: Record<string, unknown>) => {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
};

/** R10 / D19: no se repite si valores, unidades y versión son idénticos al último cálculo de esa calculadora. */
export function buscarDuplicado(nuevo: CalculoGuardado, existentes: CalculoGuardado[]): CalculoGuardado | undefined {
  const ultimo = existentes
    .filter((c) => c.calculadoraId === nuevo.calculadoraId && c.usuarioId === nuevo.usuarioId)
    .reduce<CalculoGuardado | undefined>((a, c) => (!a || c.fecha > a.fecha ? c : a), undefined);
  return ultimo &&
    ultimo.calculadoraVersion === nuevo.calculadoraVersion &&
    igualesPlano(ultimo.valores, nuevo.valores) &&
    igualesPlano(ultimo.unidades, nuevo.unidades)
    ? ultimo
    : undefined;
}

export function esDuplicado(nuevo: CalculoGuardado, existentes: CalculoGuardado[]): boolean {
  return buscarDuplicado(nuevo, existentes) !== undefined;
}

/** Más reciente primero. */
export function ordenarPorFecha(calculos: CalculoGuardado[]): CalculoGuardado[] {
  return [...calculos].sort((a, b) => b.fecha - a.fecha);
}

/** Primeras `pagina` páginas de la lista (scroll infinito). */
export function paginar<T>(lista: T[], pagina: number, tamano = TAMANO_PAGINA): { items: T[]; hayMas: boolean } {
  const fin = Math.max(pagina, 1) * tamano;
  return { items: lista.slice(0, fin), hayMas: lista.length > fin };
}

export type ResultadoNota = { ok: true; nota: string | undefined } | { ok: false; mensaje: string };

/** R9: máximo 200 caracteres; una nota vacía la elimina. */
export function validarNota(texto: string): ResultadoNota {
  const limpio = texto.trim();
  if (limpio.length > LIMITE_NOTA) {
    return { ok: false, mensaje: `Máximo ${LIMITE_NOTA} caracteres` };
  }
  return { ok: true, nota: limpio === '' ? undefined : limpio };
}

export type LineaValor = { etiqueta: string; texto: string };

/** Valores del cálculo listos para mostrar: "Edad: 65 a 74 años", "Creatinina: 1.2 mg/dL". */
export function describirValores(calculadora: Calculadora, calculo: CalculoGuardado): LineaValor[] {
  const lineas: LineaValor[] = [];
  for (const campo of calculadora.campos) {
    const valor = calculo.valores[campo.id];
    if (valor === undefined) continue;
    if (campo.tipo === 'numero') {
      const unidad = campo.unidades.find((u) => u.id === calculo.unidades[campo.id]) ?? campo.unidades[0];
      lineas.push({ etiqueta: campo.etiqueta, texto: `${valor} ${unidad.etiqueta}` });
    } else if (campo.tipo === 'opcion') {
      lineas.push({
        etiqueta: campo.etiqueta,
        texto: campo.opciones.find((o) => o.valor === valor)?.etiqueta ?? String(valor),
      });
    } else {
      lineas.push({ etiqueta: campo.etiqueta, texto: valor === true ? 'Sí' : 'No' });
    }
  }
  return lineas;
}

/** "19 nov 2026, 14:05" */
export function formatearFecha(fecha: number): string {
  const d = new Date(fecha);
  const dia = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  const hora = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${dia}, ${hora}`;
}

export function nuevoId(fecha: number): string {
  return `${fecha.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Solo lo del dueño: con sesión, lo de esa cuenta; sin sesión (uid indefinido), lo de invitado. */
export function delUsuario<T extends { usuarioId?: string }>(lista: T[], uid: string | undefined): T[] {
  return lista.filter((x) => x.usuarioId === uid);
}
