// C06: CHA₂DS₂-VA. Spec: specs/calculators/C06-cha2ds2-va.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoSiNo, Resultado } from '../tipos';

const NOTA =
  'No incluye el sexo como factor. La decisión de anticoagular depende de las guías vigentes y del criterio clínico.';

const siNo = (id: string, etiqueta: string, puntos: number): CampoSiNo => ({
  tipo: 'sino',
  id,
  etiqueta,
  puntos,
  valorInicial: false,
});

const campos: Calculadora['campos'] = [
  {
    tipo: 'opcion',
    id: 'edad',
    etiqueta: 'Edad',
    opciones: [
      { valor: 'menor65', etiqueta: 'Menor de 65 años', puntos: 0 },
      { valor: '65a74', etiqueta: '65 a 74 años', puntos: 1 },
      { valor: '75mas', etiqueta: '75 años o más', puntos: 2 },
    ],
  },
  siNo('icc', 'Insuficiencia cardiaca crónica', 1),
  siNo('hta', 'Hipertensión', 1),
  siNo('dm', 'Diabetes mellitus', 1),
  siNo('ictus', 'Ictus, AIT o tromboembolia arterial previa', 2),
  siNo('vascular', 'Enfermedad vascular', 1),
];

/** Recomendación según el puntaje (guía ESC 2024 de fibrilación auricular). */
export function recomendacionChaDsVa(puntos: number): string {
  if (puntos === 0) return 'Riesgo bajo: no se recomienda anticoagulación.';
  if (puntos === 1) return 'Riesgo intermedio: se debe considerar la anticoagulación oral.';
  return 'Riesgo alto: se recomienda anticoagulación oral.';
}

export function calcularChaDsVa(valores: Parameters<Calculadora['calcular']>[0]): Resultado {
  const puntos = sumarPuntos(campos, valores);
  return { valor: puntos, unidad: 'de 8', interpretacion: `${recomendacionChaDsVa(puntos)} ${NOTA}` };
}

export const chaDsVa: Calculadora = {
  id: 'cha2ds2-va',
  nombre: 'CHA₂DS₂-VA',
  descripcion: 'Riesgo de ictus en fibrilación auricular, sin considerar el sexo.',
  especialidades: ['Cardiovascular'],
  palabrasClave: ['CHA2DS2-VA', 'CHADS-VA', 'fibrilación auricular', 'ictus', 'anticoagulación', 'ESC 2024'],
  version: 1,
  fuente:
    'Van Gelder IC, et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J 2024.',
  campos,
  reglas: [],
  calcular: calcularChaDsVa,
};
