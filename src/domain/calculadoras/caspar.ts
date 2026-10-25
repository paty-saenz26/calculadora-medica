// C17: CASPAR. Spec: specs/calculators/C17-caspar.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoSiNo, Resultado, ValoresCalculo } from '../tipos';

const siNo = (id: string, etiqueta: string, puntos?: number): CampoSiNo => ({
  tipo: 'sino',
  id,
  etiqueta,
  puntos,
  valorInicial: false,
});

const campos: Calculadora['campos'] = [
  siNo('articular', 'Enfermedad articular inflamatoria (articulaciones, columna o entesis)'),
  {
    tipo: 'opcion',
    id: 'psoriasis',
    etiqueta: 'Evidencia de psoriasis',
    opciones: [
      { valor: 'ninguna', etiqueta: 'Ninguna', puntos: 0 },
      { valor: 'antecedente', etiqueta: 'Antecedente personal, o familiar de primer o segundo grado', puntos: 1 },
      { valor: 'actual', etiqueta: 'Psoriasis actual (diagnosticada por reumatólogo o dermatólogo)', puntos: 2 },
    ],
  },
  siNo('ungueal', 'Distrofia ungueal psoriásica típica (onicólisis, punteado, hiperqueratosis)', 1),
  siNo('fr', 'Factor reumatoide negativo (cualquier método excepto látex)', 1),
  siNo('dactilitis', 'Dactilitis actual (dedo completo inflamado) o antecedente registrado por un reumatólogo', 1),
  siNo('hueso', 'Formación ósea yuxtaarticular en radiografía de mano o pie (no osteofitos)', 1),
];

export function calcularCaspar(valores: ValoresCalculo): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  const previo = valores.articular === true;
  const texto = !previo
    ? 'No aplica: los criterios requieren enfermedad articular inflamatoria (articulaciones, columna o entesis).'
    : puntaje >= 3
      ? 'Cumple los criterios CASPAR de artritis psoriásica (3 puntos o más).'
      : 'No cumple los criterios CASPAR (menos de 3 puntos).';
  return {
    valor: puntaje,
    unidad: 'de 6',
    interpretacion: `${texto} Son criterios de clasificación, no de diagnóstico.`,
  };
}

export const caspar: Calculadora = {
  id: 'caspar',
  nombre: 'CASPAR',
  descripcion: 'Criterios de clasificación de artritis psoriásica.',
  especialidades: ['Reumatología'],
  palabrasClave: ['CASPAR', 'artritis psoriásica', 'psoriasis', 'reumatología', 'PsA'],
  version: 1,
  fuente:
    'Taylor W, et al. Classification criteria for psoriatic arthritis: development of new criteria from a large international study. Arthritis Rheum 2006;54:2665-73.',
  campos,
  reglas: [],
  calcular: calcularCaspar,
};
