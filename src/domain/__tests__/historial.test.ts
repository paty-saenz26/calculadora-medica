import { catalogo, obtenerCalculadora } from '../calculadoras/catalogo';
import { alternarFavorito, esFavorita } from '../favoritos';
import {
  construirCalculo,
  delUsuario,
  describirValores,
  esDuplicado,
  formatearFecha,
  LIMITE_NOTA,
  ordenarPorFecha,
  paginar,
  validarNota,
} from '../historial';
import { evaluar } from '../motor';

const pam = obtenerCalculadora('pam')!;
const stop = obtenerCalculadora('stop-bang')!;

const calculo = (pas: string, pad: string, id = 'a', fecha = 1000, unidades?: Record<string, string>) => {
  const entradas = { valores: { pas, pad }, unidades };
  const { resultado } = evaluar(pam, entradas);
  return construirCalculo(pam, entradas, resultado!, id, fecha);
};

describe('construirCalculo', () => {
  it('guarda lo capturado con la unidad base y la versión', () => {
    const c = calculo(' 120 ', '80');
    expect(c).toMatchObject({ calculadoraId: 'pam', calculadoraVersion: pam.version, valores: { pas: '120', pad: '80' } });
    expect(c.resultado.valor).toBe(93);
    expect(c.nota).toBeUndefined();
    expect(c.usuarioId).toBeUndefined();
  });

  it('resuelve los sí/no con su valor inicial (D15)', () => {
    const entradas = { valores: {} };
    const c = construirCalculo(stop, entradas, { valor: 0, interpretacion: '' }, 'x', 1);
    expect(Object.values(c.valores).every((v) => v === false)).toBe(true);
  });
});

describe('esDuplicado (R10)', () => {
  it('es duplicado si es idéntico al último de esa calculadora', () => {
    expect(esDuplicado(calculo('120', '80', 'b', 2000), [calculo('120', '80', 'a', 1000)])).toBe(true);
  });
  it('no lo es si cambia un valor', () => {
    expect(esDuplicado(calculo('121', '80', 'b'), [calculo('120', '80', 'a')])).toBe(false);
  });
  it('no lo es si cambia la unidad', () => {
    const otra = calculo('120', '80', 'b', 2, { pas: 'kpa' });
    expect(esDuplicado(otra, [calculo('120', '80', 'a')])).toBe(false);
  });
  it('compara solo con el último: A, B, A se guarda', () => {
    const lista = [calculo('120', '80', 'a', 1), calculo('110', '70', 'b', 2)];
    expect(esDuplicado(calculo('120', '80', 'c', 3), lista)).toBe(false);
  });
  it('no lo es si no hay cálculos previos de esa calculadora', () => {
    expect(esDuplicado(calculo('120', '80'), [])).toBe(false);
  });
});

describe('orden y paginación', () => {
  const lista = Array.from({ length: 45 }, (_, i) => calculo('120', '80', `c${i}`, i));
  it('ordena del más reciente al más antiguo', () => {
    expect(ordenarPorFecha(lista)[0].id).toBe('c44');
  });
  it('pagina de 20 en 20', () => {
    expect(paginar(lista, 1)).toMatchObject({ hayMas: true });
    expect(paginar(lista, 1).items).toHaveLength(20);
    expect(paginar(lista, 2).items).toHaveLength(40);
    expect(paginar(lista, 3)).toMatchObject({ hayMas: false });
    expect(paginar(lista, 3).items).toHaveLength(45);
  });
});

describe('validarNota (R9)', () => {
  it('acepta hasta 200 caracteres y recorta espacios', () => {
    expect(validarNota('  hola ')).toEqual({ ok: true, nota: 'hola' });
    expect(validarNota('a'.repeat(LIMITE_NOTA)).ok).toBe(true);
  });
  it('rechaza más de 200', () => {
    expect(validarNota('a'.repeat(LIMITE_NOTA + 1)).ok).toBe(false);
  });
  it('vacía elimina la nota', () => {
    expect(validarNota('   ')).toEqual({ ok: true, nota: undefined });
  });
});

describe('describirValores y fecha', () => {
  it('muestra valores con su unidad y opciones con su etiqueta', () => {
    const lineas = describirValores(pam, calculo('120', '80'));
    expect(lineas).toHaveLength(2);
    expect(lineas[0].texto).toMatch(/^120 /);
  });
  it('formatea sí/no', () => {
    const c = construirCalculo(stop, { valores: { ronquido: true } }, { valor: 1, interpretacion: '' }, 'x', 1);
    const l = describirValores(stop, c);
    expect(l.find((x) => x.etiqueta.startsWith('Ronca'))?.texto).toBe('Sí');
    expect(l.find((x) => x.etiqueta.startsWith('Se siente'))?.texto).toBe('No');
  });
  it('da una fecha legible', () => {
    expect(formatearFecha(Date.UTC(2026, 10, 19, 15, 5))).toMatch(/2026/);
  });
  it('el catálogo se usa sin romper', () => {
    expect(catalogo.length).toBeGreaterThan(0);
  });
});

describe('favoritos', () => {
  it('alterna marcar y quitar', () => {
    const a = alternarFavorito([], 'pam', 5);
    expect(a).toEqual([{ calculadoraId: 'pam', fecha: 5 }]);
    expect(esFavorita(a, 'pam')).toBe(true);
    expect(alternarFavorito(a, 'pam', 6)).toEqual([]);
  });
  it('separa los favoritos de invitado y de cada cuenta', () => {
    const a = alternarFavorito([], 'pam', 5, 'u1');
    expect(esFavorita(a, 'pam', 'u1')).toBe(true);
    expect(esFavorita(a, 'pam')).toBe(false);
    expect(esFavorita(a, 'pam', 'u2')).toBe(false);
  });
});

describe('delUsuario y duplicados por dueño', () => {
  it('filtra por cuenta o invitado', () => {
    const lista = [{ usuarioId: 'u1' }, {}, { usuarioId: 'u2' }];
    expect(delUsuario(lista, 'u1')).toHaveLength(1);
    expect(delUsuario(lista, undefined)).toHaveLength(1);
  });
  it('lo idéntico de otra cuenta no cuenta como duplicado', () => {
    const entradas = { valores: { pas: '120', pad: '80' } };
    const r = evaluar(pam, entradas).resultado!;
    const deU1 = construirCalculo(pam, entradas, r, 'a', 1, 'u1');
    const deU2 = construirCalculo(pam, entradas, r, 'b', 2, 'u2');
    expect(esDuplicado(deU2, [deU1])).toBe(false);
  });
});
