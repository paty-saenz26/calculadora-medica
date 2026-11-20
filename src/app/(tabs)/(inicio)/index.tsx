// Inicio (F02): búsqueda en vivo y pestañas Recientes, Favoritas, Especialidades y Todas.
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { catalogo } from '../../../domain/calculadoras/catalogo';
import { buscarCalculadoras } from '../../../domain/busqueda';
import {
  agruparPorEspecialidad,
  derivarFavoritas,
  derivarRecientes,
  ordenAlfabetico,
} from '../../../domain/consultas';
import { delUsuario } from '../../../domain/historial';
import type { Calculadora } from '../../../domain/tipos';
import { useMisCalculos, useUid } from '../../../state/hooks';
import { useAlmacen } from '../../../state/instancias';
import { useEspacioBarra } from '../../../ui/barraPestanas';
import { Cristal } from '../../../ui/componentes/Cristal';
import { FilaCalculadora } from '../../../ui/componentes/FilaCalculadora';
import { Fondo } from '../../../ui/componentes/Fondo';
import { colores, fuentes } from '../../../ui/tema';

type Pestana = 'recientes' | 'favoritas' | 'especialidades' | 'todas';

const PESTANAS: { id: Pestana; titulo: string }[] = [
  { id: 'especialidades', titulo: 'Especialidades' },
  { id: 'recientes', titulo: 'Recientes' },
  { id: 'favoritas', titulo: 'Favoritas' },
  { id: 'todas', titulo: 'Todas' },
];

