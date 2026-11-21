import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';

import { colores } from '../tema';

/** Capa de cristal (desenfoque + blanco translúcido + borde) para fondos de barras flotantes. */
export function FondoCristal({ radio }: { radio: number }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { borderRadius: radio, overflow: 'hidden', borderWidth: 1, borderColor: colores.cristalBorde },
      ]}
    >
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colores.cristal }]} />
    </View>
  );
}
