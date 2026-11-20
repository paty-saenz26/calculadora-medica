import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { colores } from '../tema';

type Props = { activo: boolean; onPress: () => void; tamano?: number };

/** Estrella de favoritos (F04). */
export function BotonFavorito({ activo, onPress, tamano = 26 }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={activo ? 'Quitar de favoritas' : 'Marcar como favorita'}
      accessibilityState={{ selected: activo }}
      hitSlop={10}
      onPress={onPress}
    >
      <Ionicons name={activo ? 'star' : 'star-outline'} size={tamano} color={colores.primario} />
    </Pressable>
  );
}
