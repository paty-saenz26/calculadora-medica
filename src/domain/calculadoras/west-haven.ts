// C15: West Haven. Spec: specs/calculators/C15-west-haven.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, Resultado, ValoresCalculo } from '../tipos';

const campos: Calculadora['campos'] = [
  {
    tipo: 'opcion',
    id: 'grado',
    etiqueta: 'Estado mental',
    opciones: [
      { valor: '0', etiqueta: 'Grado 0: sin cambios evidentes', puntos: 0 },
      { valor: '1', etiqueta: 'Grado 1: falta leve de atención, euforia o ansiedad, atención acortada, dificultad para sumar o restar', puntos: 1 },
      { valor: '2', etiqueta: 'Grado 2: letargo o apatía, desorientación leve en tiempo o lugar, cambio sutil de personalidad, conducta inapropiada', puntos: 2 },
      { valor: '3', etiqueta: 'Grado 3: somnolencia a semiestupor, responde a estímulos verbales, confusión y desorientación marcada', puntos: 3 },
      { valor: '4', etiqueta: 'Grado 4: coma', puntos: 4 },
    ],
  },
];

const DESCRIPCION: Record<number, string> = {
  0: 'Sin cambios evidentes en el estado mental.',
  1: 'Falta leve de atención, euforia o ansiedad, atención acortada, dificultad para sumar o restar.',
  2: 'Letargo o apatía, desorientación leve, cambio sutil de personalidad, conducta inapropiada.',
  3: 'Somnolencia a semiestupor, responde a estímulos verbales, confusión y desorientación marcada.',
  4: 'Coma.',
};

export function calcularWestHaven(valores: ValoresCalculo): Resultado {
  const grado = sumarPuntos(campos, valores);
  return {
    valor: grado,
    unidad: 'grado',
    interpretacion: `${DESCRIPCION[grado]} Clasificación de la gravedad de la encefalopatía hepática.`,
  };
}

export const westHaven: Calculadora = {
  id: 'west-haven',
  nombre: 'West Haven',
  descripcion: 'Grado de encefalopatía hepática.',
  especialidades: ['Gastroenterología'],
  palabrasClave: ['West Haven', 'encefalopatía hepática', 'encefalopatia', 'cirrosis', 'hepática'],
  version: 1,
  fuente:
    'Conn HO, et al. Comparison of lactulose and neomycin in the treatment of chronic portal-systemic encephalopathy. A double blind controlled trial. Gastroenterology 1977;72:573-83.',
  campos,
  reglas: [],
  calcular: calcularWestHaven,
};
