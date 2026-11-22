import { calcularChaDsVa, recomendacionChaDsVa } from '../calculadoras/cha2ds2-va';

describe('CHA2DS2-VA: recomendación según el puntaje', () => {
  it('0 puntos: no se recomienda anticoagulación', () => {
    expect(recomendacionChaDsVa(0)).toMatch(/no se recomienda/);
  });
  it('1 punto: se debe considerar', () => {
    expect(recomendacionChaDsVa(1)).toMatch(/considerar/);
  });
  it('2 o más puntos: se recomienda', () => {
    expect(recomendacionChaDsVa(2)).toMatch(/^Riesgo alto: se recomienda/);
    expect(recomendacionChaDsVa(8)).toMatch(/^Riesgo alto: se recomienda/);
  });
  it('el resultado cambia según los valores ingresados', () => {
    const bajo = calcularChaDsVa({ edad: 'menor65' });
    const alto = calcularChaDsVa({ edad: '75mas', hta: true, ictus: true });
    expect(bajo.interpretacion).not.toBe(alto.interpretacion);
  });
});