// C05: FIB-4. Spec: specs/calculators/C05-fib4.md
import type { Calculadora, Resultado } from '../tipos';

const NOTA =
  'Índice no invasivo de apoyo. Un resultado indeterminado o alto requiere valoración clínica y estudios complementarios.';

/** Categoría según el valor ya redondeado a 2 decimales, el que ve el usuario. */
export function categoriaFib4(fib4Mostrado: number): string {
  if (fib4Mostrado < 1.45) {
    return 'Baja probabilidad de fibrosis avanzada (valor predictivo negativo de 90% en el estudio original)';
  }
  if (fib4Mostrado <= 3.25) {
    return 'Indeterminado';
  }
  return 'Alta probabilidad de fibrosis avanzada (especificidad de 97% y valor predictivo positivo de 65% en el estudio original)';
}

/** FIB-4 = (edad × AST) / (plaquetas × raíz de ALT). AST y ALT en U/L, plaquetas en ×10⁹/L. */
export function calcularFib4(edad: number, ast: number, alt: number, plaquetas: number): Resultado {
  const valor = Number(((edad * ast) / (plaquetas * Math.sqrt(alt))).toFixed(2));
  return { valor, interpretacion: `${categoriaFib4(valor)}. ${NOTA}` };
}

export const fib4: Calculadora = {
  id: 'fib4',
  nombre: 'FIB-4',
  descripcion: 'Estima el riesgo de fibrosis hepática avanzada.',
  especialidades: ['Gastroenterología'],
  palabrasClave: ['FIB4', 'fibrosis', 'hígado', 'hepático', 'hepatopatía', 'Sterling'],
  version: 1,
  fuente:
    'Sterling RK, Lissen E, Clumeck N, et al. Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection. Hepatology 2006;43:1317-1325.',
  campos: [
    {
      tipo: 'numero',
      id: 'edad',
      etiqueta: 'Edad',
      unidades: [{ id: 'anios', etiqueta: 'años', factor: 1, decimales: 0 }],
      rangoValido: { min: 18, max: 120 },
      entero: true,
    },
    {
      tipo: 'numero',
      id: 'ast',
      etiqueta: 'AST (TGO)',
      unidades: [{ id: 'ul', etiqueta: 'U/L', factor: 1, decimales: 1 }],
      rangoValido: { min: 1, max: 5000 },
    },
    {
      tipo: 'numero',
      id: 'alt',
      etiqueta: 'ALT (TGP)',
      unidades: [{ id: 'ul', etiqueta: 'U/L', factor: 1, decimales: 1 }],
      rangoValido: { min: 1, max: 5000 },
    },
    {
      tipo: 'numero',
      id: 'plaquetas',
      etiqueta: 'Plaquetas',
      unidades: [{ id: 'x109l', etiqueta: '×10⁹/L', factor: 1, decimales: 1 }],
      rangoValido: { min: 10, max: 1000 },
    },
  ],
  reglas: [],
  calcular: (v) =>
    calcularFib4(v.edad as number, v.ast as number, v.alt as number, v.plaquetas as number),
};
