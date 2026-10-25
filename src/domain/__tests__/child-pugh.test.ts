import { childPugh, claseChildPugh } from '../calculadoras/child-pugh';
import { evaluar } from '../motor';

type Resp = { bilirrubina?: string; albumina?: string; inr?: string; ascitis?: string; encefalopatia?: string };
const mejor: Resp = { bilirrubina: 'menos2', albumina: 'mas35', inr: 'menos17', ascitis: 'ninguna', encefalopatia: 'ninguna' };
const peor: Resp = { bilirrubina: 'mas3', albumina: 'menos28', inr: 'mas23', ascitis: 'moderada', encefalopatia: 'grado34' };
const calcular = (r: Resp) => evaluar(childPugh, { valores: r });

describe('C13 Child-Pugh', () => {
  it('faltan campos sin resultado', () => {
    const e = calcular({});
    expect(e.resultado).toBeUndefined();
    expect(e.faltantes).toHaveLength(5);
  });

  it('mínimo 5 es clase A', () => {
    const r = calcular(mejor).resultado;
    expect(r?.valor).toBe(5);
    expect(r?.interpretacion).toMatch(/^Clase A/);
  });

  it('máximo 15 es clase C', () => {
    const r = calcular(peor).resultado;
    expect(r?.valor).toBe(15);
    expect(r?.interpretacion).toMatch(/^Clase C/);
  });

  it('cada parámetro intermedio vale 2 puntos', () => {
    expect(calcular({ ...mejor, bilirrubina: '2a3' }).resultado?.valor).toBe(6);
    expect(calcular({ ...mejor, albumina: '28a35' }).resultado?.valor).toBe(6);
    expect(calcular({ ...mejor, inr: '17a23' }).resultado?.valor).toBe(6);
    expect(calcular({ ...mejor, ascitis: 'leve' }).resultado?.valor).toBe(6);
    expect(calcular({ ...mejor, encefalopatia: 'grado12' }).resultado?.valor).toBe(6);
  });

  it('caso mixto de 9 puntos es clase B', () => {
    const r = calcular({ bilirrubina: '2a3', albumina: '28a35', inr: '17a23', ascitis: 'leve', encefalopatia: 'ninguna' }).resultado;
    expect(r?.valor).toBe(9);
    expect(r?.interpretacion).toMatch(/^Clase B/);
  });

  it.each([
    [5, 'A'],
    [6, 'A'],
    [7, 'B'],
    [9, 'B'],
    [10, 'C'],
    [15, 'C'],
  ] as const)('clase con %s puntos', (p, c) => {
    expect(claseChildPugh(p)).toBe(c);
  });
});
