import { ecog } from '../calculadoras/ecog';
import { westHaven } from '../calculadoras/west-haven';
import { evaluar } from '../motor';

describe('C14 ECOG', () => {
  it('sin elegir grado falta el estado funcional', () => {
    const e = evaluar(ecog, { valores: {} });
    expect(e.resultado).toBeUndefined();
    expect(e.faltantes).toEqual(['Estado funcional']);
  });

  it.each(['0', '1', '2', '3', '4', '5'])('el grado %s se devuelve tal cual', (g) => {
    const r = evaluar(ecog, { valores: { estado: g } }).resultado;
    expect(r?.valor).toBe(Number(g));
    expect(r?.interpretacion.length).toBeGreaterThan(5);
  });

  it('el grado 0 sí muestra resultado', () => {
    expect(evaluar(ecog, { valores: { estado: '0' } }).resultado?.valor).toBe(0);
  });
});

describe('C15 West Haven', () => {
  it('sin elegir grado falta el estado mental', () => {
    expect(evaluar(westHaven, { valores: {} }).faltantes).toEqual(['Estado mental']);
  });

  it.each(['0', '1', '2', '3', '4'])('el grado %s se devuelve tal cual', (g) => {
    const r = evaluar(westHaven, { valores: { grado: g } }).resultado;
    expect(r?.valor).toBe(Number(g));
  });

  it('el grado 4 es coma', () => {
    expect(evaluar(westHaven, { valores: { grado: '4' } }).resultado?.interpretacion).toMatch(/^Coma/);
  });
});
