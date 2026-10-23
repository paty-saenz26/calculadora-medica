import { calcularPam, pam } from '../calculadoras/pam';
import { evaluar } from '../motor';

const entradas = (pas: string, pad: string) => ({ valores: { pas, pad } });

describe('C01 PAM: casos de la spec', () => {
  const casos: [number, number, number][] = [
    [120, 80, 93],
    [110, 70, 83],
    [140, 90, 107],
    [90, 60, 70],
    [100, 50, 67],
    [80, 50, 60],
    [79, 50, 60],
    [75, 45, 55],
  ];

  it.each(casos)('PAS %i / PAD %i da PAM %i', (pas, pad, esperado) => {
    expect(calcularPam(pas, pad).valor).toBe(esperado);
  });

  it('usa el valor redondeado para la interpretación (79/50 = 60, no menor que 60)', () => {
    expect(calcularPam(79, 50).interpretacion).toMatch(/^En o por encima de 60/);
  });

  it('75/45 da 55 y avisa que está por debajo de 60', () => {
    expect(calcularPam(75, 45).interpretacion).toMatch(/^Por debajo de 60/);
  });

  it('80/50 queda en 60 con mensaje de 60 o más', () => {
    expect(calcularPam(80, 50).interpretacion).toMatch(/^En o por encima de 60/);
  });
});

describe('C01 PAM: a través del motor', () => {
  it('120/80 muestra 93 mm Hg', () => {
    const estado = evaluar(pam, entradas('120', '80'));
    expect(estado.resultado?.valor).toBe(93);
    expect(estado.resultado?.unidad).toBe('mm Hg');
  });

  it('PAD igual a PAS incumple R1 y no hay resultado', () => {
    const estado = evaluar(pam, entradas('80', '80'));
    expect(estado.reglas.map((r) => r.id)).toEqual(['R1']);
    expect(estado.resultado).toBeUndefined();
  });

  it('PAD mayor que PAS incumple R1 con su mensaje', () => {
    const estado = evaluar(pam, entradas('70', '90'));
    expect(estado.reglas[0].mensaje).toBe('La diastólica debe ser menor que la sistólica');
    expect(estado.resultado).toBeUndefined();
  });

  it('PAS 350 da error de rango y no hay resultado', () => {
    const estado = evaluar(pam, entradas('350', '80'));
    expect(estado.errores.pas).toBe('Debe estar entre 40 y 300 mm Hg');
    expect(estado.resultado).toBeUndefined();
  });

  it('PAS 120 sin PAD dice que falta la diastólica', () => {
    const estado = evaluar(pam, entradas('120', ''));
    expect(estado.faltantes).toEqual(['Presión diastólica (PAD)']);
    expect(estado.resultado).toBeUndefined();
  });

  it('un valor fuera de la pista (PAS 85) no genera error y sí calcula', () => {
    const estado = evaluar(pam, entradas('85', '50'));
    expect(estado.errores).toEqual({});
    expect(estado.resultado?.valor).toBe(62);
  });

  it('no acepta decimales (solo enteros)', () => {
    const estado = evaluar(pam, entradas('120.5', '80'));
    expect(estado.errores.pas).toBe('Escribe un número entero');
    expect(estado.resultado).toBeUndefined();
  });
});
