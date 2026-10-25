import { abcd2, categoriaAbcd2 } from '../calculadoras/abcd2';
import { evaluar } from '../motor';

type Resp = Partial<{ edad: boolean; presion: boolean; clinica: string; duracion: string; diabetes: boolean }>;
const calcular = (resp: Resp) => evaluar(abcd2, { valores: resp });

describe('C11 ABCD²', () => {
  it('sin elegir características clínicas ni duración faltan esos campos', () => {
    const e = calcular({});
    expect(e.resultado).toBeUndefined();
    expect(e.faltantes).toEqual(expect.arrayContaining(['Características clínicas', 'Duración de los síntomas']));
  });

  it('mínimo 0', () => {
    expect(calcular({ clinica: 'ninguna', duracion: 'menos10' }).resultado?.valor).toBe(0);
  });

  it.each([
    [{ edad: true, clinica: 'ninguna', duracion: 'menos10' }, 1],
    [{ presion: true, clinica: 'ninguna', duracion: 'menos10' }, 1],
    [{ clinica: 'habla', duracion: 'menos10' }, 1],
    [{ clinica: 'debilidad', duracion: 'menos10' }, 2],
    [{ clinica: 'ninguna', duracion: '10a59' }, 1],
    [{ clinica: 'ninguna', duracion: '60mas' }, 2],
    [{ diabetes: true, clinica: 'ninguna', duracion: 'menos10' }, 1],
    [{ edad: true, presion: true, clinica: 'debilidad', duracion: '60mas', diabetes: true }, 7],
  ] as [Resp, number][])('puntos de %j = %s', (resp, esperado) => {
    expect(calcular(resp).resultado?.valor).toBe(esperado);
  });

  it.each([
    [0, 'bajo', '1.0%'],
    [3, 'bajo', '1.0%'],
    [4, 'moderado', '4.1%'],
    [5, 'moderado', '4.1%'],
    [6, 'alto', '8.1%'],
    [7, 'alto', '8.1%'],
  ] as const)('categoría con %s puntos', (p, nivel, riesgo) => {
    expect(categoriaAbcd2(p)).toEqual({ nivel, riesgo });
  });
});
