import { glasgow, gravedadGlasgow } from '../calculadoras/glasgow';
import { evaluar } from '../motor';

const calcular = (ocular?: string, verbal?: string, motora?: string) => evaluar(glasgow, { valores: { ocular, verbal, motora } });

describe('C12 Glasgow', () => {
  it('sin respuestas faltan los tres componentes', () => {
    const e = calcular();
    expect(e.resultado).toBeUndefined();
    expect(e.faltantes).toEqual(['Apertura ocular', 'Respuesta verbal', 'Respuesta motora']);
  });

  it('mínimo 3 y máximo 15', () => {
    expect(calcular('ninguna', 'ninguna', 'ninguna').resultado?.valor).toBe(3);
    expect(calcular('espontanea', 'orientado', 'obedece').resultado?.valor).toBe(15);
  });

  it('suma los componentes y los muestra', () => {
    const r = calcular('voz', 'confuso', 'localiza').resultado;
    expect(r?.valor).toBe(12);
    expect(r?.interpretacion).toMatch(/O3 V4 M5/);
    expect(r?.interpretacion).toMatch(/moderada/);
  });

  it.each([
    [3, 'grave'],
    [8, 'grave'],
    [9, 'moderado'],
    [12, 'moderado'],
    [13, 'leve'],
    [15, 'leve'],
  ] as const)('gravedad con %s', (t, g) => {
    expect(gravedadGlasgow(t)).toBe(g);
  });
});
