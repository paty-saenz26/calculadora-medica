// Bienvenida (F01, D1b): se muestra solo la primera vez, con tres opciones.
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAjustes } from '../state/instancias';
import { Fondo } from '../ui/componentes/Fondo';
import { LogoMS } from '../ui/componentes/LogoMS';
import { colores, fuentes } from '../ui/tema';

export default function Bienvenida() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const marcarVista = useAjustes((s) => s.marcarBienvenidaVista);

  const continuar = (modo?: 'iniciar' | 'registrar') => {
    marcarVista();
    router.replace('/');
    if (modo) router.push({ pathname: '/acceso', params: { modo } });
  };

  return (
    <Fondo>
      <View style={[estilos.contenido, { paddingTop: 0, paddingBottom: insets.bottom + 24 }]}>
        <View style={estilos.marca}>
          <View style={estilos.logo}>
            <LogoMS diametro={104} verde />
          </View>
          <Text style={estilos.nombre}>Calculadora Médica</Text>
          <Text style={estilos.lema}>Calculadoras y escalas clínicas en español, a un toque.</Text>
        </View>

        <View style={estilos.botones}>
          <Pressable accessibilityRole="button" onPress={() => continuar()} style={estilos.primario}>
            <Text style={estilos.textoPrimario}>Continuar sin cuenta</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => continuar('iniciar')} style={estilos.secundario}>
            <Text style={estilos.textoSecundario}>Iniciar sesión</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => continuar('registrar')} style={estilos.secundario}>
            <Text style={estilos.textoSecundario}>Crear cuenta</Text>
          </Pressable>
          <Text style={estilos.nota}>
            Con cuenta se sincronizan tu historial y tus favoritos. Sin cuenta, todo se guarda solo en este teléfono.
          </Text>
        </View>
      </View>
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  contenido: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  marca: { flex: 1, gap: 14, alignItems: 'center', justifyContent: 'center' },
  logo: { alignItems: 'center' },
  mas: { fontFamily: fuentes.negrita, fontSize: 56, lineHeight: 64, color: colores.textoSobrePrimario },
  nombre: { textAlign: 'center', fontFamily: fuentes.negrita, fontSize: 40, lineHeight: 46, color: colores.textoPrincipal },
  lema: { textAlign: 'center', fontFamily: fuentes.normal, fontSize: 20, lineHeight: 28, color: colores.textoSobreCristal },
  botones: { gap: 12 },
  primario: { paddingVertical: 17, borderRadius: 999, backgroundColor: colores.primario, alignItems: 'center' },
  textoPrimario: { fontFamily: fuentes.seminegrita, fontSize: 19, color: colores.textoSobrePrimario },
  secundario: { paddingVertical: 16, borderRadius: 999, backgroundColor: colores.chip, alignItems: 'center' },
  textoSecundario: { fontFamily: fuentes.seminegrita, fontSize: 18, color: colores.textoPrincipal },
  nota: { fontFamily: fuentes.normal, fontSize: 15, lineHeight: 22, color: colores.textoSobreCristal, textAlign: 'center', marginTop: 4 },
});
