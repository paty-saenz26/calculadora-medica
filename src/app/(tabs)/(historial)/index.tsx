// Historial (F05): lista paginada de 20 en 20, con scroll infinito, jalar para actualizar y estados vacío / error.
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { obtenerCalculadora } from '../../../domain/calculadoras/catalogo';
import { formatearFecha, ordenarPorFecha, paginar, type CalculoGuardado } from '../../../domain/historial';
import { useMisCalculos } from '../../../state/hooks';
import { useAlmacen } from '../../../state/instancias';
import { useEspacioBarra } from '../../../ui/barraPestanas';
import { Cristal } from '../../../ui/componentes/Cristal';
import { Fondo } from '../../../ui/componentes/Fondo';
import { colores, fuentes } from '../../../ui/tema';

export default function Historial() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const espacioBarra = useEspacioBarra();
  const calculos = useMisCalculos();
  const [pagina, setPagina] = useState(1);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState(false);

  const ordenados = useMemo(() => ordenarPorFecha(calculos), [calculos]);
  const { items, hayMas } = paginar(ordenados, pagina);

  // Jalar para actualizar: vuelve a leer el almacenamiento del dispositivo.
  const actualizar = useCallback(async () => {
    setActualizando(true);
    setError(false);
    try {
      await useAlmacen.persist.rehydrate();
      setPagina(1);
    } catch {
      setError(true);
    } finally {
      setActualizando(false);
    }
  }, []);

  const fila = ({ item }: { item: CalculoGuardado }) => {
    const calc = obtenerCalculadora(item.calculadoraId);
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/calculo/[id]', params: { id: item.id } })}
      >
        <Cristal>
          <View style={estilos.fila}>
            <View style={estilos.textos}>
              <Text style={estilos.nombre}>{calc?.nombre ?? item.calculadoraId}</Text>
              <Text style={estilos.fecha}>{formatearFecha(item.fecha)}</Text>
              {item.nota ? (
                <Text style={estilos.nota} numberOfLines={1}>
                  {item.nota}
                </Text>
              ) : null}
            </View>
            <View style={estilos.resultado}>
              <Text style={estilos.valor}>{item.resultado.valor}</Text>
              {item.resultado.unidad ? <Text style={estilos.unidad}>{item.resultado.unidad}</Text> : null}
            </View>
          </View>
        </Cristal>
      </Pressable>
    );
  };

  return (
    <Fondo>
      <FlatList
        data={items}
        keyExtractor={(c) => c.id}
        renderItem={fila}
        ItemSeparatorComponent={() => <View style={estilos.separador} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => hayMas && setPagina((p) => p + 1)}
        refreshControl={<RefreshControl refreshing={actualizando} onRefresh={actualizar} tintColor={colores.primario} />}
        // iOS: el margen superior va como inset para que el circulito de recarga salga debajo de la barra de estado.
        contentInset={Platform.OS === 'ios' ? { top: insets.top + 24 } : undefined}
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: -(insets.top + 24) } : undefined}
        contentContainerStyle={[
          estilos.contenido,
          { paddingTop: Platform.OS === 'ios' ? 0 : insets.top + 24, paddingBottom: espacioBarra + 16 },
        ]}
        ListHeaderComponent={<Text style={estilos.titulo}>Historial</Text>}
        ListEmptyComponent={
          error ? (
            <View style={estilos.vacio}>
              <Text style={estilos.mensaje}>No se pudo cargar el historial.</Text>
              <Pressable accessibilityRole="button" onPress={actualizar} style={estilos.reintentar}>
                <Text style={estilos.textoReintentar}>Reintentar</Text>
              </Pressable>
            </View>
          ) : (
            <View style={estilos.vacio}>
              <Text style={estilos.mensaje}>Aún no tienes cálculos guardados.</Text>
              <Text style={estilos.submensaje}>Usa una calculadora y aparecerá aquí al salir de ella.</Text>
            </View>
          )
        }
      />
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: 16, flexGrow: 1 },
  titulo: { fontFamily: fuentes.negrita, fontSize: 32, color: colores.textoPrincipal, marginBottom: 16 },
  separador: { height: 12 },
  fila: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  textos: { flexShrink: 1, gap: 2 },
  nombre: { fontFamily: fuentes.negrita, fontSize: 20, color: colores.textoPrincipal },
  fecha: { fontFamily: fuentes.normal, fontSize: 16, color: colores.textoSobreCristal },
  nota: { fontFamily: fuentes.normal, fontSize: 16, color: colores.textoPrincipal, fontStyle: 'italic' },
  resultado: { alignItems: 'flex-end' },
  valor: { fontFamily: fuentes.delgada, fontSize: 32, color: colores.textoPrincipal },
  unidad: { fontFamily: fuentes.normal, fontSize: 14, color: colores.textoSobreCristal },
  vacio: { alignItems: 'center', gap: 8, marginTop: 60 },
  mensaje: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal, textAlign: 'center' },
  submensaje: { fontFamily: fuentes.normal, fontSize: 16, color: colores.textoSobreCristal, textAlign: 'center' },
  reintentar: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, backgroundColor: colores.primario },
  textoReintentar: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoSobrePrimario },
});
