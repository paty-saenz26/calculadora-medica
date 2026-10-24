import { aclaramientoCreatinina as cg } from '../calculadoras/aclaramiento-creatinina';
import { evaluar } from '../motor';
import { cambiarUnidad } from '../unidades';
import type { CampoNumero } from '../tipos';

const campo = (id: string) => cg.campos.find((c) => c.id === id) as CampoNumero;

describe('C03 Cockcroft-Gault: casos de la spec', () => {
  const casos: [string, string, string, string, number][] = [
    ['hombre', '70', '75', '1.0', 73],
    ['mujer', '55', '60', '0.9', 67],
    ['hombre', '40', '80', '1.0', 111],
    ['mujer', '80', '55', '1.2', 32],
  ];

  it.each(casos)('%s, %s años, %s kg, creatinina %s mg/dL da %i mL/min', (sexo, edad, peso, creatinina, esperado) => {
    const e = evaluar(cg, { valores: { sexo, edad, peso, creatinina } });
    expect(e.resultado?.valor).toBe(esperado);
    expect(e.resultado?.unidad).toBe('mL/min');
  });

  it('creatinina 88.4 µmol/L equivale a 1.0 mg/dL (73 mL/min)', () => {
    const e = evaluar(cg, {
      valores: { sexo: 'hombre', edad: '70', peso: '75', creatinina: '88.4' },
      unidades: { creatinina: 'umoll' },
    });
    expect(e.resultado?.valor).toBe(73);
  });

  it('peso en libras da el mismo resultado que en kilos', () => {
    const e = evaluar(cg, {
      valores: { sexo: 'hombre', edad: '70', peso: '165.3', creatinina: '1.0' },
      unidades: { peso: 'lb' },
    });
    expect(e.resultado?.valor).toBe(73);
  });
});

describe('C03 Cockcroft-Gault: conversión de unidades (D13)', () => {
  it('creatinina 1.0 mg/dL se convierte a 88 µmol/L y al volver restaura 1.0', () => {
    const ida = cambiarUnidad(campo('creatinina'), { texto: '1.0', unidadId: 'mgdl' }, 'umoll');
    expect(ida.texto).toBe('88');
    expect(cambiarUnidad(campo('creatinina'), ida, 'mgdl').texto).toBe('1.0');
  });

  it('peso 75 kg se convierte a 165.3 lb y al volver restaura 75', () => {
    const ida = cambiarUnidad(campo('peso'), { texto: '75', unidadId: 'kg' }, 'lb');
    expect(ida.texto).toBe('165.3');
    expect(cambiarUnidad(campo('peso'), ida, 'kg').texto).toBe('75');
  });
});

describe('C03 Cockcroft-Gault: validación', () => {
  const base = { sexo: 'hombre', edad: '70', peso: '75', creatinina: '1.0' };

  it('sin sexo dice "Falta: Sexo"', () => {
    const e = evaluar(cg, { valores: { ...base, sexo: undefined } });
    expect(e.faltantes).toEqual(['Sexo']);
    expect(e.resultado).toBeUndefined();
  });

  it('edad 17 es error de rango', () => {
    const e = evaluar(cg, { valores: { ...base, edad: '17' } });
    expect(e.errores.edad).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });

  it('creatinina 0 es error de rango (evita dividir entre cero)', () => {
    const e = evaluar(cg, { valores: { ...base, creatinina: '0' } });
    expect(e.errores.creatinina).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });

  it('peso 500 kg es error de rango', () => {
    const e = evaluar(cg, { valores: { ...base, peso: '500' } });
    expect(e.errores.peso).toBe('Debe estar entre 20 y 300 kg');
    expect(e.resultado).toBeUndefined();
  });

  it('el rango se muestra en la unidad elegida', () => {
    const e = evaluar(cg, { valores: { ...base, creatinina: '5' }, unidades: { creatinina: 'umoll' } });
    expect(e.errores.creatinina).toBe('Debe estar entre 18 y 1768 µmol/L');
  });
});
