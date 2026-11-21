import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';

import { colores } from '../tema';
import { useTema } from '../useTema';

/** Capa de cristal (desenfoque + blanco translúcido + borde) para fondos de barras flotantes. */
export function FondoCristal({ radio }: { radio: number }) {
  const modo = useTema();
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { borderRadius: radio, overflow: 'hidden', borderWidth: 1, borderColor: colores.cristalBorde },
      ]}
    >
      <BlurView intensity={40} tint={modo === 'oscuro' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colores.cristal }]} />
    </View>
  );
}
