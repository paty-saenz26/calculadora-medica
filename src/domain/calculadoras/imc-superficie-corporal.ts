// C04: IMC y superficie corporal. Spec: specs/calculators/C04-imc-superficie-corporal.md
import { formatearNumero } from '../unidades';
import type { Calculadora, Resultado } from '../tipos';

const NOTA =
  'Categorías para adultos. En menores de 18 años el IMC se interpreta con percentiles. El IMC no distingue masa muscular de grasa.';

/** Categoría de IMC en adultos. Recibe el IMC ya redondeado a 1 decimal, el que ve el usuario. */
export function categoriaImc(imcMostrado: number): string {
  if (imcMostrado < 18.5) return 'Bajo peso';
  if (imcMostrado < 25) return 'Peso normal';
  if (imcMostrado < 30) return 'Sobrepeso';
  if (imcMostrado < 35) return 'Obesidad grado I';
  if (imcMostrado < 40) return 'Obesidad grado II';
  return 'Obesidad grado III';
}

/** Con peso en kg y talla en cm. IMC en kg/m², 1 decimal. */
export function calcularImc(pesoKg: number, tallaCm: number): number {
  return Number((pesoKg / (tallaCm / 100) ** 2).toFixed(1));
}

/** Superficie corporal de Mosteller, en m², 2 decimales. */
export function calcularSuperficieCorporal(pesoKg: number, tallaCm: number): number {
  return Number(Math.sqrt((tallaCm * pesoKg) / 3600).toFixed(2));
}

export function calcularImcYSuperficie(pesoKg: number, tallaCm: number): Resultado {
  const imc = calcularImc(pesoKg, tallaCm);
  const sc = calcularSuperficieCorporal(pesoKg, tallaCm);
  return {
    valor: imc,
    unidad: 'kg/m²',
    interpretacion: `${categoriaImc(imc)}. ${NOTA}`,
    detalles: [{ etiqueta: 'Superficie corporal', valor: formatearNumero(sc, 2), unidad: 'm²' }],
  };
}

export const imcSuperficieCorporal: Calculadora = {
  id: 'imc-sc',
  nombre: 'IMC y superficie corporal',
  descripcion: 'Índice de masa corporal, su categoría y la superficie corporal.',
  especialidades: ['Medicina general', 'Nutrición'],
  palabrasClave: ['IMC', 'BMI', 'BSA', 'Mosteller', 'obesidad', 'sobrepeso', 'peso', 'talla'],
  version: 1,
  fuente:
    'IMC: OMS, Technical Report Series 894 (2000). Superficie corporal: Mosteller RD. N Engl J Med 1987;317(17):1098.',
  campos: [
    {
      tipo: 'numero',
      id: 'peso',
      etiqueta: 'Peso',
      unidades: [
        { id: 'kg', etiqueta: 'kg', factor: 1, decimales: 1 },
        { id: 'lb', etiqueta: 'lb', factor: 0.45359237, decimales: 1 },
      ],
      rangoValido: { min: 20, max: 300 },
    },
    {
      tipo: 'numero',
      id: 'talla',
      etiqueta: 'Talla',
      unidades: [
        { id: 'cm', etiqueta: 'cm', factor: 1, decimales: 1 },
        { id: 'in', etiqueta: 'in', factor: 2.54, decimales: 1 },
      ],
      rangoValido: { min: 100, max: 250 },
    },
  ],
  reglas: [],
  calcular: (v) => calcularImcYSuperficie(v.peso as number, v.talla as number),
};
