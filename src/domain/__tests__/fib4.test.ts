import { categoriaFib4, fib4 } from '../calculadoras/fib4';
import { evaluar } from '../motor';

const calcular = (edad: string, ast: string, alt: string, plaquetas: string) =>
  evaluar(fib4, { valores: { edad, ast, alt, plaquetas } });

describe('C05 FIB-4: casos de la spec', () => {
  const casos: [string, string, string, string, number, RegExp][] = [
    ['50', '40', '36', '200', 1.67, /^Indeterminado/],
    ['40', '20', '25', '250', 0.64, /^Baja probabilidad/],
    ['65', '80', '36', '100', 8.67, /^Alta probabilidad/],
    ['58', '50', '100', '200', 1.45, /^Indeterminado/],
    ['65', '100', '100', '200', 3.25, /^Indeterminado/],
  ];

  it.each(casos)('edad %s, AST %s, ALT %s, plaquetas %s da %d', (edad, ast, alt, plaquetas, esperado, categoria) => {
    const r = calcular(edad, ast, alt, plaquetas).resultado;
    expect(r?.valor).toBe(esperado);
    expect(r?.interpretacion).toMatch(categoria);
  });

  it('los límites 1.45 y 3.25 son indeterminados (inclusivos)', () => {
    expect(categoriaFib4(1.45)).toBe('Indeterminado');
    expect(categoriaFib4(3.25)).toBe('Indeterminado');
    expect(categoriaFib4(1.44)).toMatch(/^Baja/);
    expect(categoriaFib4(3.26)).toMatch(/^Alta/);
  });
});

describe('C05 FIB-4: validación', () => {
  it('ALT 0 es error de rango', () => {
    const e = calcular('50', '40', '0', '200');
    expect(e.errores.alt).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });

  it('plaquetas vacías dice "Falta: Plaquetas"', () => {
    const e = calcular('50', '40', '36', '');
    expect(e.faltantes).toEqual(['Plaquetas']);
    expect(e.resultado).toBeUndefined();
  });

  it('edad 17 es error de rango', () => {
    const e = calcular('17', '40', '36', '200');
    expect(e.errores.edad).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });
});
