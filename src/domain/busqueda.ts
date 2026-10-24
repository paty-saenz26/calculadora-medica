import type { Calculadora } from './tipos';

/** Minúsculas, sin acentos y con subíndices convertidos a dígitos ("CHA₂DS₂" -> "cha2ds2"). */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFKD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .trim();
}

/**
 * Busca en nombre, siglas o nombres alternos y descripción (F02). No distingue mayúsculas ni acentos.
 * Cada palabra escrita debe aparecer en algún lado. Orden: primero coincidencias en el nombre,
 * luego en nombre y siglas, luego el resto; a igualdad, se respeta el orden del catálogo.
 */
export function buscarCalculadoras(catalogo: Calculadora[], texto: string): Calculadora[] {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) {
    return catalogo;
  }

  const rangos: { calculadora: Calculadora; rango: number; posicion: number }[] = [];
  catalogo.forEach((calculadora, posicion) => {
    const nombre = normalizar(calculadora.nombre);
    const claves = normalizar((calculadora.palabrasClave ?? []).join(' '));
    const descripcion = normalizar(calculadora.descripcion);

    const enNombre = palabras.every((p) => nombre.includes(p));
    const enNombreOClaves = palabras.every((p) => `${nombre} ${claves}`.includes(p));
    const enTodo = palabras.every((p) => `${nombre} ${claves} ${descripcion}`.includes(p));

    if (enTodo) {
      rangos.push({ calculadora, rango: enNombre ? 0 : enNombreOClaves ? 1 : 2, posicion });
    }
  });

  return rangos
    .sort((a, b) => a.rango - b.rango || a.posicion - b.posicion)
    .map((r) => r.calculadora);
}
