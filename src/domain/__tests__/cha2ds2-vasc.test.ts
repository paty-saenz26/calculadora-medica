import { chaDsVasc } from '../calculadoras/cha2ds2-vasc';
import { evaluar } from '../motor';

type Sn = { icc?: boolean; hta?: boolean; dm?: boolean; ictus?: boolean; vascular?: boolean };
const calcular = (edad: string, sexo: string, sn: Sn = {}) =>
  evaluar(chaDsVasc, { valores: { edad, sexo, ...sn } });

describe('C02 CHA₂DS₂-VASc: casos de la spec', () => {
  const casos: [string, string, Sn, number][] = [
    ['menor65', 'hombre', {}, 0],
    ['menor65', 'mujer', {}, 1],
    ['65a74', 'hombre', {}, 1],
    ['65a74', 'mujer', { hta: true }, 3],
    ['65a74', 'hombre', { icc: true, hta: true }, 3],
    ['75mas', 'hombre', { dm: true, vascular: true }, 4],
    ['75mas', 'mujer', { hta: true, dm: true, ictus: true }, 7],
    ['75mas', 'mujer', { icc: true, hta: true, dm: true, ictus: true, vascular: true }, 9],
  ];

  it.each(casos)('%s / %s / %j da %i', (edad, sexo, sn, esperado) => {
    expect(calcular(edad, sexo, sn).resultado?.valor).toBe(esperado);
  });

  it('el ictus previo suma 2 puntos y los demás sí/no suman 1', () => {
    expect(calcular('menor65', 'hombre', { ictus: true }).resultado?.valor).toBe(2);
    expect(calcular('menor65', 'hombre', { icc: true }).resultado?.valor).toBe(1);
  });

  it('el máximo posible es 9', () => {
    const todo = { icc: true, hta: true, dm: true, ictus: true, vascular: true };
    expect(calcular('75mas', 'mujer', todo).resultado?.valor).toBe(9);
  });
});

describe('C02 CHA₂DS₂-VASc: mensaje de "solo sexo"', () => {
  const MENSAJE = /único punto proviene del sexo femenino/;

  it('aparece cuando el único punto es ser mujer menor de 65', () => {
    expect(calcular('menor65', 'mujer').resultado?.interpretacion).toMatch(MENSAJE);
  });

  it('no aparece con hombre de 65 a 74 (también suma 1 punto)', () => {
    expect(calcular('65a74', 'hombre').resultado?.interpretacion).not.toMatch(MENSAJE);
  });

  it('no aparece si la mujer menor de 65 tiene otro factor', () => {
    expect(calcular('menor65', 'mujer', { hta: true }).resultado?.interpretacion).not.toMatch(MENSAJE);
  });

  it('no aparece con 0 puntos', () => {
    expect(calcular('menor65', 'hombre').resultado?.interpretacion).not.toMatch(MENSAJE);
  });
});

describe('C02 CHA₂DS₂-VASc: campos pendientes', () => {
  it('al abrir falta Edad y Sexo; los sí/no inician en No y no cuentan', () => {
    const e = evaluar(chaDsVasc, { valores: {} });
    expect(e.faltantes).toEqual(['Edad', 'Sexo']);
    expect(e.resultado).toBeUndefined();
  });

  it('con edad y sin sexo falta solo Sexo', () => {
    const e = evaluar(chaDsVasc, { valores: { edad: '65a74' } });
    expect(e.faltantes).toEqual(['Sexo']);
    expect(e.resultado).toBeUndefined();
  });

  it('con edad y sexo y todos los sí/no en No ya hay resultado', () => {
    expect(calcular('65a74', 'hombre').resultado).toBeDefined();
  });
});
