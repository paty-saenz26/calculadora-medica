import { decaf, grupoDecaf } from '../calculadoras/decaf';
import { egsys } from '../calculadoras/egsys';
import { evaluar } from '../motor';

describe('C19 EGSYS', () => {
  const calc = (v: Record<string, boolean> = {}) => evaluar(egsys, { valores: v }).resultado;

  it('sin respuestas da 0 y riesgo bajo', () => {
    expect(calc()?.valor).toBe(0);
    expect(calc()?.interpretacion).toMatch(/^Riesgo bajo/);
  });

  it.each([
    [{ palpitaciones: true }, 4],
    [{ ecg: true }, 3],
    [{ esfuerzo: true }, 3],
    [{ supino: true }, 2],
    [{ prodromos: true }, -1],
    [{ factores: true }, -1],
  ] as [Record<string, boolean>, number][])('%j = %s', (v, p) => {
    expect(calc(v)?.valor).toBe(p);
  });

  it('el rango va de -2 a 12', () => {
    expect(calc({ prodromos: true, factores: true })?.valor).toBe(-2);
    expect(calc({ palpitaciones: true, ecg: true, esfuerzo: true, supino: true })?.valor).toBe(12);
  });

  it('el corte es 3 o más', () => {
    expect(calc({ supino: true })?.interpretacion).toMatch(/^Riesgo bajo/);
    expect(calc({ ecg: true })?.interpretacion).toMatch(/^Riesgo alto/);
    expect(calc({ ecg: true, prodromos: true })?.interpretacion).toMatch(/^Riesgo bajo/);
  });
});

describe('C20 DECAF', () => {
  const calc = (v: Record<string, string | boolean>) => evaluar(decaf, { valores: v });

  it('sin elegir disnea falta ese campo', () => {
    expect(calc({}).resultado).toBeUndefined();
    expect(calc({}).faltantes).toEqual(['Disnea (MRC extendida, eMRCD)']);
  });

  it('mínimo 0 y máximo 6', () => {
    expect(calc({ disnea: '1a4' }).resultado?.valor).toBe(0);
    expect(calc({ disnea: '5b', eosinopenia: true, consolidacion: true, acidemia: true, fa: true }).resultado?.valor).toBe(6);
  });

  it('eMRCD 5a suma 1 y 5b suma 2', () => {
    expect(calc({ disnea: '5a' }).resultado?.valor).toBe(1);
    expect(calc({ disnea: '5b' }).resultado?.valor).toBe(2);
  });

  it.each([
    [0, 'bajo', '1.4%'],
    [1, 'bajo', '1.4%'],
    [2, 'intermedio', '8.4%'],
    [3, 'alto', '34.6%'],
    [6, 'alto', '34.6%'],
  ] as const)('grupo con %s', (p, grupo, mortalidad) => {
    expect(grupoDecaf(p)).toEqual({ grupo, mortalidad });
  });
});
