import type { Calculadora } from './tipos';

/** Fecha en milisegundos desde 1970 (Date.now()). */
type ConFecha = { calculadoraId: string; fecha: number };

const comparar = (a: string, b: string) => a.localeCompare(b, 'es', { sensitivity: 'base' });

/** Pestaña Todas: todo el catálogo en orden alfabético. */
export function ordenAlfabetico(catalogo: Calculadora[]): Calculadora[] {
  return [...catalogo].sort((a, b) => comparar(a.nombre, b.nombre));
}

/** Pestaña Recientes (D10): una vez por calculadora, la más reciente primero. Solo las que siguen en el catálogo. */
export function derivarRecientes(calculos: ConFecha[], catalogo: Calculadora[]): Calculadora[] {
  const ultima = new Map<string, number>();
  for (const c of calculos) {
    ultima.set(c.calculadoraId, Math.max(ultima.get(c.calculadoraId) ?? 0, c.fecha));
  }
  return catalogo
    .filter((c) => ultima.has(c.id))
    .sort((a, b) => (ultima.get(b.id) as number) - (ultima.get(a.id) as number));
}

/** Pestaña Favoritas: de la marcada más recientemente a la más antigua. */
export function derivarFavoritas(favoritos: ConFecha[], catalogo: Calculadora[]): Calculadora[] {
  const fechas = new Map(favoritos.map((f) => [f.calculadoraId, f.fecha]));
  return catalogo
    .filter((c) => fechas.has(c.id))
    .sort((a, b) => (fechas.get(b.id) as number) - (fechas.get(a.id) as number));
}

export type GrupoEspecialidad = { especialidad: string; calculadoras: Calculadora[] };

/** Pestaña Especialidades: una calculadora puede aparecer en varias. */
export function agruparPorEspecialidad(catalogo: Calculadora[]): GrupoEspecialidad[] {
  const grupos = new Map<string, Calculadora[]>();
  for (const calculadora of ordenAlfabetico(catalogo)) {
    for (const especialidad of calculadora.especialidades) {
      grupos.set(especialidad, [...(grupos.get(especialidad) ?? []), calculadora]);
    }
  }
  return [...grupos.entries()]
    .map(([especialidad, calculadoras]) => ({ especialidad, calculadoras }))
    .sort((a, b) => comparar(a.especialidad, b.especialidad));
}
