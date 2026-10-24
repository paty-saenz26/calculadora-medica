import { categoriaImc, imcSuperficieCorporal as c04 } from '../calculadoras/imc-superficie-corporal';
import { evaluar } from '../motor';
import { cambiarUnidad } from '../unidades';
import type { CampoNumero } from '../tipos';

const calcular = (peso: string, talla: string, unidades?: Record<string, string>) =>
  evaluar(c04, { valores: { peso, talla }, unidades });

const campo = (id: string) => c04.campos.find((c) => c.id === id) as CampoNumero;

describe('C04 IMC y superficie corporal: casos de la spec', () => {
  const casos: [string, string, number, string, string][] = [
    ['70', '175', 22.9, 'Peso normal', '1.84'],
    ['60', '160', 23.4, 'Peso normal', '1.63'],
    ['100', '170', 34.6, 'Obesidad grado I', '2.17'],
    ['50', '165', 18.4, 'Bajo peso', '1.51'],
    ['85', '180', 26.2, 'Sobrepeso', '2.06'],
    ['53.4', '170', 18.5, 'Peso normal', '1.59'],
  ];

  it.each(casos)('%s kg y %s cm dan IMC %d (%s) y SC %s', (peso, talla, imc, categoria, sc) => {
    const r = calcular(peso, talla).resultado;
    expect(r?.valor).toBe(imc);
    expect(r?.unidad).toBe('kg/m²');
    expect(r?.interpretacion).toContain(categoria);
    expect(r?.detalles?.[0]).toEqual({ etiqueta: 'Superficie corporal', valor: sc, unidad: 'm²' });
  });

  it('la categoría usa el IMC redondeado (53.4 kg y 170 cm: 18.5, peso normal)', () => {
    expect(calcular('53.4', '170').resultado?.interpretacion).toMatch(/^Peso normal/);
  });
});

describe('C04: categorías en los límites', () => {
  it.each([
    [18.4, 'Bajo peso'],
    [18.5, 'Peso normal'],
    [24.9, 'Peso normal'],
    [25, 'Sobrepeso'],
    [29.9, 'Sobrepeso'],
    [30, 'Obesidad grado I'],
    [34.9, 'Obesidad grado I'],
    [35, 'Obesidad grado II'],
    [39.9, 'Obesidad grado II'],
    [40, 'Obesidad grado III'],
  ])('IMC %d es %s', (imc, categoria) => {
    expect(categoriaImc(imc)).toBe(categoria);
  });
});

describe('C04: unidades alternas (D13)', () => {
  it('peso en lb y talla en in dan el mismo resultado que en kg y cm', () => {
    const r = calcular('154.3', '68.9', { peso: 'lb', talla: 'in' }).resultado;
    expect(r?.valor).toBe(22.9);
    expect(r?.detalles?.[0].valor).toBe('1.84');
  });

  it('70 kg se convierte a 154.3 lb y al volver restaura 70', () => {
    const ida = cambiarUnidad(campo('peso'), { texto: '70', unidadId: 'kg' }, 'lb');
    expect(ida.texto).toBe('154.3');
    expect(cambiarUnidad(campo('peso'), ida, 'kg').texto).toBe('70');
  });

  it('175 cm se convierte a 68.9 in y al volver restaura 175', () => {
    const ida = cambiarUnidad(campo('talla'), { texto: '175', unidadId: 'cm' }, 'in');
    expect(ida.texto).toBe('68.9');
    expect(cambiarUnidad(campo('talla'), ida, 'cm').texto).toBe('175');
  });
});

describe('C04: validación', () => {
  it('peso vacío dice "Falta: Peso"', () => {
    const e = calcular('', '175');
    expect(e.faltantes).toEqual(['Peso']);
    expect(e.resultado).toBeUndefined();
  });

  it('talla 50 cm es error de rango', () => {
    const e = calcular('70', '50');
    expect(e.errores.talla).toBe('Debe estar entre 100 y 250 cm');
    expect(e.resultado).toBeUndefined();
  });

  it('peso 500 kg es error de rango', () => {
    const e = calcular('500', '175');
    expect(e.errores.peso).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });
});
