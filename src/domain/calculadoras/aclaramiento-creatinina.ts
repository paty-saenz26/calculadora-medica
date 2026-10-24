// C03: Aclaramiento de creatinina (Cockcroft-Gault). Spec: specs/calculators/C03-aclaramiento-creatinina.md
import type { Calculadora, Resultado } from '../tipos';

const NOTA =
  'Estimación para apoyar el ajuste de dosis de fármacos de eliminación renal en adultos. Los puntos de corte para ajustar dosis dependen de cada fármaco: consulte su ficha técnica.';

/** Con peso en kg y creatinina en mg/dL. Resultado en mL/min, redondeado al entero. */
export function calcularAclaramientoCreatinina(
  sexo: 'mujer' | 'hombre',
  edad: number,
  pesoKg: number,
  creatininaMgDl: number,
): Resultado {
  const base = ((140 - edad) * pesoKg) / (72 * creatininaMgDl);
  const crcl = sexo === 'mujer' ? base * 0.85 : base;
  return { valor: Math.round(crcl), unidad: 'mL/min', interpretacion: NOTA };
}

export const aclaramientoCreatinina: Calculadora = {
  id: 'aclaramiento-creatinina',
  nombre: 'Aclaramiento de creatinina (Cockcroft-Gault)',
  descripcion: 'Estima el aclaramiento de creatinina para ajustar dosis de fármacos.',
  especialidades: ['Renal'],
  palabrasClave: ['Cockcroft', 'Gault', 'CrCl', 'creatinina', 'filtrado glomerular', 'función renal', 'TFG'],
  version: 1,
  fuente: 'Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron 1976;16:31-41.',
  campos: [
    {
      tipo: 'opcion',
      id: 'sexo',
      etiqueta: 'Sexo',
      opciones: [
        { valor: 'mujer', etiqueta: 'Mujer' },
        { valor: 'hombre', etiqueta: 'Hombre' },
      ],
    },
    {
      tipo: 'numero',
      id: 'edad',
      etiqueta: 'Edad',
      unidades: [{ id: 'anios', etiqueta: 'años', factor: 1, decimales: 0 }],
      rangoValido: { min: 18, max: 120 },
      entero: true,
    },
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
      id: 'creatinina',
      etiqueta: 'Creatinina sérica',
      unidades: [
        { id: 'mgdl', etiqueta: 'mg/dL', factor: 1, decimales: 2 },
        { id: 'umoll', etiqueta: 'µmol/L', factor: 1 / 88.4, decimales: 0 },
      ],
      rangoValido: { min: 0.2, max: 20 },
    },
  ],
  reglas: [],
  calcular: (v) =>
    calcularAclaramientoCreatinina(
      v.sexo as 'mujer' | 'hombre',
      v.edad as number,
      v.peso as number,
      v.creatinina as number,
    ),
};
