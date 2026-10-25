import { nivelRiesgoStopBang, stopBang } from '../calculadoras/stop-bang';
import { evaluar } from '../motor';

type Resp = Partial<Record<'ronquido' | 'cansancio' | 'apneas' | 'presion' | 'imc' | 'edad' | 'cuello' | 'hombre', boolean>>;
const calcular = (resp: Resp = {}) => evaluar(stopBang, { valores: resp });

describe('C09 STOP-Bang: puntaje', () => {
  it('sin ninguna respuesta afirmativa da 0 y ya hay resultado (todo inicia en No)', () => {
    const e = calcular();
    expect(e.faltantes).toEqual([]);
    expect(e.resultado?.valor).toBe(0);
    expect(e.resultado?.unidad).toBe('de 8');
  });

  it('cada respuesta afirmativa suma 1 punto', () => {
    expect(calcular({ ronquido: true }).resultado?.valor).toBe(1);
    expect(calcular({ ronquido: true, imc: true, edad: true }).resultado?.valor).toBe(3);
  });

  it('el máximo es 8', () => {
    const todo: Resp = { ronquido: true, cansancio: true, apneas: true, presion: true, imc: true, edad: true, cuello: true, hombre: true };
    expect(calcular(todo).resultado?.valor).toBe(8);
  });
});

describe('C09 STOP-Bang: nivel de riesgo', () => {
  const nivel = (resp: Resp) => calcular(resp).resultado?.interpretacion;

  it('0 a 2 puntos es riesgo bajo', () => {
    expect(nivel({})).toMatch(/^Riesgo bajo/);
    expect(nivel({ ronquido: true, edad: true })).toMatch(/^Riesgo bajo/);
  });

  it('3 a 4 puntos es riesgo intermedio', () => {
    expect(nivel({ ronquido: true, edad: true, imc: true })).toMatch(/^Riesgo intermedio/);
    expect(nivel({ ronquido: true, edad: true, imc: true, hombre: true })).toMatch(/^Riesgo intermedio/);
  });

  it('5 o más puntos es riesgo alto', () => {
    const cinco: Resp = { ronquido: true, cansancio: true, apneas: true, edad: true, imc: true };
    expect(nivel(cinco)).toMatch(/^Riesgo alto/);
  });

  it('2 o más de STOP más sexo masculino es riesgo alto aunque sean 3 puntos', () => {
    expect(nivel({ ronquido: true, cansancio: true, hombre: true })).toMatch(/^Riesgo alto/);
  });

  it('2 o más de STOP más IMC mayor de 35 es riesgo alto', () => {
    expect(nivel({ ronquido: true, presion: true, imc: true })).toMatch(/^Riesgo alto/);
  });

  it('2 o más de STOP más cuello grande es riesgo alto', () => {
    expect(nivel({ apneas: true, cansancio: true, cuello: true })).toMatch(/^Riesgo alto/);
  });

  it('solo 1 de STOP más sexo masculino y edad queda intermedio', () => {
    expect(nivel({ ronquido: true, hombre: true, edad: true })).toMatch(/^Riesgo intermedio/);
  });

  it('2 de STOP sin factor adicional y 2 puntos sigue siendo bajo', () => {
    expect(nivelRiesgoStopBang(2, { ronquido: true, cansancio: true })).toBe('bajo');
  });
});