export default function Inicio() {
  const insets = useSafeAreaInsets();
  const espacioBarra = useEspacioBarra();
  const uid = useUid();
  const calculos = useMisCalculos();
  const todosFavoritos = useAlmacen((s) => s.favoritos);
  const alternarFavorito = useAlmacen((s) => s.alternarFavorito);

  const [texto, setTexto] = useState('');
  const [elegida, setElegida] = useState<Pestana>();
  const [especialidad, setEspecialidad] = useState<string>();

  const favoritos = useMemo(() => delUsuario(todosFavoritos, uid), [todosFavoritos, uid]);
  const recientes = useMemo(() => derivarRecientes(calculos, catalogo), [calculos]);
  const favoritas = useMemo(() => derivarFavoritas(favoritos, catalogo), [favoritos]);
  const grupos = useMemo(() => agruparPorEspecialidad(catalogo), []);
  const todas = useMemo(() => ordenAlfabetico(catalogo), []);

  // La pestaña inicial es Especialidades.
  const pestana: Pestana = elegida ?? 'especialidades';
  const buscando = texto.trim() !== '';
  const resultados = useMemo(() => (buscando ? buscarCalculadoras(catalogo, texto) : []), [buscando, texto]);

  const filas = (lista: Calculadora[]) =>
    lista.map((c) => (
      <FilaCalculadora
        key={c.id}
        calculadora={c}
        favorita={favoritos.some((f) => f.calculadoraId === c.id)}
        onFavorito={() => alternarFavorito(c.id, uid)}
      />
    ));

  const vacio = (mensaje: string, boton?: { titulo: string; onPress: () => void }) => (
    <View style={estilos.vacio}>
      <Text style={estilos.mensaje}>{mensaje}</Text>
      {boton ? (
        <Pressable accessibilityRole="button" onPress={boton.onPress} style={estilos.botonVacio}>
          <Text style={estilos.textoBotonVacio}>{boton.titulo}</Text>
        </Pressable>
      ) : null}
    </View>
  );

  let contenido;
  if (buscando) {
    contenido =
      resultados.length > 0
        ? filas(resultados)
        : vacio(`No encontramos calculadoras para «${texto.trim()}». Revisa la ortografía.`);
  } else if (pestana === 'recientes') {
    contenido =
      recientes.length > 0
        ? filas(recientes)
        : vacio('Aún no has calculado nada. Tus calculadoras recientes aparecerán aquí.', {
            titulo: 'Ver todas',
            onPress: () => setElegida('todas'),
          });
  } else if (pestana === 'favoritas') {
    contenido = favoritas.length > 0 ? filas(favoritas) : vacio('Toca la estrella de una calculadora para tenerla aquí.');
  } else if (pestana === 'especialidades') {
    const grupo = grupos.find((g) => g.especialidad === especialidad);
    contenido = grupo ? (
      <>
        <Pressable accessibilityRole="button" onPress={() => setEspecialidad(undefined)} style={estilos.volver}>
          <Ionicons name="chevron-back" size={20} color={colores.primario} />
          <Text style={estilos.textoVolver}>Especialidades</Text>
        </Pressable>
        <Text style={estilos.subtitulo}>{grupo.especialidad}</Text>
        {filas(grupo.calculadoras)}
      </>
    ) : (
      grupos.map((g) => (
        <Pressable key={g.especialidad} accessibilityRole="button" onPress={() => setEspecialidad(g.especialidad)}>
          <Cristal>
            <View style={estilos.filaGrupo}>
              <Text style={estilos.nombre}>{g.especialidad}</Text>
              <Text style={estilos.cuenta}>{g.calculadoras.length}</Text>
            </View>
          </Cristal>
        </Pressable>
      ))
    );
  } else {
    contenido = filas(todas);
  }

  return (
    <Fondo>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[estilos.contenido, { paddingTop: insets.top + 24, paddingBottom: espacioBarra + 16 }]}
      >
        <Text style={estilos.titulo}>Calculadoras</Text>

        <Cristal radio={999}>
          <View style={estilos.busqueda}>
            <Ionicons name="search" size={22} color={colores.textoSobreCristal} />
            <TextInput
              accessibilityLabel="Buscar calculadora"
              value={texto}
              onChangeText={setTexto}
              placeholder="Buscar por nombre o siglas"
              placeholderTextColor={colores.textoSobreCristal}
              autoCorrect={false}
              autoCapitalize="none"
              style={estilos.entrada}
            />
            {texto !== '' ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Borrar búsqueda" onPress={() => setTexto('')} hitSlop={10}>
                <Ionicons name="close-circle" size={22} color={colores.textoSobreCristal} />
              </Pressable>
            ) : null}
          </View>
        </Cristal>

        {!buscando ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.pestanas}>
            {PESTANAS.map((p) => {
              const activa = p.id === pestana;
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activa }}
                  onPress={() => {
                    setElegida(p.id);
                    setEspecialidad(undefined);
                  }}
                  style={[estilos.pestana, activa && estilos.pestanaActiva]}
                >
                  <Text style={[estilos.textoPestana, activa && estilos.textoPestanaActiva]}>{p.titulo}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}

        <View style={estilos.lista}>{contenido}</View>
      </ScrollView>
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: 16, gap: 14 },
  titulo: { fontFamily: fuentes.negrita, fontSize: 32, color: colores.textoPrincipal },
  busqueda: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, minHeight: 52 },
  entrada: { flex: 1, fontFamily: fuentes.normal, fontSize: 18, color: colores.textoPrincipal, paddingVertical: 12 },
  pestanas: { gap: 8 },
  pestana: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: colores.chip },
  pestanaActiva: { backgroundColor: colores.primario },
  textoPestana: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoPrincipal },
  textoPestanaActiva: { color: colores.textoSobrePrimario },
  lista: { gap: 12 },
  nombre: { fontFamily: fuentes.negrita, fontSize: 20, color: colores.textoPrincipal },
  filaGrupo: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cuenta: { fontFamily: fuentes.seminegrita, fontSize: 18, color: colores.textoSobreCristal },
  volver: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  textoVolver: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.primario },
  subtitulo: { fontFamily: fuentes.negrita, fontSize: 24, color: colores.textoPrincipal },
  vacio: { alignItems: 'center', gap: 12, marginTop: 40 },
  mensaje: { fontFamily: fuentes.media, fontSize: 18, lineHeight: 26, color: colores.textoPrincipal, textAlign: 'center' },
  botonVacio: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999, backgroundColor: colores.primario },
  textoBotonVacio: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoSobrePrimario },
});
