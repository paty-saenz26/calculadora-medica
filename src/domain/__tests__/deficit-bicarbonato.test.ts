import { calcularDeficitBicarbonato, deficitBicarbonato } from '../calculadoras/deficit-bicarbonato';
import { evaluar } from '../motor';

const calcular = (peso: string, medido: string, deseado?: string, unidades?: Record<string, string>) =>
  evaluar(deficitBicarbonato, { valores: { peso, medido, deseado }, unidades });

describe('C07 Déficit de bicarbonato: casos de la spec', () => {
  const casos: [string, string, string | undefined, number][] = [
    ['70', '10', undefined, 490],
    ['80', '15', undefined, 360],
    ['60', '18', '24', 180],
    ['70', '12', '20', 280],
  ];

  it.each(casos)('peso %s kg, HCO₃ %s, deseado %s da %i mEq', (peso, medido, deseado, esperado) => {
    const r = calcular(peso, medido, deseado).resultado;
    expect(r?.valor).toBe(esperado);
    expect(r?.unidad).toBe('mEq');
  });

  it('el bicarbonato deseado vacío usa 24', () => {
    expect(calcular('70', '10', '').resultado?.valor).toBe(490);
  });

  it('peso en libras da el mismo resultado que en kilos', () => {
    expect(calcular('154.3', '10', undefined, { peso: 'lb' }).resultado?.valor).toBe(490);
  });

  it('con el bicarbonato en el valor deseado o por encima no hay déficit', () => {
    expect(calcularDeficitBicarbonato(70, 24).valor).toBe(0);
    const alto = calcular('70', '28').resultado;
    expect(alto?.valor).toBe(0);
    expect(alto?.interpretacion).toMatch(/^No hay déficit/);
  });
});

describe('C07 Déficit de bicarbonato: validación', () => {
  it('bicarbonato vacío dice "Falta: Bicarbonato sérico"', () => {
    const e = calcular('70', '');
    expect(e.faltantes).toEqual(['Bicarbonato sérico']);
    expect(e.resultado).toBeUndefined();
  });

  it('bicarbonato 60 es error de rango', () => {
    const e = calcular('70', '60');
    expect(e.errores.medido).toBe('Debe estar entre 1 y 40 mEq/L');
    expect(e.resultado).toBeUndefined();
  });

  it('un bicarbonato deseado fuera de rango bloquea el resultado', () => {
    const e = calcular('70', '10', '5');
    expect(e.errores.deseado).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });

  it('peso 500 kg es error de rango', () => {
    const e = calcular('500', '10');
    expect(e.errores.peso).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });
});
