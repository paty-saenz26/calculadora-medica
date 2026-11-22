import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, fuentes } from '../tema';

export const COLOR_LOGO = { fondo: '#DCEBD8', letras: '#284C3B' } as const;

/** Logo de la app: cuadrado redondeado verde claro con "MS" y un estetoscopio (medidas relativas al lado). */
export function LogoMS({ diametro = 56, verde = false }: { diametro?: number; verde?: boolean }) {
  const d = diametro;
  return (
    <View
      accessible
      accessibilityLabel="MS"
      style={[estilos.cuadro, { width: d, height: d, borderRadius: d * 0.26 }, verde && { backgroundColor: colores.primario }]}
    >
      <View style={estilos.fila}>
        <Text allowFontScaling={false} style={[estilos.texto, { fontSize: d * 0.3 }, verde && { color: COLOR_LOGO.fondo }]}>
          MS
        </Text>
        <MaterialCommunityIcons
          name="stethoscope"
          size={d * 0.34}
          color={verde ? COLOR_LOGO.fondo : COLOR_LOGO.letras}
          style={{ marginLeft: d * 0.02 }}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cuadro: { backgroundColor: COLOR_LOGO.fondo, alignItems: 'center', justifyContent: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center' },
  texto: { fontFamily: fuentes.negrita, color: COLOR_LOGO.letras, includeFontPadding: false },
});