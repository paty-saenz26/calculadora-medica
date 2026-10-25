// C16: NIHSS. Spec: specs/calculators/C16-nihss.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoOpcion, Resultado, ValoresCalculo } from '../tipos';

const item = (id: string, etiqueta: string, ops: string[]): CampoOpcion => ({
  tipo: 'opcion',
  id,
  etiqueta,
  opciones: ops.map((e, i) => ({ valor: String(i), etiqueta: e, puntos: i })),
});

const campos: Calculadora['campos'] = [
  item('p1a', '1a. Nivel de conciencia', [
    'Alerta, responde con viveza',
    'No alerta, pero despierta con estímulo menor',
    'No alerta; requiere estímulos repetidos o fuertes o dolorosos',
    'Solo respuestas reflejas, o sin respuesta y flácido',
  ]),
  item('p1b', '1b. Preguntas de conciencia (mes y edad)', ['Ambas correctas', 'Una correcta', 'Ninguna correcta']),
  item('p1c', '1c. Órdenes de conciencia (abrir y cerrar ojos, apretar la mano)', [
    'Realiza ambas',
    'Realiza una',
    'No realiza ninguna',
  ]),
  item('p2', '2. Mirada conjugada', [
    'Normal',
    'Parálisis parcial de la mirada',
    'Desviación forzada o parálisis total de la mirada',
  ]),
  item('p3', '3. Campos visuales', [
    'Sin pérdida visual',
    'Hemianopsia parcial',
    'Hemianopsia completa',
    'Hemianopsia bilateral (incluye ceguera)',
  ]),
  item('p4', '4. Parálisis facial', [
    'Movimientos normales y simétricos',
    'Parálisis menor (pliegue nasolabial aplanado, asimetría al sonreír)',
    'Parálisis parcial (cara inferior casi total)',
    'Parálisis completa de uno o ambos lados',
  ]),
  item('p5a', '5a. Motor del brazo izquierdo', [
    'Sin caída durante 10 segundos',
    'Caída antes de 10 segundos sin tocar la cama',
    'Algún esfuerzo contra la gravedad; cae a la cama',
    'Sin esfuerzo contra la gravedad',
    'Sin movimiento',
  ]),
  item('p5b', '5b. Motor del brazo derecho', [
    'Sin caída durante 10 segundos',
    'Caída antes de 10 segundos sin tocar la cama',
    'Algún esfuerzo contra la gravedad; cae a la cama',
    'Sin esfuerzo contra la gravedad',
    'Sin movimiento',
  ]),
  item('p6a', '6a. Motor de la pierna izquierda', [
    'Sin caída durante 5 segundos',
    'Caída antes de 5 segundos sin tocar la cama',
    'Algún esfuerzo contra la gravedad; cae a la cama antes de 5 segundos',
    'Sin esfuerzo contra la gravedad; cae de inmediato',
    'Sin movimiento',
  ]),
  item('p6b', '6b. Motor de la pierna derecha', [
    'Sin caída durante 5 segundos',
    'Caída antes de 5 segundos sin tocar la cama',
    'Algún esfuerzo contra la gravedad; cae a la cama antes de 5 segundos',
    'Sin esfuerzo contra la gravedad; cae de inmediato',
    'Sin movimiento',
  ]),
  item('p7', '7. Ataxia de extremidades', ['Ausente', 'Presente en una extremidad', 'Presente en dos extremidades']),
  item('p8', '8. Sensibilidad', ['Normal', 'Pérdida leve a moderada', 'Pérdida grave o total']),
  item('p9', '9. Mejor lenguaje', [
    'Sin afasia',
    'Afasia leve a moderada',
    'Afasia grave',
    'Mutismo o afasia global',
  ]),
  item('p10', '10. Disartria', ['Normal', 'Leve a moderada', 'Grave (ininteligible) o anartria']),
  item('p11', '11. Extinción e inatención', [
    'Sin anormalidad',
    'Inatención o extinción en una modalidad sensorial',
    'Hemi-inatención profunda o extinción en más de una modalidad',
  ]),
];

export function gravedadNihss(total: number): string {
  if (total === 0) return 'Sin síntomas de ictus';
  if (total <= 4) return 'Ictus leve';
  if (total <= 15) return 'Ictus moderado';
  if (total <= 20) return 'Ictus moderado a grave';
  return 'Ictus grave';
}

export function calcularNihss(valores: ValoresCalculo): Resultado {
  const total = sumarPuntos(campos, valores);
  return {
    valor: total,
    unidad: 'de 42',
    interpretacion: `${gravedadNihss(total)} (0: sin síntomas; 1 a 4: leve; 5 a 15: moderado; 16 a 20: moderado a grave; 21 a 42: grave). Las categorías son orientativas y no sustituyen la valoración neurológica.`,
  };
}

export const nihss: Calculadora = {
  id: 'nihss',
  nombre: 'NIHSS',
  descripcion: 'Escala del ictus de los Institutos Nacionales de Salud (EE. UU.).',
  especialidades: ['Neurología', 'Urgencias'],
  palabrasClave: ['NIHSS', 'NIH', 'ictus', 'EVC', 'infarto cerebral', 'stroke', 'escala neurológica'],
  version: 1,
  fuente:
    'National Institute of Neurological Disorders and Stroke. NIH Stroke Scale (actualización de febrero de 2024). Brott T, et al. Stroke 1989;20:864-70.',
  notaFuente:
    'No incluye la opción "no evaluable" (amputación, fusión articular, intubación); para esos casos consulte las instrucciones oficiales.',
  campos,
  reglas: [],
  calcular: calcularNihss,
};
