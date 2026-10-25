// C08: CKD-EPI 2021 (creatinina). Spec: specs/calculators/C08-ckd-epi-2021.md
import type { Calculadora, Resultado } from '../tipos';

const NOTA =
  'Estimación de la tasa de filtrado glomerular. En ausencia de marcadores de daño renal, las categorías G1 y G2 no cumplen criterios de enfermedad renal crónica.';

/** Categoría G según el valor mostrado (entero). */
export function categoriaTfg(tfgMostrada: number): string {
  if (tfgMostrada >= 90) return 'G1: normal o alta';
  if (tfgMostrada >= 60) return 'G2: ligeramente disminuida';
  if (tfgMostrada >= 45) return 'G3a: ligera a moderadamente disminuida';
  if (tfgMostrada >= 30) return 'G3b: moderada a gravemente disminuida';
  if (tfgMostrada >= 15) return 'G4: gravemente disminuida';
  return 'G5: falla renal';
}

/** eGFRcr = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^edad × 1.012 (si es mujer). Scr en mg/dL. */
export function calcularCkdEpi2021(sexo: 'mujer' | 'hombre', edad: number, creatininaMgDl: number): Resultado {
  const mujer = sexo === 'mujer';
  const kappa = mujer ? 0.7 : 0.9;
  const alfa = mujer ? -0.241 : -0.302;
  const relacion = creatininaMgDl / kappa;
  const tfg =
    142 *
    Math.min(relacion, 1) ** alfa *
    Math.max(relacion, 1) ** -1.2 *
    0.9938 ** edad *
    (mujer ? 1.012 : 1);
  const valor = Math.round(tfg);
  return {
    valor,
    unidad: 'mL/min/1.73 m²',
    interpretacion: `${categoriaTfg(valor)}. ${NOTA}`,
  };
}

export const ckdEpi2021: Calculadora = {
  id: 'ckd-epi-2021',
  nombre: 'CKD-EPI 2021 (TFG)',
  descripcion: 'Estima la tasa de filtrado glomerular con creatinina.',
  especialidades: ['Renal'],
  palabrasClave: ['CKD-EPI', 'TFG', 'GFR', 'eGFR', 'filtrado glomerular', 'creatinina', 'función renal', 'enfermedad renal crónica'],
  version: 1,
  fuente:
    'Inker LA, et al. New creatinine- and cystatin C-based equations to estimate GFR without race. N Engl J Med 2021;385:1737-49.',
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
    calcularCkdEpi2021(v.sexo as 'mujer' | 'hombre', v.edad as number, v.creatinina as number),
};
