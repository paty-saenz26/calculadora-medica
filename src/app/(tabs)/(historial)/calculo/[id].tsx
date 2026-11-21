// Detalle de un cálculo guardado (F05): valores, resultado, nota y eliminar.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { obtenerCalculadora } from '../../../../domain/calculadoras/catalogo';
import { describirValores, formatearFecha } from '../../../../domain/historial';
import { useAlmacen } from '../../../../state/instancias';
import { useEspacioBarra } from '../../../../ui/barraPestanas';
import { Cristal } from '../../../../ui/componentes/Cristal';
import { Encabezado } from '../../../../ui/componentes/Encabezado';
import { Fondo } from '../../../../ui/componentes/Fondo';
import { ModalCompartir } from '../../../../ui/componentes/ModalCompartir';
import { ModalNota } from '../../../../ui/componentes/ModalNota';
import { colores, fuentes, estilosTema } from '../../../../ui/tema';
import { useTema } from '../../../../ui/useTema';

export default function DetalleCalculo() {
  useTema();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const espacioBarra = useEspacioBarra();
  const calculo = useAlmacen((s) => s.calculos.find((c) => c.id === id));
  const editarNota = useAlmacen((s) => s.editarNota);
  const eliminar = useAlmacen((s) => s.eliminarCalculo);
  const [editando, setEditando] = useState(false);
  const [compartiendo, setCompartiendo] = useState(false);

  if (!calculo) {
    return (
      <Fondo>
        <Encabezado titulo="Detalle" atras />
        <View style={[estilos.contenido, { paddingTop: 16 }]}>
          <Text style={estilos.vacio}>Este cálculo ya no existe.</Text>
        </View>
      </Fondo>
    );
  }

  const calculadora = obtenerCalculadora(calculo.calculadoraId);
  const lineas = calculadora ? describirValores(calculadora, calculo) : [];

  const confirmarEliminar = () =>
    Alert.alert('¿Eliminar este cálculo?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          eliminar(calculo.id);
          router.back();
        },
      },
    ]);

  return (
    <Fondo>
      <Encabezado titulo="Detalle" atras />
      <ScrollView style={estilos.flex} contentContainerStyle={[estilos.contenido, { paddingTop: 16, paddingBottom: espacioBarra + 16 }]}>
        <View style={estilos.titulos}>
          <Text style={estilos.nombre}>{calculadora?.nombre ?? calculo.calculadoraId}</Text>
          <Text style={estilos.fecha}>{formatearFecha(calculo.fecha)}</Text>
        </View>

        <Cristal radio={28}>
          <View style={estilos.resultado}>
            <Text style={estilos.etiqueta}>Resultado</Text>
            <View style={estilos.filaValor}>
              <Text style={estilos.valor}>{calculo.resultado.valor}</Text>
              {calculo.resultado.unidad ? <Text style={estilos.unidad}>{calculo.resultado.unidad}</Text> : null}
            </View>
            {calculo.resultado.detalles?.map((d) => (
              <Text key={d.etiqueta} style={estilos.texto}>
                {d.etiqueta}: {d.valor} {d.unidad}
              </Text>
            ))}
            <Text style={estilos.texto}>{calculo.resultado.interpretacion}</Text>
          </View>
        </Cristal>

        <Cristal>
          <View style={estilos.bloque}>
            <Text style={estilos.etiqueta}>Valores</Text>
            {lineas.map((l) => (
              <View key={l.etiqueta} style={estilos.linea}>
                <Text style={estilos.lineaEtiqueta}>{l.etiqueta}</Text>
                <Text style={estilos.lineaTexto}>{l.texto}</Text>
              </View>
            ))}
          </View>
        </Cristal>

        <Cristal>
          <View style={estilos.bloque}>
            <Text style={estilos.etiqueta}>Nota</Text>
            <Text style={estilos.texto}>{calculo.nota ?? 'Sin nota'}</Text>
          </View>
        </Cristal>

        {calculadora ? <Text style={estilos.fuente}>Fuente: {calculadora.fuente}</Text> : null}

        <View style={estilos.botones}>
          {calculadora ? (
            <Pressable accessibilityRole="button" onPress={() => setCompartiendo(true)} style={estilos.primario}>
              <Text style={estilos.textoPrimario}>Compartir</Text>
            </Pressable>
          ) : null}
          <Pressable accessibilityRole="button" onPress={() => setEditando(true)} style={estilos.peligro}>
            <Text style={estilos.textoNeutro}>{calculo.nota ? 'Editar nota' : 'Agregar nota'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={confirmarEliminar} style={estilos.peligro}>
            <Text style={estilos.textoPeligro}>Eliminar</Text>
          </Pressable>
        </View>
      </ScrollView>

      {calculadora ? (
        <ModalCompartir
          visible={compartiendo}
          calculadora={calculadora}
          calculo={calculo}
          onCerrar={() => setCompartiendo(false)}
        />
      ) : null}

      <ModalNota
        visible={editando}
        notaInicial={calculo.nota}
        onCancelar={() => setEditando(false)}
        onGuardar={(texto) => {
          if (editarNota(calculo.id, texto).ok) setEditando(false);
        }}
      />
    </Fondo>
  );
}

const estilos = estilosTema(() => StyleSheet.create({
  flex: { flex: 1 },
  contenido: { paddingHorizontal: 16, gap: 14 },
  botonCircular: { width: 48, height: 48 },
  contenidoBoton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  vacio: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal, marginTop: 24 },
  titulos: { gap: 4 },
  nombre: { fontFamily: fuentes.negrita, fontSize: 32, lineHeight: 38, color: colores.textoPrincipal },
  fecha: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoSobreCristal },
  resultado: { padding: 20, gap: 6 },
  bloque: { padding: 16, gap: 8 },
  etiqueta: { fontFamily: fuentes.media, fontSize: 16, color: colores.textoSobreCristal },
  filaValor: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  valor: { fontFamily: fuentes.delgada, fontSize: 56, color: colores.textoPrincipal },
  unidad: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoSobreCristal, marginBottom: 10 },
  texto: { fontFamily: fuentes.normal, fontSize: 18, lineHeight: 26, color: colores.textoPrincipal },
  linea: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  lineaEtiqueta: { fontFamily: fuentes.normal, fontSize: 17, color: colores.textoSobreCristal, flexShrink: 1 },
  lineaTexto: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoPrincipal, flexShrink: 1, textAlign: 'right' },
  fuente: { fontFamily: fuentes.normal, fontSize: 16, lineHeight: 24, color: colores.textoPrincipal },
  botones: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  primario: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 999, backgroundColor: colores.primario },
  textoPrimario: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoSobrePrimario },
  peligro: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 999, backgroundColor: colores.chip },
  textoNeutro: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoPrincipal },
  textoPeligro: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.error },
}));
