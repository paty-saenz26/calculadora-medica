import { convertirValor, formatearNumero } from './unidades';
import type {
  Calculadora,
  CampoNumero,
  Entradas,
  Resultado,
  Unidad,
  ValoresCalculo,
} from './tipos';

export type ValidacionNumero =
  | { estado: 'vacio' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'ok'; valor: number; valorBase: number };

export type ReglaIncumplida = { id: string; mensaje: string; campos: string[] };

export type EstadoCalculadora = {
  /** Etiquetas de los campos obligatorios que faltan (D11). */
  faltantes: string[];
  /** Error de formato o de rango por id de campo. Cuándo mostrarlo lo decide la UI (D12). */
  errores: Record<string, string>;
  reglas: ReglaIncumplida[];
  /** Solo existe cuando todo está completo y es válido: nunca hay resultado parcial. */
  resultado?: Resultado;
};

const TOLERANCIA = 1e-9;

export function unidadDe(campo: CampoNumero, unidadId?: string): Unidad {
  return campo.unidades.find((u) => u.id === unidadId) ?? campo.unidades[0];
}

export function validarNumero(
  campo: CampoNumero,
  texto: string | undefined,
  unidadId?: string,
): ValidacionNumero {
  const t = (texto ?? '').trim();
  if (t === '') {
    return { estado: 'vacio' };
  }

  const patron = campo.entero ? /^\d+$/ : /^(\d+\.?\d*|\.\d+)$/;
  if (!patron.test(t)) {
    return {
      estado: 'error',
      mensaje: campo.entero ? 'Escribe un número entero' : 'Escribe solo números',
    };
  }

  const unidad = unidadDe(campo, unidadId);
  const valor = Number(t);
  const valorBase = valor * unidad.factor;
  const { min, max } = campo.rangoValido;

  if (valorBase < min - TOLERANCIA || valorBase > max + TOLERANCIA) {
    const base = campo.unidades[0];
    const minU = formatearNumero(convertirValor(min, base, unidad), unidad.decimales);
    const maxU = formatearNumero(convertirValor(max, base, unidad), unidad.decimales);
    return { estado: 'error', mensaje: `Debe estar entre ${minU} y ${maxU} ${unidad.etiqueta}` };
  }

  return { estado: 'ok', valor, valorBase };
}

/** Evalúa el estado de una calculadora: faltantes, errores o resultado (F03). */
export function evaluar(calculadora: Calculadora, entradas: Entradas): EstadoCalculadora {
  const faltantes: string[] = [];
  const errores: Record<string, string> = {};
  const valores: ValoresCalculo = {};

  for (const campo of calculadora.campos) {
    const crudo = entradas.valores[campo.id];

    if (campo.tipo === 'numero') {
      const r = validarNumero(
        campo,
        typeof crudo === 'string' ? crudo : undefined,
        entradas.unidades?.[campo.id],
      );
      if (r.estado === 'vacio') {
        if (!campo.opcional) faltantes.push(campo.etiqueta);
      } else if (r.estado === 'error') {
        errores[campo.id] = r.mensaje;
      } else {
        valores[campo.id] = r.valorBase;
      }
    } else if (campo.tipo === 'opcion') {
      const valida = typeof crudo === 'string' && campo.opciones.some((o) => o.valor === crudo);
      if (valida) {
        valores[campo.id] = crudo;
      } else if (!campo.opcional) {
        faltantes.push(campo.etiqueta);
      }
    } else {
      const valor = typeof crudo === 'boolean' ? crudo : campo.valorInicial;
      if (valor === undefined) {
        if (!campo.opcional) faltantes.push(campo.etiqueta);
      } else {
        valores[campo.id] = valor;
      }
    }
  }

  const reglas: ReglaIncumplida[] = calculadora.reglas
    .filter((r) => r.campos.every((id) => valores[id] !== undefined) && !r.cumple(valores))
    .map((r) => ({ id: r.id, mensaje: r.mensaje, campos: r.campos }));

  const hayProblemas =
    faltantes.length > 0 || Object.keys(errores).length > 0 || reglas.length > 0;

  return {
    faltantes,
    errores,
    reglas,
    resultado: hayProblemas ? undefined : calculadora.calcular(valores),
  };
}
