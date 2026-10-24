import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colores } from '../tema';

/** Fondo de las pantallas: degradado verde claro con una sola media circunferencia a la derecha. */
export function Fondo({ children }: { children: ReactNode }) {
  return (
    <LinearGradient
      colors={[colores.degradadoInicio, colores.degradadoFin]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={estilos.fondo}
    >
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, estilos.recorte]}>
        <LinearGradient
          colors={[colores.formaInicio, colores.formaFin]}
          style={estilos.forma}
        />
      </View>
      {children}
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1 },
  recorte: { overflow: 'hidden' },
  forma: {
    position: 'absolute',
    right: -130, // sobresale unos 100 px
    top: '38%',
    width: 230,
    height: 230,
    borderRadius: 115,
  },
});
