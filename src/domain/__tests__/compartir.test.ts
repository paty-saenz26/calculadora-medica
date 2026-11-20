import { obtenerCalculadora } from '../calculadoras/catalogo';
import { construirMensajeEnlace, construirTextoCompartir, urlCalculadora, URL_BASE } from '../compartir';
import { construirCalculo } from '../historial';
import { evaluar } from '../motor';

const pam = obtenerCalculadora('pam')!;

const calculo = (nota?: string) => {
  const entradas = { valores: { pas: '120', pad: '80' } };
  const c = construirCalculo(pam, entradas, evaluar(pam, entradas).resultado!, 'a', 1, 'uid-secreto');
  return { ...c, nota };
};

describe('F06 texto para compartir', () => {
  const texto = construirTextoCompartir(pam, calculo());

  it('incluye calculadora, valores con unidad, resultado, fuente y nombre de la app', () => {
    expect(texto).toContain(pam.nombre);
    expect(texto).toMatch(/120 mm ?Hg/);
    expect(texto).toMatch(/80 mm ?Hg/);
    expect(texto).toMatch(/Resultado: 93/);
    expect(texto).toContain(`Fuente: ${pam.fuente}`);
    expect(texto.trim().endsWith('Calculadora Médica')).toBe(true);
  });

  it('incluye la interpretación', () => {
    expect(texto).toContain(evaluar(pam, { valores: { pas: '120', pad: '80' } }).resultado!.interpretacion);
  });

  it('nunca incluye la nota ni el identificador de usuario (R4)', () => {
    const conNota = construirTextoCompartir(pam, calculo('paciente Juan Pérez'));
    expect(conNota).not.toContain('Juan');
    expect(conNota).not.toContain('uid-secreto');
    expect(conNota).toBe(texto);
  });

  it('usa lo guardado: no recalcula con la fórmula actual (D9)', () => {
    const guardado = { ...calculo(), resultado: { valor: 77, unidad: 'mm Hg', interpretacion: 'texto guardado' } };
    const t = construirTextoCompartir(pam, guardado);
    expect(t).toContain('Resultado: 77 mm Hg');
    expect(t).toContain('texto guardado');
  });

  it('muestra resultados secundarios cuando existen', () => {
    const imc = obtenerCalculadora('imc-sc')!;
    const entradas = { valores: { peso: '70', talla: '175' } };
    const r = evaluar(imc, entradas).resultado!;
    const t = construirTextoCompartir(imc, construirCalculo(imc, entradas, r, 'b', 1));
    for (const d of r.detalles ?? []) expect(t).toContain(d.etiqueta);
  });
});

describe('F06 compartir con tarjeta (enlace)', () => {
  it('el enlace apunta a la página de la calculadora', () => {
    expect(urlCalculadora('pam')).toBe(`${URL_BASE}/c/pam/`);
  });
  it('el mensaje lleva el resultado y el enlace, sin la nota', () => {
    const m = construirMensajeEnlace(pam, calculo('paciente Juan'));
    expect(m).toContain('93');
    expect(m).toContain(urlCalculadora('pam'));
    expect(m).not.toContain('Juan');
    expect(m).not.toContain('uid-secreto');
  });
  it('todas las calculadoras del catálogo tienen enlace con su id', () => {
    const { catalogo } = require('../calculadoras/catalogo');
    for (const c of catalogo) expect(urlCalculadora(c.id)).toMatch(/\/c\/[a-z0-9-]+\/$/);
  });
});
