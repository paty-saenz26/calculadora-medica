import { calcularCkdEpi2021, categoriaTfg, ckdEpi2021 } from '../calculadoras/ckd-epi-2021';
import { evaluar } from '../motor';

const calcular = (sexo: string | undefined, edad: string, creatinina: string, unidades?: Record<string, string>) =>
  evaluar(ckdEpi2021, { valores: { sexo, edad, creatinina }, unidades });

describe('C08 CKD-EPI 2021: casos calculados con la ecuación', () => {
  const casos: [string, string, string, number, string][] = [
    ['hombre', '25', '0.8', 126, 'G1'],
    ['hombre', '60', '1.0', 86, 'G2'],
    ['mujer', '60', '0.8', 84, 'G2'],
    ['hombre', '65', '1.4', 56, 'G3a'],
    ['hombre', '70', '2.0', 35, 'G3b'],
    ['mujer', '70', '2.5', 20, 'G4'],
    ['mujer', '80', '3.5', 13, 'G5'],
    // creatinina menor que κ: usa el exponente α
    ['hombre', '30', '0.7', 127, 'G1'],
    ['mujer', '40', '0.5', 122, 'G1'],
  ];

  it.each(casos)('%s, %s años, creatinina %s mg/dL da %i (%s)', (sexo, edad, creatinina, esperado, categoria) => {
    const r = calcular(sexo, edad, creatinina).resultado;
    expect(r?.valor).toBe(esperado);
    expect(r?.unidad).toBe('mL/min/1.73 m²');
    expect(r?.interpretacion).toMatch(new RegExp(`^${categoria}:`));
  });

  it('creatinina 88.4 µmol/L equivale a 1.0 mg/dL (86 para hombre de 60)', () => {
    expect(calcular('hombre', '60', '88.4', { creatinina: 'umoll' }).resultado?.valor).toBe(86);
  });

  it('el factor femenino sube el resultado frente al masculino con κ distinto', () => {
    expect(calcularCkdEpi2021('mujer', 60, 1.0).valor).not.toBe(calcularCkdEpi2021('hombre', 60, 1.0).valor);
  });
});

describe('C08 CKD-EPI 2021: categorías G en los límites', () => {
  it.each([
    [90, 'G1'],
    [89, 'G2'],
    [60, 'G2'],
    [59, 'G3a'],
    [45, 'G3a'],
    [44, 'G3b'],
    [30, 'G3b'],
    [29, 'G4'],
    [15, 'G4'],
    [14, 'G5'],
  ])('TFG %i es %s', (tfg, categoria) => {
    expect(categoriaTfg(tfg)).toMatch(new RegExp(`^${categoria}:`));
  });
});

describe('C08 CKD-EPI 2021: validación', () => {
  it('sin sexo dice "Falta: Sexo"', () => {
    const e = calcular(undefined, '60', '1.0');
    expect(e.faltantes).toEqual(['Sexo']);
    expect(e.resultado).toBeUndefined();
  });

  it('edad 17 es error de rango', () => {
    expect(calcular('hombre', '17', '1.0').errores.edad).toBeDefined();
  });

  it('creatinina 0 es error de rango', () => {
    const e = calcular('hombre', '60', '0');
    expect(e.errores.creatinina).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });
});
