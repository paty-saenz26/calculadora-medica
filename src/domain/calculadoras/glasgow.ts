// C12: Escala de coma de Glasgow. Spec: specs/calculators/C12-glasgow.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, Resultado, ValoresCalculo } from '../tipos';

const campos: Calculadora['campos'] = [
  {
    tipo: 'opcion',
    id: 'ocular',
    etiqueta: 'Apertura ocular',
    opciones: [
      { valor: 'espontanea', etiqueta: 'Espontánea', puntos: 4 },
      { valor: 'voz', etiqueta: 'Al estímulo verbal', puntos: 3 },
      { valor: 'dolor', etiqueta: 'Al dolor', puntos: 2 },
      { valor: 'ninguna', etiqueta: 'Ninguna', puntos: 1 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'verbal',
    etiqueta: 'Respuesta verbal',
    opciones: [
      { valor: 'orientado', etiqueta: 'Orientado', puntos: 5 },
      { valor: 'confuso', etiqueta: 'Confuso', puntos: 4 },
      { valor: 'palabras', etiqueta: 'Palabras inapropiadas', puntos: 3 },
      { valor: 'sonidos', etiqueta: 'Sonidos incomprensibles', puntos: 2 },
      { valor: 'ninguna', etiqueta: 'Ninguna', puntos: 1 },
    ],
  },
  {
    tipo: 'opcion',
    id: 'motora',
    etiqueta: 'Respuesta motora',
    opciones: [
      { valor: 'obedece', etiqueta: 'Obedece órdenes', puntos: 6 },
      { valor: 'localiza', etiqueta: 'Localiza el dolor', puntos: 5 },
      { valor: 'retira', etiqueta: 'Retira ante el dolor', puntos: 4 },
      { valor: 'flexion', etiqueta: 'Flexión anormal (decorticación)', puntos: 3 },
      { valor: 'extension', etiqueta: 'Extensión (descerebración)', puntos: 2 },
      { valor: 'ninguna', etiqueta: 'Ninguna', puntos: 1 },
    ],
  },
];

export function gravedadGlasgow(total: number): 'leve' | 'moderado' | 'grave' {
  if (total <= 8) return 'grave';
  if (total <= 12) return 'moderado';
  return 'leve';
}

function puntosDe(id: string, valores: ValoresCalculo): number {
  return sumarPuntos(campos.filter((c) => c.id === id), valores);
}

export function calcularGlasgow(valores: ValoresCalculo): Resultado {
  const total = sumarPuntos(campos, valores);
  const o = puntosDe('ocular', valores);
  const v = puntosDe('verbal', valores);
  const m = puntosDe('motora', valores);
  return {
    valor: total,
    unidad: 'de 15',
    interpretacion: `O${o} V${v} M${m}. Alteración de la conciencia ${gravedadGlasgow(total)} (clasificación habitual en traumatismo craneoencefálico: 13 a 15 leve, 9 a 12 moderada, 3 a 8 grave). Si algún componente no se puede evaluar, no use el total.`,
  };
}

export const glasgow: Calculadora = {
  id: 'glasgow',
  nombre: 'Escala de coma de Glasgow',
  descripcion: 'Nivel de conciencia con respuesta ocular, verbal y motora.',
  especialidades: ['Neurología', 'Urgencias', 'Cuidados intensivos'],
  palabrasClave: ['Glasgow', 'GCS', 'coma', 'conciencia', 'TCE', 'neurológico'],
  version: 1,
  fuente: 'Teasdale G, Jennett B. Assessment of coma and impaired consciousness. A practical scale. Lancet 1974;2:81-4.',
  campos,
  reglas: [],
  calcular: calcularGlasgow,
};
