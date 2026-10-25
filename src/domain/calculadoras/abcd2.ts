// C11: ABCD². Spec: specs/calculators/C11-abcd2.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoSiNo, Resultado, ValoresCalculo } from '../tipos';

const NOTA =
  'Riesgo de ictus a 2 días después de un ataque isquémico transitorio. Es un apoyo y no sustituye la valoración neurológica.';

const siNo = (id: string, etiqueta: string): CampoSiNo => ({
  tipo: 'sino',
  id,
  etiqueta,
  puntos: 1,
  valorInicial: false,
});

const campos: Calculadora['campos'] = [
  siNo('edad', 'Edad de 60 años o más'),
  siNo('presion', 'Presión arterial al evaluar de 140/90 mmHg o más'),
  {
    tipo: 'opcion',
    id: 'clinica',
    etiqueta: 'Características clínicas',
    opciones: [
      { valor: 'ninguna', etiqueta: 'Sin debilidad unilateral ni alteración del habla', puntos: 0 },
      { valor: 'habla', etiqueta: 'Alteración del habla sin debilidad', puntos: 1 },
      { valor: 'debilidad', etiqueta: 'Debilidad unilateral', puntos: 2 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'duracion',
    etiqueta: 'Duración de los síntomas',
    opciones: [
      { valor: 'menos10', etiqueta: 'Menos de 10 minutos', puntos: 0 },
      { valor: '10a59', etiqueta: '10 a 59 minutos', puntos: 1 },
      { valor: '60mas', etiqueta: '60 minutos o más', puntos: 2 },
    ],
  },
  siNo('diabetes', 'Diabetes'),
];

export function categoriaAbcd2(puntaje: number): { nivel: 'bajo' | 'moderado' | 'alto'; riesgo: string } {
  if (puntaje >= 6) return { nivel: 'alto', riesgo: '8.1%' };
  if (puntaje >= 4) return { nivel: 'moderado', riesgo: '4.1%' };
  return { nivel: 'bajo', riesgo: '1.0%' };
}

export function calcularAbcd2(valores: ValoresCalculo): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  const { nivel, riesgo } = categoriaAbcd2(puntaje);
  return {
    valor: puntaje,
    unidad: 'de 7',
    interpretacion: `Riesgo ${nivel} (ictus a 2 días: ${riesgo} en la cohorte de validación). ${NOTA}`,
  };
}

export const abcd2: Calculadora = {
  id: 'abcd2',
  nombre: 'ABCD²',
  descripcion: 'Riesgo de ictus a corto plazo después de un AIT.',
  especialidades: ['Neurología', 'Urgencias'],
  palabrasClave: ['ABCD2', 'AIT', 'ataque isquémico transitorio', 'TIA', 'ictus', 'EVC'],
  version: 1,
  fuente:
    'Johnston SC, et al. Validation and refinement of scores to predict very early stroke risk after transient ischaemic attack. Lancet 2007;369:283-92.',
  campos,
  reglas: [],
  calcular: calcularAbcd2,
};
