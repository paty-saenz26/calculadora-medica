import { acrEular2010 } from '../calculadoras/acr-eular-2010';
import { caspar } from '../calculadoras/caspar';
import { evaluar } from '../motor';

describe('C17 CASPAR', () => {
  const calc = (v: Record<string, string | boolean>) => evaluar(caspar, { valores: v }).resultado;

  it('sin elegir psoriasis falta ese campo', () => {
    const e = evaluar(caspar, { valores: {} });
    expect(e.resultado).toBeUndefined();
    expect(e.faltantes).toEqual(['Evidencia de psoriasis']);
  });

  it('psoriasis actual vale 2 y antecedente 1', () => {
    expect(calc({ psoriasis: 'actual' })?.valor).toBe(2);
    expect(calc({ psoriasis: 'antecedente' })?.valor).toBe(1);
    expect(calc({ psoriasis: 'ninguna' })?.valor).toBe(0);
  });

  it('cumple con enfermedad articular y 3 puntos', () => {
    const r = calc({ articular: true, psoriasis: 'actual', ungueal: true });
    expect(r?.valor).toBe(3);
    expect(r?.interpretacion).toMatch(/^Cumple/);
  });

  it('no cumple con 2 puntos', () => {
    expect(calc({ articular: true, psoriasis: 'actual' })?.interpretacion).toMatch(/^No cumple/);
  });

  it('sin enfermedad articular no aplica aunque haya 3 puntos', () => {
    const r = calc({ articular: false, psoriasis: 'actual', ungueal: true });
    expect(r?.valor).toBe(3);
    expect(r?.interpretacion).toMatch(/^No aplica/);
  });

  it('el máximo es 6', () => {
    const r = calc({ articular: true, psoriasis: 'actual', ungueal: true, fr: true, dactilitis: true, hueso: true });
    expect(r?.valor).toBe(6);
  });
});

describe('C18 ACR/EULAR 2010', () => {
  const base = { sinovitis: true, articulaciones: '1grande', serologia: 'negativos', reactantes: 'normales', duracion: 'menos6' };
  const calc = (v: Record<string, string | boolean>) => evaluar(acrEular2010, { valores: { ...base, ...v } }).resultado;

  it('sin elegir categorías faltan 4 campos', () => {
    const e = evaluar(acrEular2010, { valores: {} });
    expect(e.resultado).toBeUndefined();
    expect(e.faltantes).toHaveLength(4);
  });

  it('mínimo 0', () => {
    expect(calc({})?.valor).toBe(0);
  });

  it.each([
    ['articulaciones', '2a10grandes', 1],
    ['articulaciones', '1a3pequenas', 2],
    ['articulaciones', '4a10pequenas', 3],
    ['articulaciones', 'mas10', 5],
    ['serologia', 'bajo', 2],
    ['serologia', 'alto', 3],
    ['reactantes', 'anormales', 1],
    ['duracion', '6mas', 1],
  ])('%s = %s suma %s', (campo, valor, puntos) => {
    expect(calc({ [campo]: valor })?.valor).toBe(puntos);
  });

  it('el máximo es 10', () => {
    expect(calc({ articulaciones: 'mas10', serologia: 'alto', reactantes: 'anormales', duracion: '6mas' })?.valor).toBe(10);
  });

  it('6 puntos cumple y 5 no', () => {
    expect(calc({ articulaciones: 'mas10', reactantes: 'anormales' })?.interpretacion).toMatch(/^Cumple/);
    expect(calc({ articulaciones: 'mas10' })?.interpretacion).toMatch(/^No cumple/);
  });

  it('sin sinovitis no aplica', () => {
    expect(calc({ sinovitis: false, articulaciones: 'mas10', serologia: 'alto' })?.interpretacion).toMatch(/^No aplica/);
  });
});
