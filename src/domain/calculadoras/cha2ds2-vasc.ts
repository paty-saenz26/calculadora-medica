// C02: CHA₂DS₂-VASc. Spec: specs/calculators/C02-cha2ds2-vasc.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoSiNo, Resultado } from '../tipos';

const NOTA =
  'Estimación del riesgo de ictus en fibrilación auricular no valvular. La decisión de anticoagular depende de las guías vigentes y del criterio clínico.';
const SOLO_SEXO =
  'El único punto proviene del sexo femenino, que por sí solo no se considera un factor de riesgo independiente (riesgo bajo).';

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
  {
    tipo: 'opcion',
    id: 'sexo',
    etiqueta: 'Sexo',
    opciones: [
      { valor: 'mujer', etiqueta: 'Mujer', puntos: 1 },
      { valor: 'hombre', etiqueta: 'Hombre', puntos: 0 },
    ],
  },
  siNo('icc', 'Insuficiencia cardiaca (con evidencia objetiva de disfunción cardiaca)', 1),
  siNo('hta', 'Hipertensión', 1),
  siNo('dm', 'Diabetes mellitus', 1),
  siNo('ictus', 'Ictus, AIT o tromboembolia previa', 2),
  siNo('vascular', 'Enfermedad vascular (infarto previo, enfermedad arterial periférica o placa aórtica)', 1),
];

export function calcularChaDsVasc(valores: Parameters<Calculadora['calcular']>[0]): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  // Solo se avisa cuando el único punto es el de mujer (menor de 65 y todo lo demás en "No").
  const soloSexo = puntaje === 1 && valores.sexo === 'mujer' && valores.edad === 'menor65';
  return {
    valor: puntaje,
    unidad: 'de 9',
    interpretacion: soloSexo ? `${NOTA}\n\n${SOLO_SEXO}` : NOTA,
  };
}

export const chaDsVasc: Calculadora = {
  id: 'cha2ds2-vasc',
  nombre: 'CHA₂DS₂-VASc',
  descripcion: 'Riesgo de ictus en fibrilación auricular.',
  especialidades: ['Cardiovascular'],
  palabrasClave: ['CHA2DS2-VASc', 'CHADS-VASc', 'fibrilación auricular', 'ictus', 'anticoagulación', 'riesgo de ictus'],
  version: 1,
  fuente:
    'Lip GYH, Nieuwlaat R, Pisters R, Lane DA, Crijns HJ. Chest 2010;137(2):263-72.',
  campos,
  reglas: [],
  calcular: calcularChaDsVasc,
};
