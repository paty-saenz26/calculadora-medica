import { aplicarModo, colores, estadoTema, estilosTema, modoEfectivo, paletas, type Paleta } from '../tema';

function luminancia(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contraste = (a: string, b: string) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

describe('tema', () => {
  afterEach(() => aplicarModo('claro'));

  it('las dos paletas tienen las mismas claves', () => {
    expect(Object.keys(paletas.oscuro).sort()).toEqual(Object.keys(paletas.claro).sort());
  });

  it('aplicarModo cambia la paleta activa y vuelve a la clara', () => {
    aplicarModo('oscuro');
    expect(colores.fondo).toBe(paletas.oscuro.fondo);
    aplicarModo('claro');
    expect(colores.fondo).toBe(paletas.claro.fondo);
  });

  it('los estilos se recalculan al cambiar de modo y se reutilizan si no cambia', () => {
    let creaciones = 0;
    const estilos = estilosTema(() => {
      creaciones += 1;
      return { caja: { color: colores.textoPrincipal } };
    });
    expect(estilos.caja.color).toBe(paletas.claro.textoPrincipal);
    expect(estilos.caja.color).toBe(paletas.claro.textoPrincipal);
    expect(creaciones).toBe(1);
    aplicarModo('oscuro');
    expect(estilos.caja.color).toBe(paletas.oscuro.textoPrincipal);
    expect(creaciones).toBe(2);
  });

  it('aplicar el mismo modo no invalida los estilos', () => {
    const v = estadoTema.version;
    aplicarModo('claro');
    expect(estadoTema.version).toBe(v);
  });

  it.each(['claro', 'oscuro'] as const)('contraste legible en modo %s', (modo) => {
    const p: Paleta = paletas[modo];
    expect(contraste(p.textoPrincipal, p.degradadoMedio)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(p.textoSobrePrimario, p.primario)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(p.textoSobreBarra, p.barra)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(p.textoSobrePeligro, p.peligro)).toBeGreaterThanOrEqual(4.5);
  });

  it('modoEfectivo respeta la preferencia o sigue al teléfono', () => {
    expect(modoEfectivo('claro', 'dark')).toBe('claro');
    expect(modoEfectivo('oscuro', 'light')).toBe('oscuro');
    expect(modoEfectivo('sistema', 'dark')).toBe('oscuro');
    expect(modoEfectivo('sistema', 'light')).toBe('claro');
    expect(modoEfectivo('sistema', null)).toBe('claro');
  });
});
