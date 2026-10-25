// C07: Déficit de bicarbonato. Spec: specs/calculators/C07-deficit-bicarbonato.md
import type { Calculadora, Resultado } from '../tipos';

export const BICARBONATO_OBJETIVO_POR_DEFECTO = 24;
const FACTOR = 0.5;

const NOTA =
  'Estimación de la cantidad de bicarbonato (mEq) necesaria para llevar el nivel sérico al valor deseado. El uso de bicarbonato es controvertido en algunos pacientes y la dosis depende de la causa y la gravedad: decida según el criterio clínico.';

/** Déficit = 0.5 × peso (kg) × (bicarbonato deseado − medido). Resultado en mEq, redondeado al entero. */
export function calcularDeficitBicarbonato(
  pesoKg: number,
  bicarbonatoMedido: number,
  bicarbonatoDeseado: number = BICARBONATO_OBJETIVO_POR_DEFECTO,
): Resultado {
  const deficit = FACTOR * pesoKg * (bicarbonatoDeseado - bicarbonatoMedido);
  if (deficit <= 0) {
    return {
      valor: 0,
      unidad: 'mEq',
      interpretacion: `No hay déficit: el bicarbonato medido ya está en el valor deseado o por encima. ${NOTA}`,
    };
  }
  return { valor: Math.round(deficit), unidad: 'mEq', interpretacion: NOTA };
}

export const deficitBicarbonato: Calculadora = {
  id: 'deficit-bicarbonato',
  nombre: 'Déficit de bicarbonato',
  descripcion: 'Estima el bicarbonato que falta para llegar al valor deseado.',
  especialidades: ['Renal'],
  palabrasClave: ['bicarbonato', 'acidosis metabólica', 'HCO3', 'bicarbonato de sodio', 'reposición'],
  version: 1,
  fuente:
    'Sabatini S, Kurtzman NA. Bicarbonate therapy in severe metabolic acidosis. J Am Soc Nephrol 2009. Lim S. Metabolic acidosis. Acta Med Indones 2007.',
  campos: [
    {
      tipo: 'numero',
      id: 'peso',
      etiqueta: 'Peso',
      unidades: [
        { id: 'kg', etiqueta: 'kg', factor: 1, decimales: 1 },
        { id: 'lb', etiqueta: 'lb', factor: 0.45359237, decimales: 1 },
      ],
      rangoValido: { min: 20, max: 300 },
    },
    {
      tipo: 'numero',
      id: 'medido',
      etiqueta: 'Bicarbonato sérico',
      unidades: [{ id: 'meql', etiqueta: 'mEq/L', factor: 1, decimales: 1 }],
      rangoValido: { min: 1, max: 40 },
    },
    {
      tipo: 'numero',
      id: 'deseado',
      etiqueta: 'Bicarbonato deseado (opcional)',
      unidades: [{ id: 'meql', etiqueta: 'mEq/L', factor: 1, decimales: 1 }],
      rangoValido: { min: 10, max: 40 },
      pista: 'Si lo dejas vacío: 24',
      opcional: true,
    },
  ],
  reglas: [],
  calcular: (v) =>
    calcularDeficitBicarbonato(
      v.peso as number,
      v.medido as number,
      (v.deseado as number | undefined) ?? BICARBONATO_OBJETIVO_POR_DEFECTO,
    ),
};
