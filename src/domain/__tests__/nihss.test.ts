import { gravedadNihss, nihss } from '../calculadoras/nihss';
import { evaluar } from '../motor';

const IDS = ['p1a', 'p1b', 'p1c', 'p2', 'p3', 'p4', 'p5a', 'p5b', 'p6a', 'p6b', 'p7', 'p8', 'p9', 'p10', 'p11'];
const MAX: Record<string, number> = { p1a: 3, p1b: 2, p1c: 2, p2: 2, p3: 3, p4: 3, p5a: 4, p5b: 4, p6a: 4, p6b: 4, p7: 2, p8: 2, p9: 3, p10: 2, p11: 2 };
const todo = (f: (id: string) => number) => Object.fromEntries(IDS.map((id) => [id, String(f(id))]));

describe('C16 NIHSS', () => {
  it('tiene 15 campos y sin respuestas no hay resultado', () => {
    expect(nihss.campos).toHaveLength(15);
    const e = evaluar(nihss, { valores: {} });
    expect(e.resultado).toBeUndefined();
    expect(e.faltantes).toHaveLength(15);
  });

  it('cada campo tiene tantas opciones como su máximo más uno', () => {
    for (const c of nihss.campos) {
      if (c.tipo === 'opcion') expect(c.opciones).toHaveLength(MAX[c.id] + 1);
    }
  });

  it('todo en 0 da 0 (resultado válido)', () => {
    const r = evaluar(nihss, { valores: todo(() => 0) }).resultado;
    expect(r?.valor).toBe(0);
    expect(r?.interpretacion).toMatch(/^Sin síntomas/);
  });

  it('el máximo es 42', () => {
    expect(evaluar(nihss, { valores: todo((id) => MAX[id]) }).resultado?.valor).toBe(42);
  });

  it('suma un caso mixto', () => {
    const v = { ...todo(() => 0), p1a: '1', p4: '2', p5b: '3', p9: '1', p10: '1' };
    expect(evaluar(nihss, { valores: v }).resultado?.valor).toBe(8);
  });

  it.each([
    [0, 'Sin síntomas de ictus'],
    [1, 'Ictus leve'],
    [4, 'Ictus leve'],
    [5, 'Ictus moderado'],
    [15, 'Ictus moderado'],
    [16, 'Ictus moderado a grave'],
    [20, 'Ictus moderado a grave'],
    [21, 'Ictus grave'],
    [42, 'Ictus grave'],
  ])('gravedad con %s', (t, g) => {
    expect(gravedadNihss(t)).toBe(g);
  });
});
