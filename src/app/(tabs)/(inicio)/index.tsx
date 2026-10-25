// Inicio TEMPORAL (H2a): lista simple del catálogo. F02 lo reemplaza con búsqueda y pestañas.
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { catalogo } from '../../../domain/calculadoras/catalogo';
import { useEspacioBarra } from '../../../ui/barraPestanas';
import { Cristal } from '../../../ui/componentes/Cristal';
import { Fondo } from '../../../ui/componentes/Fondo';
import { colores, fuentes } from '../../../ui/tema';

export default function Inicio() {
  const insets = useSafeAreaInsets();
  const espacioBarra = useEspacioBarra();
  return (
    <Fondo>
      <ScrollView contentContainerStyle={[estilos.contenido, { paddingTop: insets.top + 24, paddingBottom: espacioBarra + 16 }]}>
        <Text style={estilos.titulo}>Calculadoras</Text>
        <View style={estilos.lista}>
          {catalogo.map((c) => (
            <Link key={c.id} href={{ pathname: '/calculadora/[id]', params: { id: c.id } }} asChild>
              <Pressable accessibilityRole="button">
                <Cristal>
                  <View style={estilos.tarjeta}>
                    <Text style={estilos.nombre}>{c.nombre}</Text>
                    <Text style={estilos.descripcion}>{c.descripcion}</Text>
                  </View>
                </Cristal>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: 16, paddingBottom: 32, gap: 16 },
  titulo: { fontFamily: fuentes.negrita, fontSize: 32, color: colores.textoPrincipal },
  lista: { gap: 12 },
  tarjeta: { padding: 16, gap: 4 },
  nombre: { fontFamily: fuentes.negrita, fontSize: 20, color: colores.textoPrincipal },
  descripcion: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoSobreCristal },
});
