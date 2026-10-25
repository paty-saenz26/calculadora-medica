import { buscarCalculadoras, normalizar } from '../busqueda';
import { catalogo } from '../calculadoras/catalogo';

const ids = (texto: string) => buscarCalculadoras(catalogo, texto).map((c) => c.id);

describe('normalizar', () => {
  it('quita acentos y mayúsculas', () => {
    expect(normalizar('  Presión ')).toBe('presion');
  });

  it('convierte subíndices en dígitos', () => {
    expect(normalizar('CHA₂DS₂-VASc')).toBe('cha2ds2-vasc');
  });
});

describe('buscarCalculadoras', () => {
  it('sin texto devuelve todo el catálogo', () => {
    expect(ids('')).toHaveLength(catalogo.length);
    expect(ids('   ')).toHaveLength(catalogo.length);
  });

  it('"pam" encuentra Presión arterial media', () => {
    expect(ids('pam')).toEqual(['pam']);
  });

  it('no distingue mayúsculas ni acentos', () => {
    expect(ids('PRESION')).toEqual(['pam']);
    expect(ids('creatinina')).toEqual(expect.arrayContaining(['aclaramiento-creatinina', 'ckd-epi-2021']));
  });

  it('encuentra por siglas y nombres alternos', () => {
    expect(ids('MAP')).toContain('pam');
    expect(ids('Cockcroft')).toEqual(['aclaramiento-creatinina']);
    expect(ids('BSA')).toEqual(['imc-sc']);
    expect(ids('IMC')).toEqual(['imc-sc']);
  });

  it('escribir CHA2DS2 sin subíndices encuentra CHA₂DS₂-VASc y CHA₂DS₂-VA', () => {
    expect(ids('cha2ds2')).toEqual(['cha2ds2-vasc', 'cha2ds2-va']);
  });

  it('el nombre exacto de la variante sin sexo la deja como coincidencia', () => {
    expect(ids('cha2ds2-va')).toContain('cha2ds2-va');
  });

  it('encuentra por la descripción', () => {
    expect(ids('ictus')).toEqual(expect.arrayContaining(['cha2ds2-vasc', 'cha2ds2-va']));
  });

  it('encuentra las calculadoras nuevas por sus siglas', () => {
    expect(ids('TFG')).toContain('ckd-epi-2021');
    expect(ids('apnea')).toEqual(['stop-bang']);
    expect(ids('fibrosis')).toEqual(['fib4']);
    expect(ids('HCO3')).toEqual(['deficit-bicarbonato']);
  });

  it('varias palabras deben aparecer todas', () => {
    expect(ids('presion media')).toEqual(['pam']);
    expect(ids('presion creatinina')).toEqual([]);
  });

  it('sin coincidencias devuelve lista vacía', () => {
    expect(ids('xyz')).toEqual([]);
  });

  it('ordena primero las coincidencias en el nombre', () => {
    // "peso" está en las palabras clave del IMC y no en el nombre de ninguna calculadora.
    expect(ids('imc')[0]).toBe('imc-sc');
  });
});
