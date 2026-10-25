// C18: Criterios ACR/EULAR 2010 de artritis reumatoide. Spec: specs/calculators/C18-acr-eular-2010.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, Resultado, ValoresCalculo } from '../tipos';

const campos: Calculadora['campos'] = [
  {
    tipo: 'sino',
    id: 'sinovitis',
    etiqueta: 'Sinovitis clínica definida (inflamación) en al menos una articulación, no explicada por otra enfermedad',
    valorInicial: false,
  },
  {
    tipo: 'opcion',
    id: 'articulaciones',
    etiqueta: 'Articulaciones afectadas',
    opciones: [
      { valor: '1grande', etiqueta: '1 articulación grande', puntos: 0 },
      { valor: '2a10grandes', etiqueta: '2 a 10 articulaciones grandes', puntos: 1 },
      { valor: '1a3pequenas', etiqueta: '1 a 3 articulaciones pequeñas (con o sin grandes)', puntos: 2 },
      { valor: '4a10pequenas', etiqueta: '4 a 10 articulaciones pequeñas (con o sin grandes)', puntos: 3 },
      { valor: 'mas10', etiqueta: 'Más de 10 articulaciones (al menos 1 pequeña)', puntos: 5 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'serologia',
    etiqueta: 'Serología (factor reumatoide y anti-CCP)',
    opciones: [
      { valor: 'negativos', etiqueta: 'Ambos negativos', puntos: 0 },
      { valor: 'bajo', etiqueta: 'Positivo bajo (1 a 3 veces el límite superior normal)', puntos: 2 },
      { valor: 'alto', etiqueta: 'Positivo alto (más de 3 veces el límite superior normal)', puntos: 3 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'reactantes',
    etiqueta: 'Reactantes de fase aguda (PCR y VSG)',
    opciones: [
      { valor: 'normales', etiqueta: 'PCR y VSG normales', puntos: 0 },
      { valor: 'anormales', etiqueta: 'PCR o VSG anormal', puntos: 1 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'duracion',
    etiqueta: 'Duración de los síntomas (referida por el paciente)',
    opciones: [
      { valor: 'menos6', etiqueta: 'Menos de 6 semanas', puntos: 0 },
      { valor: '6mas', etiqueta: '6 semanas o más', puntos: 1 },
    ],
  },
];

export function calcularAcrEular2010(valores: ValoresCalculo): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  const texto =
    valores.sinovitis !== true
      ? 'No aplica: los criterios se usan en pacientes con sinovitis clínica definida no explicada por otra enfermedad.'
      : puntaje >= 6
        ? 'Cumple los criterios de clasificación de artritis reumatoide (6 puntos o más).'
        : 'No cumple los criterios (menos de 6 puntos); puede reevaluarse con el tiempo.';
  return {
    valor: puntaje,
    unidad: 'de 10',
    interpretacion: `${texto} Son criterios de clasificación, no de diagnóstico.`,
  };
}

export const acrEular2010: Calculadora = {
  id: 'acr-eular-2010',
  nombre: 'ACR/EULAR 2010 (artritis reumatoide)',
  descripcion: 'Criterios de clasificación de artritis reumatoide.',
  especialidades: ['Reumatología'],
  palabrasClave: ['ACR', 'EULAR', 'artritis reumatoide', 'AR', 'RA', 'reumatología', 'anti-CCP', 'factor reumatoide'],
  version: 1,
  fuente:
    'Aletaha D, et al. 2010 Rheumatoid arthritis classification criteria: an American College of Rheumatology/European League Against Rheumatism collaborative initiative. Arthritis Rheum 2010;62:2569-81.',
  notaFuente:
    'Articulaciones excluidas del conteo: interfalángicas distales, primera carpometacarpiana y primera metatarsofalángica. Pequeñas: metacarpofalángicas, interfalángicas proximales, 2.ª a 5.ª metatarsofalángicas, interfalángica del pulgar y muñecas. Grandes: hombros, codos, caderas, rodillas y tobillos.',
  campos,
  reglas: [],
  calcular: calcularAcrEular2010,
};
