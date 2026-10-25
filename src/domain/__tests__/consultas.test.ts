import { catalogo } from '../calculadoras/catalogo';
import { agruparPorEspecialidad, derivarFavoritas, derivarRecientes, ordenAlfabetico } from '../consultas';

describe('ordenAlfabetico (Todas)', () => {
  it('ordena por nombre ignorando acentos y símbolos de idioma', () => {
    const nombres = ordenAlfabetico(catalogo).map((c) => c.nombre);
    expect(nombres).toEqual([...nombres].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })));
  });

  it('no modifica el catálogo original', () => {
    const copia = catalogo.map((c) => c.id);
    ordenAlfabetico(catalogo);
    expect(catalogo.map((c) => c.id)).toEqual(copia);
  });
});

describe('derivarRecientes (D10)', () => {
  it('sin historial no hay recientes', () => {
    expect(derivarRecientes([], catalogo)).toEqual([]);
  });

  it('ordena por el último cálculo y no repite calculadoras', () => {
    const calculos = [
      { calculadoraId: 'pam', fecha: 100 },
      { calculadoraId: 'imc-sc', fecha: 300 },
      { calculadoraId: 'pam', fecha: 200 },
    ];
    expect(derivarRecientes(calculos, catalogo).map((c) => c.id)).toEqual(['imc-sc', 'pam']);
  });

  it('usa la fecha más reciente de cada calculadora aunque venga desordenada', () => {
    const calculos = [
      { calculadoraId: 'pam', fecha: 500 },
      { calculadoraId: 'imc-sc', fecha: 300 },
      { calculadoraId: 'pam', fecha: 100 },
    ];
    expect(derivarRecientes(calculos, catalogo).map((c) => c.id)).toEqual(['pam', 'imc-sc']);
  });

  it('al borrar todos los cálculos de una calculadora desaparece de recientes', () => {
    const calculos = [{ calculadoraId: 'imc-sc', fecha: 300 }];
    expect(derivarRecientes(calculos, catalogo).map((c) => c.id)).toEqual(['imc-sc']);
  });

  it('ignora cálculos de calculadoras que ya no existen', () => {
    expect(derivarRecientes([{ calculadoraId: 'fantasma', fecha: 1 }], catalogo)).toEqual([]);
  });
});

describe('derivarFavoritas', () => {
  it('ordena de la marcada más recientemente a la más antigua', () => {
    const favoritos = [
      { calculadoraId: 'pam', fecha: 100 },
      { calculadoraId: 'cha2ds2-vasc', fecha: 200 },
    ];
    expect(derivarFavoritas(favoritos, catalogo).map((c) => c.id)).toEqual(['cha2ds2-vasc', 'pam']);
  });

  it('sin favoritos devuelve lista vacía', () => {
    expect(derivarFavoritas([], catalogo)).toEqual([]);
  });
});

describe('agruparPorEspecialidad', () => {
  const grupos = agruparPorEspecialidad(catalogo);
  const grupo = (nombre: string) => grupos.find((g) => g.especialidad === nombre);

  it('agrupa por especialidad', () => {
    expect(grupo('Cardiovascular')?.calculadoras.map((c) => c.id).sort()).toEqual(['cha2ds2-va', 'cha2ds2-vasc', 'pam']);
    expect(grupo('Renal')?.calculadoras.map((c) => c.id).sort()).toEqual(['aclaramiento-creatinina', 'ckd-epi-2021', 'deficit-bicarbonato']);
    expect(grupo('Gastroenterología')?.calculadoras.map((c) => c.id).sort()).toEqual(['child-pugh', 'fib4', 'west-haven']);
    expect(grupo('Neumología')?.calculadoras.map((c) => c.id).sort()).toEqual(['stop-bang', 'wells-tep']);
  });

  it('una calculadora con varias especialidades aparece en cada una', () => {
    expect(grupo('Medicina general')?.calculadoras.map((c) => c.id)).toContain('imc-sc');
    expect(grupo('Nutrición')?.calculadoras.map((c) => c.id)).toContain('imc-sc');
  });

  it('ordena las especialidades alfabéticamente', () => {
    const nombres = grupos.map((g) => g.especialidad);
    expect(nombres).toEqual([...nombres].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })));
  });
});
