import type { Campo, ValoresCalculo } from './tipos';

/** Suma los puntos de las opciones elegidas y de los sí/no contestados con "Sí". */
export function sumarPuntos(campos: Campo[], valores: ValoresCalculo): number {
  let total = 0;
  for (const campo of campos) {
    const valor = valores[campo.id];
    if (campo.tipo === 'opcion' && typeof valor === 'string') {
      total += campo.opciones.find((o) => o.valor === valor)?.puntos ?? 0;
    } else if (campo.tipo === 'sino' && valor === true) {
      total += campo.puntos ?? 0;
    }
  }
  return total;
}
