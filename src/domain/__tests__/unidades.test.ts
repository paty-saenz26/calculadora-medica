import { cambiarUnidad, limpiarTecleo } from '../unidades';
import type { CampoNumero } from '../tipos';

const creatinina: CampoNumero = {
  tipo: 'numero',
  id: 'cr',
  etiqueta: 'Creatinina',
  unidades: [
    { id: 'mgdl', etiqueta: 'mg/dL', factor: 1, decimales: 2 },
    { id: 'umoll', etiqueta: 'µmol/L', factor: 1 / 88.4, decimales: 0 },
  ],
  rangoValido: { min: 0.2, max: 20 },
};

describe('cambiarUnidad (D13)', () => {
  it('convierte 1.0 mg/dL a 88 µmol/L', () => {
    const r = cambiarUnidad(creatinina, { texto: '1.0', unidadId: 'mgdl' }, 'umoll');
    expect(r.texto).toBe('88');
    expect(r.unidadId).toBe('umoll');
  });

  it('ida y vuelta sin editar restaura el texto exacto escrito', () => {
    const ida = cambiarUnidad(creatinina, { texto: '1.0', unidadId: 'mgdl' }, 'umoll');
    const vuelta = cambiarUnidad(creatinina, ida, 'mgdl');
    expect(vuelta.texto).toBe('1.0');
    expect(vuelta.origen).toBeUndefined();
  });

  it('convierte siempre desde lo original, sin acumular redondeos', () => {
    const a = cambiarUnidad(creatinina, { texto: '1.37', unidadId: 'mgdl' }, 'umoll');
    const b = cambiarUnidad(creatinina, a, 'mgdl');
    const c = cambiarUnidad(creatinina, b, 'umoll');
    expect(c.texto).toBe(a.texto);
    expect(b.texto).toBe('1.37');
  });

  it('con el campo vacío solo cambia la unidad', () => {
    const r = cambiarUnidad(creatinina, { texto: '', unidadId: 'mgdl' }, 'umoll');
    expect(r).toEqual({ texto: '', unidadId: 'umoll' });
  });
});

describe('limpiarTecleo', () => {
  it('quita letras y comas', () => {
    expect(limpiarTecleo('1a,5')).toBe('15');
  });

  it('acepta un solo punto decimal', () => {
    expect(limpiarTecleo('1.2.3')).toBe('1.23');
  });

  it('en campos enteros no acepta punto', () => {
    expect(limpiarTecleo('12.5', true)).toBe('125');
  });
});
