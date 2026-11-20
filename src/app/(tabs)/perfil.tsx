// Perfil (F07): modo invitado o con cuenta, cerrar sesión y aviso de apoyo clínico.
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSesion } from '../../state/instancias';
import { useEspacioBarra } from '../../ui/barraPestanas';
import { Cristal } from '../../ui/componentes/Cristal';
import { Fondo } from '../../ui/componentes/Fondo';
import { colores, fuentes } from '../../ui/tema';

const VERSION = '1.0.0';

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const espacioBarra = useEspacioBarra();
  const usuario = useSesion((s) => s.usuario);
  const cerrar = useSesion((s) => s.cerrar);

  const confirmarCerrar = () =>
    Alert.alert('¿Cerrar sesión?', 'Tus cálculos y favoritos de la cuenta seguirán en la nube.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          const r = await cerrar();
          if (!r.ok) Alert.alert('Perfil', r.mensaje);
        },
      },
    ]);

  return (
    <Fondo>
      <ScrollView contentContainerStyle={[estilos.contenido, { paddingTop: insets.top + 24, paddingBottom: espacioBarra + 16 }]}>
        <Text style={estilos.titulo}>Perfil</Text>

        <Cristal>
          <View style={estilos.bloque}>
            {usuario ? (
              <>
                <Text style={estilos.etiqueta}>Cuenta</Text>
                <Text style={estilos.correo}>{usuario.email}</Text>
                <Text style={estilos.texto}>Tu historial y tus favoritos se sincronizan con la nube.</Text>
                <Pressable accessibilityRole="button" onPress={confirmarCerrar} style={estilos.secundario}>
                  <Text style={estilos.textoSecundario}>Cerrar sesión</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={estilos.texto}>
                  Estás usando la app sin cuenta. Tus cálculos y favoritos se guardan solo en este teléfono.
                </Text>
                <Text style={estilos.texto}>Con cuenta, se sincronizan tu historial y tus favoritos.</Text>
                <View style={estilos.botones}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push({ pathname: '/acceso', params: { modo: 'iniciar' } })}
                    style={estilos.primario}
                  >
                    <Text style={estilos.textoPrimario}>Iniciar sesión</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push({ pathname: '/acceso', params: { modo: 'registrar' } })}
                    style={estilos.secundario}
                  >
                    <Text style={estilos.textoSecundario}>Crear cuenta</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </Cristal>

        <Text style={estilos.aviso}>
          Resultados de apoyo a la decisión clínica; no sustituyen el criterio médico. Las calculadoras están pendientes de
          validación por un médico. Cada una muestra su fuente bibliográfica.
        </Text>
        <Text style={estilos.version}>Calculadora Médica · versión {VERSION}</Text>
      </ScrollView>
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: 16, gap: 16 },
  titulo: { fontFamily: fuentes.negrita, fontSize: 32, color: colores.textoPrincipal },
  bloque: { padding: 20, gap: 10 },
  etiqueta: { fontFamily: fuentes.media, fontSize: 16, color: colores.textoSobreCristal },
  correo: { fontFamily: fuentes.negrita, fontSize: 22, color: colores.textoPrincipal },
  texto: { fontFamily: fuentes.normal, fontSize: 18, lineHeight: 26, color: colores.textoPrincipal },
  botones: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 6 },
  primario: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 999, backgroundColor: colores.primario },
  textoPrimario: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoSobrePrimario },
  secundario: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 999, backgroundColor: colores.chip, alignSelf: 'flex-start' },
  textoSecundario: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoPrincipal },
  aviso: { fontFamily: fuentes.normal, fontSize: 16, lineHeight: 24, color: colores.textoPrincipal },
  version: { fontFamily: fuentes.normal, fontSize: 14, color: colores.textoSobreCristal },
});
