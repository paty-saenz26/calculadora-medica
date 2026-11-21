import { useColorScheme } from 'react-native';

import { useAjustes } from '../state/instancias';
import { aplicarModo, colores, modoEfectivo, type ModoTema } from './tema';

/** Llamar al inicio de cada componente que use `colores` o `estilos`: aplica la paleta y lo redibuja al cambiar. */
export function useTema(): ModoTema {
  const preferencia = useAjustes((s) => s.tema);
  const sistema = useColorScheme();
  const modo = modoEfectivo(preferencia, sistema);
  aplicarModo(modo);
  return modo;
}

export { colores };
