// C14: ECOG. Spec: specs/calculators/C14-ecog.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, Resultado, ValoresCalculo } from '../tipos';

const campos: Calculadora['campos'] = [
  {
    tipo: 'opcion',
    id: 'estado',
    etiqueta: 'Estado funcional',
    opciones: [
      { valor: '0', etiqueta: '0: Totalmente activo, sin restricción', puntos: 0 },
      { valor: '1', etiqueta: '1: Restricción en actividad física intensa, pero ambulatorio y capaz de trabajo ligero o sedentario', puntos: 1 },
      { valor: '2', etiqueta: '2: Ambulatorio y capaz de autocuidado, pero incapaz de trabajar; en pie más del 50% del día', puntos: 2 },
      { valor: '3', etiqueta: '3: Autocuidado limitado; en cama o silla más del 50% del día', puntos: 3 },
      { valor: '4', etiqueta: '4: Totalmente incapacitado; sin autocuidado; confinado a cama o silla', puntos: 4 },
      { valor: '5', etiqueta: '5: Fallecido', puntos: 5 },
    ],
  },
];

const DESCRIPCION: Record<number, string> = {
  0: 'Totalmente activo, sin restricción.',
  1: 'Restricción en actividad física intensa; ambulatorio, capaz de trabajo ligero.',
  2: 'Ambulatorio, capaz de autocuidado, incapaz de trabajar; en pie más del 50% del día.',
  3: 'Autocuidado limitado; en cama o silla más del 50% del día.',
  4: 'Totalmente incapacitado; sin autocuidado; confinado a cama o silla.',
  5: 'Fallecido.',
};

export function calcularEcog(valores: ValoresCalculo): Resultado {
  const grado = sumarPuntos(campos, valores);
  return { valor: grado, unidad: 'grado', interpretacion: DESCRIPCION[grado] };
}

export const ecog: Calculadora = {
  id: 'ecog',
  nombre: 'ECOG',
  descripcion: 'Estado funcional del paciente oncológico.',
  especialidades: ['Oncología'],
  palabrasClave: ['ECOG', 'estado funcional', 'performance status', 'oncología', 'cáncer'],
  version: 1,
  fuente: 'Oken MM, et al. Toxicity and response criteria of the Eastern Cooperative Oncology Group. Am J Clin Oncol 1982;5:649-55.',
  campos,
  reglas: [],
  calcular: calcularEcog,
};
