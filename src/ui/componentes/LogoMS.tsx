import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, fuentes, estilosTema } from '../tema';
import { useTema } from '../useTema';

// El logo conserva sus colores en los dos temas.
export const COLOR_LOGO = { circulo: '#DCEBD8', letras: '#284C3B' } as const;

/** Logo de la app: cuadrado redondeado verde claro con "MS" + estetoscopio, "Med" y "Calc" (medidas relativas al diámetro). */
export function LogoMS({ diametro = 56 }: { diametro?: number }) {
  useTema();
  const d = diametro;
  return (
    <View
      accessible
      accessibilityLabel="MS Med Calc"
      style={[estilos.circulo, { width: d, height: d, borderRadius: d * 0.26 }]}
    >
      <View style={estilos.fila}>
        <Text allowFontScaling={false} style={[estilos.texto, { fontSize: d * 0.27 }]}>
          MS
        </Text>
        <MaterialCommunityIcons
          name="stethoscope"
          size={d * 0.2}
          color={COLOR_LOGO.letras}
          style={{ marginLeft: d * 0.02, marginTop: -d * 0.07 }}
        />
      </View>
      <Text allowFontScaling={false} style={[estilos.texto, { fontSize: d * 0.19, marginTop: d * 0.03 }]}>
        Med
      </Text>
      <Text allowFontScaling={false} style={[estilos.texto, { fontSize: d * 0.19, marginTop: d * 0.01 }]}>
        Calc
      </Text>
    </View>
  );
}

const estilos = estilosTema(() => StyleSheet.create({
  circulo: { backgroundColor: COLOR_LOGO.circulo, alignItems: 'center', justifyContent: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center' },
  texto: { fontFamily: fuentes.negrita, color: COLOR_LOGO.letras, includeFontPadding: false },
}));
