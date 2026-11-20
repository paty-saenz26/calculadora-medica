// Inicio TEMPORAL (H2a): lista simple del catálogo. F02 lo reemplaza con búsqueda y pestañas.
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { catalogo } from '../../../domain/calculadoras/catalogo';
import { useUid } from '../../../state/hooks';
import { useAlmacen } from '../../../state/instancias';
import { useEspacioBarra } from '../../../ui/barraPestanas';
import { BotonFavorito } from '../../../ui/componentes/BotonFavorito';
import { Cristal } from '../../../ui/componentes/Cristal';
import { Fondo } from '../../../ui/componentes/Fondo';
import { colores, fuentes } from '../../../ui/tema';

export default function Inicio() {
  const insets = useSafeAreaInsets();
  const espacioBarra = useEspacioBarra();
  const uid = useUid();
  const favoritos = useAlmacen((s) => s.favoritos);
  const alternarFavorito = useAlmacen((s) => s.alternarFavorito);
  return (
    <Fondo>
      <ScrollView contentContainerStyle={[estilos.contenido, { paddingTop: insets.top + 24, paddingBottom: espacioBarra + 16 }]}>
        <Text style={estilos.titulo}>Calculadoras</Text>
        <View style={estilos.lista}>
          {catalogo.map((c) => (
            <Cristal key={c.id}>
              <View style={estilos.fila}>
                <Link href={{ pathname: '/calculadora/[id]', params: { id: c.id } }} asChild>
                  <Pressable accessibilityRole="button" style={estilos.tarjeta}>
                    <Text style={estilos.nombre}>{c.nombre}</Text>
                    <Text style={estilos.descripcion}>{c.descripcion}</Text>
                  </Pressable>
                </Link>
                <View style={estilos.estrella}>
                  <BotonFavorito
                    activo={favoritos.some((f) => f.calculadoraId === c.id && f.usuarioId === uid)}
                    onPress={() => alternarFavorito(c.id, uid)}
                  />
                </View>
              </View>
            </Cristal>
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
  fila: { flexDirection: 'row', alignItems: 'center' },
  tarjeta: { flex: 1, padding: 16, gap: 4 },
  estrella: { paddingRight: 16 },
  nombre: { fontFamily: fuentes.negrita, fontSize: 20, color: colores.textoPrincipal },
  descripcion: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoSobreCristal },
});
