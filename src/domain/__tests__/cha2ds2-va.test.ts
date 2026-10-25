import { chaDsVa } from '../calculadoras/cha2ds2-va';
import { evaluar } from '../motor';

type Sn = { icc?: boolean; hta?: boolean; dm?: boolean; ictus?: boolean; vascular?: boolean };
const calcular = (edad?: string, sn: Sn = {}) => evaluar(chaDsVa, { valores: { edad, ...sn } });

describe('C06 CHA₂DS₂-VA: casos de la spec', () => {
  const casos: [string, Sn, number][] = [
    ['menor65', {}, 0],
    ['65a74', {}, 1],
    ['75mas', {}, 2],
    ['65a74', { hta: true }, 2],
    ['menor65', { ictus: true }, 2],
    ['65a74', { icc: true, hta: true, vascular: true }, 4],
    ['75mas', { dm: true, vascular: true }, 4],
    ['75mas', { icc: true, hta: true, dm: true, ictus: true, vascular: true }, 8],
  ];

  it.each(casos)('%s / %j da %i', (edad, sn, esperado) => {
    expect(calcular(edad, sn).resultado?.valor).toBe(esperado);
  });

  it('el máximo es 8 (la edad aporta una sola categoría)', () => {
    const todo = { icc: true, hta: true, dm: true, ictus: true, vascular: true };
    expect(calcular('75mas', todo).resultado?.valor).toBe(8);
    expect(calcular('75mas', todo).resultado?.unidad).toBe('de 8');
  });

  it('no tiene campo de sexo', () => {
    expect(chaDsVa.campos.some((c) => c.id === 'sexo')).toBe(false);
  });
});

describe('C06 CHA₂DS₂-VA: campos pendientes', () => {
  it('al abrir solo falta la edad (los sí/no inician en No)', () => {
    const e = calcular();
    expect(e.faltantes).toEqual(['Edad']);
    expect(e.resultado).toBeUndefined();
  });

  it('con la edad elegida ya hay resultado', () => {
    expect(calcular('menor65').resultado).toBeDefined();
  });
});
