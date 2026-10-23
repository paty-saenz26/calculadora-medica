import { evaluar, validarNumero } from '../motor';
import { convertirTexto, convertirValor, formatearNumero } from '../unidades';
import type { Calculadora, CampoNumero } from '../tipos';

// Calculadora de prueba con los tres tipos de campo, unidades y un campo opcional.
const MG_DL = { id: 'mgdl', etiqueta: 'mg/dL', factor: 1, decimales: 2 };
const UMOL_L = { id: 'umoll', etiqueta: 'µmol/L', factor: 1 / 88.4, decimales: 0 };

const creatinina: CampoNumero = {
  tipo: 'numero',
  id: 'cr',
  etiqueta: 'Creatinina',
  unidades: [MG_DL, UMOL_L],
  rangoValido: { min: 0.2, max: 20 },
};

const prueba: Calculadora = {
  id: 'prueba',
  nombre: 'Prueba',
  descripcion: '',
  especialidades: [],
  version: 1,
  fuente: '',
  campos: [
    creatinina,
    { tipo: 'numero', id: 'peso', etiqueta: 'Peso', unidades: [{ id: 'kg', etiqueta: 'kg', factor: 1 }], rangoValido: { min: 20, max: 300 }, opcional: true },
    { tipo: 'opcion', id: 'sexo', etiqueta: 'Sexo', opciones: [{ valor: 'm', etiqueta: 'Mujer' }, { valor: 'h', etiqueta: 'Hombre' }] },
    { tipo: 'sino', id: 'dm', etiqueta: 'Diabetes', valorInicial: false },
  ],
  reglas: [],
  calcular: (v) => ({ valor: (v.cr as number) * 10, interpretacion: String(v.dm) }),
};

describe('validarNumero', () => {
  it('campo vacío devuelve "vacio"', () => {
    expect(validarNumero(creatinina, '').estado).toBe('vacio');
    expect(validarNumero(creatinina, undefined).estado).toBe('vacio');
  });

  it('rechaza coma y letras', () => {
    expect(validarNumero(creatinina, '1,5').estado).toBe('error');
    expect(validarNumero(creatinina, 'abc').estado).toBe('error');
  });

  it('acepta punto decimal', () => {
    expect(validarNumero(creatinina, '1.5')).toMatchObject({ estado: 'ok', valor: 1.5 });
  });

  it('valida el rango en la unidad seleccionada y lo muestra en esa unidad', () => {
    const r = validarNumero(creatinina, '5', 'umoll');
    expect(r).toEqual({ estado: 'error', mensaje: 'Debe estar entre 18 y 1768 µmol/L' });
  });

  it('88 µmol/L es válido y se convierte a la base', () => {
    const r = validarNumero(creatinina, '88', 'umoll');
    expect(r.estado).toBe('ok');
    if (r.estado === 'ok') expect(r.valorBase).toBeCloseTo(0.9955, 3);
  });
});

describe('evaluar', () => {
  it('al abrir lista los obligatorios sin valor inicial (el sí/no con valor inicial no cuenta)', () => {
    const e = evaluar(prueba, { valores: {} });
    expect(e.faltantes).toEqual(['Creatinina', 'Sexo']);
    expect(e.resultado).toBeUndefined();
  });

  it('la lista de faltantes se reduce al llenar campos y nunca hay resultado parcial', () => {
    const e = evaluar(prueba, { valores: { cr: '1' } });
    expect(e.faltantes).toEqual(['Sexo']);
    expect(e.resultado).toBeUndefined();
  });

  it('con todo completo calcula, y el campo opcional vacío no estorba', () => {
    const e = evaluar(prueba, { valores: { cr: '1', sexo: 'h' } });
    expect(e.faltantes).toEqual([]);
    expect(e.resultado?.valor).toBe(10);
  });

  it('un valor inválido en un campo opcional con valor sí bloquea el resultado', () => {
    const e = evaluar(prueba, { valores: { cr: '1', sexo: 'h', peso: '5' } });
    expect(e.errores.peso).toBeDefined();
    expect(e.resultado).toBeUndefined();
  });

  it('el sí/no toma el valor que el usuario eligió', () => {
    const e = evaluar(prueba, { valores: { cr: '1', sexo: 'h', dm: true } });
    expect(e.resultado?.interpretacion).toBe('true');
  });

  it('ignora una opción que no existe', () => {
    const e = evaluar(prueba, { valores: { cr: '1', sexo: 'x' } });
    expect(e.faltantes).toEqual(['Sexo']);
  });

  it('una regla entre campos solo se evalúa si sus campos tienen valor', () => {
    const conRegla: Calculadora = {
      ...prueba,
      reglas: [{ id: 'R', mensaje: 'no', campos: ['cr', 'peso'], cumple: () => false }],
    };
    expect(evaluar(conRegla, { valores: { cr: '1', sexo: 'h' } }).reglas).toEqual([]);
    expect(evaluar(conRegla, { valores: { cr: '1', sexo: 'h', peso: '70' } }).reglas).toHaveLength(1);
  });
});

describe('unidades', () => {
  it('1.0 mg/dL equivale a 88 µmol/L', () => {
    expect(convertirTexto('1', MG_DL, UMOL_L)).toBe('88');
  });

  it('120 mg/dL a µmol/L usa el factor 88.4', () => {
    expect(convertirValor(1, MG_DL, UMOL_L)).toBeCloseTo(88.4, 6);
  });

  it('formatearNumero quita ceros sobrantes', () => {
    expect(formatearNumero(1, 2)).toBe('1');
    expect(formatearNumero(88.4, 2)).toBe('88.4');
    expect(formatearNumero(0.123456, 2)).toBe('0.12');
  });

  it('convertirTexto deja igual un texto vacío o inválido', () => {
    expect(convertirTexto('', MG_DL, UMOL_L)).toBe('');
    expect(convertirTexto('abc', MG_DL, UMOL_L)).toBe('abc');
  });
});
