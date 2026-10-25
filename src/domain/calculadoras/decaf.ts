// C20: DECAF. Spec: specs/calculators/C20-decaf.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoSiNo, Resultado, ValoresCalculo } from '../tipos';

const siNo = (id: string, etiqueta: string): CampoSiNo => ({
  tipo: 'sino',
  id,
  etiqueta,
  puntos: 1,
  valorInicial: false,
});

const campos: Calculadora['campos'] = [
  {
    tipo: 'opcion',
    id: 'disnea',
    etiqueta: 'Disnea (MRC extendida, eMRCD)',
    opciones: [
      { valor: '1a4', etiqueta: 'eMRCD 1 a 4', puntos: 0 },
      { valor: '5a', etiqueta: 'eMRCD 5a: demasiada disnea para salir de casa sin ayuda, pero se asea y se viste solo', puntos: 1 },
      { valor: '5b', etiqueta: 'eMRCD 5b: demasiada disnea para salir de casa y necesita ayuda para asearse o vestirse', puntos: 2 },
    ],
  },
  siNo('eosinopenia', 'Eosinopenia: eosinófilos menores de 0.05 × 10⁹/L'),
  siNo('consolidacion', 'Consolidación nueva en la radiografía de tórax'),
  siNo('acidemia', 'Acidemia: pH menor de 7.30'),
  siNo('fa', 'Fibrilación auricular confirmada por ECG al ingreso'),
];

export function grupoDecaf(puntaje: number): { grupo: 'bajo' | 'intermedio' | 'alto'; mortalidad: string } {
  if (puntaje >= 3) return { grupo: 'alto', mortalidad: '34.6%' };
  if (puntaje === 2) return { grupo: 'intermedio', mortalidad: '8.4%' };
  return { grupo: 'bajo', mortalidad: '1.4%' };
}

export function calcularDecaf(valores: ValoresCalculo): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  const { grupo, mortalidad } = grupoDecaf(puntaje);
  return {
    valor: puntaje,
    unidad: 'de 6',
    interpretacion: `Riesgo ${grupo} de muerte hospitalaria en exacerbación de EPOC (${mortalidad} en la cohorte de derivación). Es un apoyo y no sustituye el criterio clínico.`,
  };
}

export const decaf: Calculadora = {
  id: 'decaf',
  nombre: 'DECAF',
  descripcion: 'Mortalidad hospitalaria en exacerbación de EPOC.',
  especialidades: ['Neumología'],
  palabrasClave: ['DECAF', 'EPOC', 'COPD', 'exacerbación', 'mortalidad', 'disnea', 'eMRCD'],
  version: 1,
  fuente: 'Steer J, Gibson GJ, Bourke SC. The DECAF score: predicting hospital mortality in exacerbations of chronic obstructive pulmonary disease. Thorax 2012;67:970-6.',
  campos,
  reglas: [],
  calcular: calcularDecaf,
};
