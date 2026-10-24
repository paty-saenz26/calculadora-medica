import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colores, radios } from '../tema';

type Props = {
  children: ReactNode;
  radio?: number;
  style?: StyleProp<ViewStyle>;
  /** Borde de color (por ejemplo, campo enfocado). */
  bordeColor?: string;
};

/** Tarjeta de cristal: desenfoque, blanco translúcido y borde blanco fino (constitución, 3.1). */
export function Cristal({ children, radio = radios.tarjeta, style, bordeColor }: Props) {
  return (
    <View style={[estilos.sombra, { borderRadius: radio }]}>
      <View
        style={[
          estilos.tarjeta,
          { borderRadius: radio, borderColor: bordeColor ?? colores.cristalBorde },
          bordeColor ? { borderWidth: 2 } : null,
          style,
        ]}
      >
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colores.cristal }]} />
        {children}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  sombra: {
    shadowColor: '#284C3B',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  tarjeta: {
    overflow: 'hidden',
    borderWidth: 1,
  },
});
