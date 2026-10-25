// C10: Criterios de Wells para embolia pulmonar. Spec: specs/calculators/C10-wells-tep.md
import { sumarPuntos } from '../puntaje';
import type { Calculadora, CampoSiNo, Resultado, ValoresCalculo } from '../tipos';

const NOTA =
  'Estima la probabilidad clínica de embolia pulmonar antes de pedir estudios. No sustituye el criterio clínico.';

const siNo = (id: string, etiqueta: string, puntos: number): CampoSiNo => ({
  tipo: 'sino',
  id,
  etiqueta,
  puntos,
  valorInicial: false,
});

const campos: Calculadora['campos'] = [
  siNo('tvp', 'Signos y síntomas clínicos de trombosis venosa profunda', 3),
  siNo('diagnostico', 'La embolia pulmonar es el diagnóstico más probable o igual de probable que otro', 3),
  siNo('fc', 'Frecuencia cardiaca mayor de 100 lpm', 1.5),
  siNo('inmovilizacion', 'Inmovilización por 3 días o más, o cirugía en las últimas 4 semanas', 1.5),
  siNo('previo', 'TEP o TVP previa diagnosticada objetivamente', 1.5),
  siNo('hemoptisis', 'Hemoptisis', 1),
  siNo('cancer', 'Cáncer en tratamiento en los últimos 6 meses o en cuidados paliativos', 1),
];

export function categoriaWellsTep(puntaje: number): { tres: 'baja' | 'moderada' | 'alta'; dos: 'improbable' | 'probable' } {
  const tres = puntaje > 6 ? 'alta' : puntaje >= 2 ? 'moderada' : 'baja';
  const dos = puntaje > 4 ? 'probable' : 'improbable';
  return { tres, dos };
}

export function calcularWellsTep(valores: ValoresCalculo): Resultado {
  const puntaje = sumarPuntos(campos, valores);
  const { tres, dos } = categoriaWellsTep(puntaje);
  return {
    valor: puntaje,
    unidad: 'puntos',
    interpretacion: `Probabilidad ${tres} (modelo de 3 niveles). TEP ${dos} (modelo de 2 niveles). ${NOTA}`,
  };
}

export const wellsTep: Calculadora = {
  id: 'wells-tep',
  nombre: 'Wells para embolia pulmonar',
  descripcion: 'Probabilidad clínica de embolia pulmonar (TEP).',
  especialidades: ['Neumología', 'Urgencias'],
  palabrasClave: ['Wells', 'TEP', 'embolia pulmonar', 'tromboembolia', 'PE', 'trombosis'],
  version: 1,
  fuente:
    'Wells PS, et al. Derivation of a simple clinical model to categorize patients probability of pulmonary embolism. Thromb Haemost 2000;83:416-20. Wells PS, et al. Ann Intern Med 1998;129:997-1005.',
  campos,
  reglas: [],
  calcular: calcularWellsTep,
};
