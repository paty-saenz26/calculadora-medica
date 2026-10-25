// C19: EGSYS. Spec: specs/calculators/C19-egsys.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoSiNo, Resultado, ValoresCalculo } from '../tipos';

const siNo = (id: string, etiqueta: string, puntos: number): CampoSiNo => ({
  tipo: 'sino',
  id,
  etiqueta,
  puntos,
  valorInicial: false,
});

const campos: Calculadora['campos'] = [
  siNo('palpitaciones', 'Palpitaciones antes del síncope', 4),
  siNo('ecg', 'ECG anormal y/o cardiopatía estructural', 3),
  siNo('esfuerzo', 'Síncope durante el esfuerzo', 3),
  siNo('supino', 'Síncope en posición supina (acostado)', 2),
  siNo('prodromos', 'Pródromos neurovegetativos (por ejemplo náusea o vómito)', -1),
  siNo('factores', 'Factores predisponentes o desencadenantes (calor, lugar concurrido, bipedestación prolongada, miedo, dolor o emoción)', -1),
];

export function calcularEgsys(valores: ValoresCalculo): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  const nivel = puntaje >= 3 ? 'alto' : 'bajo';
  return {
    valor: puntaje,
    unidad: 'puntos',
    interpretacion: `Riesgo ${nivel} de síncope de causa cardiaca (corte: 3 o más). Rango posible de −2 a 12. Es un apoyo para el triaje en urgencias y no sustituye la valoración clínica.`,
  };
}

export const egsys: Calculadora = {
  id: 'egsys',
  nombre: 'EGSYS',
  descripcion: 'Probabilidad de que un síncope sea de causa cardiaca.',
  especialidades: ['Cardiovascular', 'Urgencias'],
  palabrasClave: ['EGSYS', 'síncope', 'desmayo', 'pérdida de conciencia', 'cardiaco'],
  version: 1,
  fuente:
    'Del Rosso A, et al. Clinical predictors of cardiac syncope at initial evaluation in patients referred urgently to a general hospital: the EGSYS score. Heart 2008;94:1620-6.',
  campos,
  reglas: [],
  calcular: calcularEgsys,
};
