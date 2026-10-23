// C01: Presión arterial media. Spec: specs/calculators/C01-pam.md
import type { Calculadora, Resultado } from '../tipos';

const MM_HG = { id: 'mmhg', etiqueta: 'mm Hg', factor: 1 };

/** PAM = (PAS + 2 × PAD) / 3, redondeada al entero más cercano. */
export function calcularPam(pas: number, pad: number): Resultado {
  const valor = Math.round((pas + 2 * pad) / 3);
  return {
    valor,
    unidad: 'mm Hg',
    // La interpretación usa el valor redondeado, el mismo que se muestra.
    interpretacion:
      valor < 60
        ? 'Por debajo de 60 mm Hg. Si se mantiene, no se perfunden bien los órganos vitales (riesgo de isquemia).'
        : 'En o por encima de 60 mm Hg, mínimo necesario para perfundir órganos vitales.',
  };
}

export const pam: Calculadora = {
  id: 'pam',
  nombre: 'Presión arterial media',
  descripcion: 'Estima la PAM a partir de la presión sistólica y la diastólica.',
  especialidades: ['Cardiovascular'],
  palabrasClave: ['PAM', 'MAP', 'presión arterial', 'sistólica', 'diastólica'],
  version: 1,
  fuente:
    'Wachs D (ed.). Physiology, Mean Arterial Pressure. StatPearls. Actualizado el 10/04/2023.',
  notaFuente:
    'La PAM calculada a partir de PAS y PAD es una estimación; no sustituye la medición directa cuando esta se requiere.',
  campos: [
    {
      tipo: 'numero',
      id: 'pas',
      etiqueta: 'Presión sistólica (PAS)',
      unidades: [{ ...MM_HG, decimales: 0 }],
      rangoValido: { min: 40, max: 300 },
      pista: 'Normal: menos de 120',
      entero: true,
    },
    {
      tipo: 'numero',
      id: 'pad',
      etiqueta: 'Presión diastólica (PAD)',
      unidades: [{ ...MM_HG, decimales: 0 }],
      rangoValido: { min: 20, max: 200 },
      pista: 'Normal: menos de 80',
      entero: true,
    },
  ],
  reglas: [
    {
      id: 'R1',
      mensaje: 'La diastólica debe ser menor que la sistólica',
      campos: ['pas', 'pad'],
      cumple: (v) => (v.pad as number) < (v.pas as number),
    },
  ],
  calcular: (v) => calcularPam(v.pas as number, v.pad as number),
};
