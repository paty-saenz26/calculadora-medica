// Historial (F05): lista paginada de 20 en 20, con scroll infinito, jalar para actualizar y estados vacío / error.
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { obtenerCalculadora } from '../../../domain/calculadoras/catalogo';
import { formatearFecha, ordenarPorFecha, paginar, type CalculoGuardado } from '../../../domain/historial';
import { useMisCalculos } from '../../../state/hooks';
import { useAlmacen } from '../../../state/instancias';
import { useEspacioBarra } from '../../../ui/barraPestanas';
import { Cristal } from '../../../ui/componentes/Cristal';
import { FilaDeslizable } from '../../../ui/componentes/FilaDeslizable';
import { Encabezado } from '../../../ui/componentes/Encabezado';
import { Fondo } from '../../../ui/componentes/Fondo';
import { colores, fuentes, estilosTema } from '../../../ui/tema';
import { useTema } from '../../../ui/useTema';

export default function Historial() {
  useTema();
  const router = useRouter();
  const espacioBarra = useEspacioBarra();
  const calculos = useMisCalculos();
  const [pagina, setPagina] = useState(1);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState(false);
  const eliminarCalculos = useAlmacen((s) => s.eliminarCalculos);
  const eliminarCalculo = useAlmacen((s) => s.eliminarCalculo);
  const [seleccionando, setSeleccionando] = useState(false);
  const [elegidos, setElegidos] = useState<string[]>([]);

  const salirDeSeleccion = () => {
    setSeleccionando(false);
    setElegidos([]);
  };
  const alternar = (id: string) =>
    setElegidos((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

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

  const todosElegidos = elegidos.length === ordenados.length && ordenados.length > 0;
  const confirmarEliminar = () => {
    const n = elegidos.length;
    if (n === 0) return;
    Alert.alert(
      n === ordenados.length ? 'Eliminar todo el historial' : `Eliminar ${n} cálculo${n === 1 ? '' : 's'}`,
      'Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarCalculos(elegidos);
            salirDeSeleccion();
          },
        },
      ],
    );
  };

  const fila = ({ item }: { item: CalculoGuardado }) => {
    const calc = obtenerCalculadora(item.calculadoraId);
    const marcado = elegidos.includes(item.id);
    const tarjeta = (
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          seleccionando ? alternar(item.id) : router.push({ pathname: '/calculo/[id]', params: { id: item.id } })
        }
      >
        <Cristal>
          <View style={estilos.fila}>
            {seleccionando ? (
              <Ionicons
                name={marcado ? 'checkmark-circle' : 'ellipse-outline'}
                size={26}
                color={marcado ? colores.primario : colores.textoSobreCristal}
              />
            ) : null}
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
    return (
      <FilaDeslizable desactivado={seleccionando} onEliminar={() => eliminarCalculo(item.id)}>
        {tarjeta}
      </FilaDeslizable>
    );
  };

  return (
    <Fondo>
      <Encabezado titulo="Historial" />
      <FlatList
        data={items}
        extraData={[seleccionando, elegidos]}
        keyExtractor={(c) => c.id}
        renderItem={fila}
        ItemSeparatorComponent={() => <View style={estilos.separador} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => hayMas && setPagina((p) => p + 1)}
        refreshControl={<RefreshControl refreshing={actualizando} onRefresh={actualizar} tintColor={colores.primario} />}
        contentContainerStyle={[estilos.contenido, { paddingTop: 16, paddingBottom: espacioBarra + 16 }]}
        ListHeaderComponent={
          <View style={estilos.encabezado}>
            <View style={estilos.tituloFila}>
              {ordenados.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={seleccionando ? salirDeSeleccion : () => setSeleccionando(true)}
                  hitSlop={10}
                >
                  <Text style={estilos.accionTexto}>{seleccionando ? 'Cancelar' : 'Seleccionar'}</Text>
                </Pressable>
              ) : null}
            </View>
            {seleccionando ? (
              <View style={estilos.acciones}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setElegidos(todosElegidos ? [] : ordenados.map((c) => c.id))}
                  style={estilos.chip}
                >
                  <Text style={estilos.chipTexto}>{todosElegidos ? 'Ninguno' : 'Todos'}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={elegidos.length === 0}
                  onPress={confirmarEliminar}
                  style={[estilos.chipEliminar, elegidos.length === 0 && estilos.desactivado]}
                >
                  <Text style={estilos.chipEliminarTexto}>
                    {elegidos.length > 0 ? `Eliminar (${elegidos.length})` : 'Eliminar'}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
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

const estilos = estilosTema(() => StyleSheet.create({
  contenido: { paddingHorizontal: 16, flexGrow: 1 },
  encabezado: { marginBottom: 16, gap: 12 },
  tituloFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  accionTexto: { fontFamily: fuentes.seminegrita, fontSize: 18, color: colores.primario },
  acciones: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: colores.chip },
  chipTexto: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoPrincipal },
  chipEliminar: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: colores.peligro },
  chipEliminarTexto: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoSobrePeligro },
  desactivado: { opacity: 0.45 },
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
}));
