import { categoriaWellsTep, wellsTep } from '../calculadoras/wells-tep';
import { evaluar } from '../motor';

type Resp = Partial<Record<'tvp' | 'diagnostico' | 'fc' | 'inmovilizacion' | 'previo' | 'hemoptisis' | 'cancer', boolean>>;
const calcular = (resp: Resp = {}) => evaluar(wellsTep, { valores: resp }).resultado;

describe('C10 Wells TEP', () => {
  it('sin factores da 0 y ya hay resultado', () => {
    expect(calcular()?.valor).toBe(0);
  });

  it.each([
    [{ tvp: true }, 3],
    [{ diagnostico: true }, 3],
    [{ fc: true }, 1.5],
    [{ inmovilizacion: true }, 1.5],
    [{ previo: true }, 1.5],
    [{ hemoptisis: true }, 1],
    [{ cancer: true }, 1],
    [{ fc: true, previo: true, inmovilizacion: true }, 4.5],
    [{ tvp: true, diagnostico: true, fc: true, inmovilizacion: true, previo: true, hemoptisis: true, cancer: true }, 12.5],
  ] as [Resp, number][])('puntos de %j = %s', (resp, esperado) => {
    expect(calcular(resp)?.valor).toBe(esperado);
  });

  it.each([
    [0, 'baja', 'improbable'],
    [1.5, 'baja', 'improbable'],
    [2, 'moderada', 'improbable'],
    [4, 'moderada', 'improbable'],
    [4.5, 'moderada', 'probable'],
    [6, 'moderada', 'probable'],
    [6.5, 'alta', 'probable'],
  ] as const)('categorías con %s puntos', (puntaje, tres, dos) => {
    expect(categoriaWellsTep(puntaje)).toEqual({ tres, dos });
  });

  it('la interpretación incluye ambos modelos', () => {
    expect(calcular({ tvp: true, fc: true })?.interpretacion).toMatch(/Probabilidad moderada.*TEP probable/);
  });
});
