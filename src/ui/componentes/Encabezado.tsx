import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colores, fuentes, estilosTema } from '../tema';
import { useTema } from '../useTema';
import { LogoMS } from './LogoMS';

type Props = {
  titulo: string;
  /** Muestra la flecha de regreso (pantallas internas). */
  atras?: boolean;
};

/** Barra verde fija de la app: logo y nombre de la pantalla. Cubre también la zona de la hora y la batería. */
export function Encabezado({ titulo, atras }: Props) {
  useTema();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[estilos.barra, { paddingTop: insets.top + 8 }]}>
      <StatusBar style="light" />
      {atras ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          hitSlop={10}
          style={estilos.atras}
        >
          <Ionicons name="chevron-back" size={28} color={colores.textoSobreBarra} />
        </Pressable>
      ) : null}
      <LogoMS />
      <Text accessibilityRole="header" numberOfLines={1} style={estilos.titulo}>
        {titulo}
      </Text>
    </View>
  );
}

const estilos = estilosTema(() => StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colores.barra,
  },
  atras: { marginRight: -6 },
  titulo: { flex: 1, fontFamily: fuentes.negrita, fontSize: 24, color: colores.textoSobreBarra },
}));
