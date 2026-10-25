// C13: Child-Pugh. Spec: specs/calculators/C13-child-pugh.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, Resultado, ValoresCalculo } from '../tipos';

const NOTA = 'Estima la gravedad de la cirrosis. La puntuación se interpreta junto con el contexto clínico.';

const campos: Calculadora['campos'] = [
  {
    tipo: 'opcion',
    id: 'bilirrubina',
    etiqueta: 'Bilirrubina total',
    opciones: [
      { valor: 'menos2', etiqueta: 'Menos de 2 mg/dL (menos de 34 µmol/L)', puntos: 1 },
      { valor: '2a3', etiqueta: '2 a 3 mg/dL (34 a 50 µmol/L)', puntos: 2 },
      { valor: 'mas3', etiqueta: 'Más de 3 mg/dL (más de 50 µmol/L)', puntos: 3 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'albumina',
    etiqueta: 'Albúmina sérica',
    opciones: [
      { valor: 'mas35', etiqueta: 'Más de 3.5 g/dL', puntos: 1 },
      { valor: '28a35', etiqueta: '2.8 a 3.5 g/dL', puntos: 2 },
      { valor: 'menos28', etiqueta: 'Menos de 2.8 g/dL', puntos: 3 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'inr',
    etiqueta: 'INR',
    opciones: [
      { valor: 'menos17', etiqueta: 'Menos de 1.7', puntos: 1 },
      { valor: '17a23', etiqueta: '1.7 a 2.3', puntos: 2 },
      { valor: 'mas23', etiqueta: 'Más de 2.3', puntos: 3 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'ascitis',
    etiqueta: 'Ascitis',
    opciones: [
      { valor: 'ninguna', etiqueta: 'Ninguna', puntos: 1 },
      { valor: 'leve', etiqueta: 'Leve, o controlada con medicamentos', puntos: 2 },
      { valor: 'moderada', etiqueta: 'Moderada a grave, o refractaria', puntos: 3 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'encefalopatia',
    etiqueta: 'Encefalopatía hepática',
    opciones: [
      { valor: 'ninguna', etiqueta: 'Ninguna', puntos: 1 },
      { valor: 'grado12', etiqueta: 'Grado I a II', puntos: 2 },
      { valor: 'grado34', etiqueta: 'Grado III a IV', puntos: 3 },
    ],
  },
];

export function claseChildPugh(puntaje: number): 'A' | 'B' | 'C' {
  if (puntaje >= 10) return 'C';
  if (puntaje >= 7) return 'B';
  return 'A';
}

export function calcularChildPugh(valores: ValoresCalculo): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  const clase = claseChildPugh(puntaje);
  return {
    valor: puntaje,
    unidad: 'de 15',
    interpretacion: `Clase ${clase} (A: 5 a 6, B: 7 a 9, C: 10 a 15). ${NOTA}`,
  };
}

export const childPugh: Calculadora = {
  id: 'child-pugh',
  nombre: 'Child-Pugh',
  descripcion: 'Gravedad de la cirrosis hepática.',
  especialidades: ['Gastroenterología'],
  palabrasClave: ['Child-Pugh', 'Child Pugh', 'Child-Turcotte', 'cirrosis', 'hepática', 'ascitis', 'higado'],
  version: 1,
  fuente:
    'Child CG, Turcotte JG. Surgery and portal hypertension. En: The Liver and Portal Hypertension. Saunders; 1964. Pugh RNH, et al. Br J Surg 1973;60:646-9.',
  notaFuente: 'Se usa el INR (no el tiempo de protrombina). Los cortes de bilirrubina son los estándar, no los modificados para colangitis biliar.',
  campos,
  reglas: [],
  calcular: calcularChildPugh,
};
