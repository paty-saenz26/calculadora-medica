// C09: STOP-Bang. Spec: specs/calculators/C09-stop-bang.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoSiNo, Resultado, ValoresCalculo } from '../tipos';

const NOTA =
  'Herramienta de tamizaje, no diagnóstica. La confirmación de apnea obstructiva del sueño requiere un estudio del sueño.';

const siNo = (id: string, etiqueta: string): CampoSiNo => ({
  tipo: 'sino',
  id,
  etiqueta,
  puntos: 1,
  valorInicial: false,
});

const campos: Calculadora['campos'] = [
  siNo('ronquido', 'Ronca fuerte (se oye a través de una puerta cerrada o la pareja lo codea)'),
  siNo('cansancio', 'Se siente cansado, fatigado o con sueño durante el día'),
  siNo('apneas', 'Alguien ha observado que deja de respirar o se ahoga mientras duerme'),
  siNo('presion', 'Tiene hipertensión o está en tratamiento para ella'),
  siNo('imc', 'IMC mayor de 35 kg/m²'),
  siNo('edad', 'Edad mayor de 50 años'),
  siNo('cuello', 'Cuello grande (a la altura de la nuez): 43 cm o más en hombres, 41 cm o más en mujeres'),
  siNo('hombre', 'Sexo masculino'),
];

const PREGUNTAS_STOP = ['ronquido', 'cansancio', 'apneas', 'presion'];

export function nivelRiesgoStopBang(puntaje: number, valores: ValoresCalculo): 'bajo' | 'intermedio' | 'alto' {
  if (puntaje >= 5) return 'alto';
  // Regla adicional: 2 o más respuestas "Sí" en STOP y además sexo masculino, IMC > 35 o cuello grande.
  const stop = PREGUNTAS_STOP.filter((id) => valores[id] === true).length;
  const extra = valores.hombre === true || valores.imc === true || valores.cuello === true;
  if (stop >= 2 && extra) return 'alto';
  return puntaje >= 3 ? 'intermedio' : 'bajo';
}

export function calcularStopBang(valores: ValoresCalculo): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  const nivel = nivelRiesgoStopBang(puntaje, valores);
  return {
    valor: puntaje,
    unidad: 'de 8',
    interpretacion: `Riesgo ${nivel} de apnea obstructiva del sueño. ${NOTA}`,
  };
}

export const stopBang: Calculadora = {
  id: 'stop-bang',
  nombre: 'STOP-Bang',
  descripcion: 'Tamizaje de apnea obstructiva del sueño.',
  especialidades: ['Neumología'],
  palabrasClave: ['STOP-Bang', 'STOPBANG', 'apnea del sueño', 'AOS', 'OSA', 'ronquido', 'sueño'],
  version: 1,
  fuente:
    'Chung F, et al. STOP questionnaire: a tool to screen patients for obstructive sleep apnea. Anesthesiology 2008;108:812-21. Chung F, et al. Br J Anaesth 2012;108:768-75. J Clin Sleep Med 2014;10:951-8.',
  campos,
  reglas: [],
  calcular: calcularStopBang,
};
