// Tokens de diseño (constitución, sección 3.1). Nunca usar colores sueltos en las pantallas.

export const colores = {
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
  degradadoFin: '#C9DFBF',
  formaInicio: '#CFE3C0',
  formaFin: '#B9D7A3',
} as const;

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
