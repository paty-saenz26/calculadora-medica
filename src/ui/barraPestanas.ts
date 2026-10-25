import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Medidas de la barra de pestañas flotante. */
export const BARRA = { alto: 72, margenLateral: 16, radio: 32, separacion: 12 } as const;

/** Distancia entre el borde inferior de la pantalla y la barra flotante. */
export function margenInferiorBarra(insetInferior: number): number {
  return insetInferior > 0 ? Math.max(insetInferior - 10, 8) : 12;
}

/** Espacio que las pantallas deben dejar libre abajo para que la barra flotante no tape su contenido. */
export function useEspacioBarra(): number {
  const { bottom } = useSafeAreaInsets();
  return margenInferiorBarra(bottom) + BARRA.alto + BARRA.separacion;
}
