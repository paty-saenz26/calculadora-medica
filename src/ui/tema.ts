// Tokens de diseño (constitución, sección 3.1). Nunca usar colores sueltos en las pantallas.

const claro = {
  fondo: '#FFFFFF',
  primario: '#507858',
  primarioClaro: '#6B9460', // solo decorativo
  textoPrincipal: '#284C3B',
  textoSecundario: '#507858',
  textoSobreCristal: '#355A41', // secundario sobre cristal (contraste)
  chip: '#DCEBD8',
  fondoSuave: '#EAF2E7',
  fondoSuave2: '#F3F8F1',
  borde: '#DCE8D8',
  acento: '#84AB7A', // solo resplandor, nunca texto
  textoSobrePrimario: '#FFFFFF',
  // Fondo degradado y forma curva
  degradadoInicio: '#F3F8F1',
  degradadoMedio: '#DCEBD8',
  degradadoFin: '#C9DFBF',
  formaInicio: '#CFE3C0',
  formaFin: '#B9D7A3',
  // Cristal
  cristal: 'rgba(255,255,255,0.40)', // opacidad del cristal: más bajo = más translúcido
  cristalBorde: 'rgba(255,255,255,0.75)',
  // PROVISIONAL: los colores semánticos siguen pendientes de definir (constitución, 3.1).
  error: '#B3261E',
  // Barra superior, acciones de peligro y fondos de ventanas modales.
  barra: '#507858',
  textoSobreBarra: '#FFFFFF',
  peligro: '#B3261E',
  textoSobrePeligro: '#FFFFFF',
  velo: 'rgba(40,76,59,0.35)',
  veloFuerte: 'rgba(40,76,59,0.55)',
  sombra: '#284C3B',
} as const;

const oscuro: Record<keyof typeof claro, string> = {
  fondo: '#0E1913',
  primario: '#84AB7A',
  primarioClaro: '#6B9460', // solo decorativo
  textoPrincipal: '#E4F0E2',
  textoSecundario: '#9DB8A5',
  textoSobreCristal: '#B7CFBD',
  chip: '#27412F',
  fondoSuave: '#1E3326',
  fondoSuave2: '#14241B',
  borde: '#2F463B',
  acento: '#84AB7A',
  textoSobrePrimario: '#10241A',
  degradadoInicio: '#0E1913',
  degradadoMedio: '#14241B',
  degradadoFin: '#1A2F22',
  formaInicio: '#264432',
  formaFin: '#1B3526',
  cristal: 'rgba(255,255,255,0.07)',
  cristalBorde: 'rgba(255,255,255,0.14)',
  error: '#F2B8B5',
  barra: '#2B4A38',
  textoSobreBarra: '#F1F7EE',
  peligro: '#B3261E',
  textoSobrePeligro: '#FFFFFF',
  velo: 'rgba(0,0,0,0.55)',
  veloFuerte: 'rgba(0,0,0,0.7)',
  sombra: '#000000',
};

export type Paleta = { [K in keyof typeof claro]: string };
export type ModoTema = 'claro' | 'oscuro';
export const paletas: Record<ModoTema, Paleta> = { claro, oscuro };

/** Paleta activa. Es un objeto mutable: `aplicarModo` cambia sus valores y las pantallas se vuelven a dibujar con `useTema`. */
export const colores: Paleta = { ...claro };

export const estadoTema = { modo: 'claro' as ModoTema, version: 0 };

export function aplicarModo(modo: ModoTema): void {
  if (estadoTema.modo === modo) return;
  estadoTema.modo = modo;
  Object.assign(colores, paletas[modo]);
  estadoTema.version += 1;
}

/** Como `StyleSheet.create`, pero se vuelve a calcular cuando cambia el tema. */
export function estilosTema<T extends object>(crear: () => T): T {
  let version = -1;
  let cache = {} as T;
  return new Proxy({} as T, {
    get(_, propiedad) {
      if (version !== estadoTema.version) {
        cache = crear();
        version = estadoTema.version;
      }
      return (cache as Record<string | symbol, unknown>)[propiedad];
    },
  });
}

// Nombres de las fuentes cargadas en src/app/_layout.tsx
export const fuentes = {
  delgada: 'HankenGrotesk_200ExtraLight', // números grandes
  normal: 'HankenGrotesk_400Regular',
  media: 'HankenGrotesk_500Medium', // etiquetas
  seminegrita: 'HankenGrotesk_600SemiBold',
  negrita: 'HankenGrotesk_700Bold', // nombres de calculadoras
} as const;

export const radios = {
  tarjeta: 24,
  resultado: 28,
  barra: 32,
  pildora: 999,
} as const;

export const espacios = {
  xs: 4,
  s: 8,
  m: 14,
  l: 16,
  xl: 24,
} as const;

/** Modo efectivo según el ajuste del usuario (claro, oscuro o el del teléfono). */
export function modoEfectivo(preferencia: 'sistema' | 'claro' | 'oscuro', sistema: string | null | undefined): ModoTema {
  if (preferencia === 'sistema') return sistema === 'dark' ? 'oscuro' : 'claro';
  return preferencia;
}
