import { useState } from 'react';
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { publicarResultado } from '../../data/compartidos';
import {
  cargaResultado,
  construirMensajeEnlace,
  construirTextoCompartir,
  generarIdCorto,
  urlCorta,
} from '../../domain/compartir';
import type { CalculoGuardado } from '../../domain/historial';
import type { Calculadora } from '../../domain/tipos';
import { colores, fuentes } from '../tema';

type Props = { visible: boolean; calculadora: Calculadora; calculo: CalculoGuardado; onCerrar: () => void };

/**
 * Modal de compartir (F06): "Compartir con tarjeta" (principal) manda el resultado y el enlace de la calculadora,
 * que las apps de mensajes muestran como tarjeta con imagen; "Compartir texto" manda el resumen completo.
 */
export function ModalCompartir({ visible, calculadora, calculo, onCerrar }: Props) {
  const [error, setError] = useState<string>();
  const [ocupado, setOcupado] = useState(false);
  const mensaje = construirMensajeEnlace(calculadora, calculo, urlCorta(calculadora.id, 'xxxxxxxx'));

  const compartir = async (texto: string) => {
    setError(undefined);
    try {
      await Share.share({ message: texto }); // cancelar el menú no es un error
    } catch {
      setError('No pudimos abrir el menú de compartir. Intenta de nuevo');
    }
  };

  /** Guarda el resultado y comparte un enlace corto; sin conexión comparte el enlace largo. */
  const compartirConTarjeta = async () => {
    setOcupado(true);
    const id = generarIdCorto();
    const guardado = await publicarResultado(id, cargaResultado(calculadora, calculo));
    setOcupado(false);
    await compartir(construirMensajeEnlace(calculadora, calculo, guardado ? urlCorta(calculadora.id, id) : undefined));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.panel}>
          <Text style={estilos.titulo}>Compartir resultado</Text>

          <View style={estilos.tarjeta}>
            <View style={estilos.banda}>
              <Text style={estilos.etiqueta}>HERRAMIENTA CLÍNICA</Text>
              <Text style={estilos.nombre}>{calculadora.nombre}</Text>
            </View>
            <View style={estilos.cuerpo}>
              <Text style={estilos.descripcion}>{calculadora.descripcion}</Text>
              <Text style={estilos.dominio}>calculadora-medica</Text>
            </View>
          </View>

          <ScrollView style={estilos.mensaje}>
            <Text style={estilos.textoMensaje} selectable>
              {mensaje}
            </Text>
          </ScrollView>

          <Text style={estilos.aviso}>No incluye notas ni datos personales.</Text>
          {error ? <Text style={estilos.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={ocupado}
            onPress={compartirConTarjeta}
            style={[estilos.primario, ocupado && estilos.desactivado]}
          >
            <Text style={estilos.textoPrimario}>{ocupado ? 'Preparando…' : 'Compartir con tarjeta'}</Text>
          </Pressable>
          <View style={estilos.fila}>
            <Pressable
              accessibilityRole="button"
              onPress={() => compartir(construirTextoCompartir(calculadora, calculo))}
              style={estilos.secundario}
            >
              <Text style={estilos.textoSecundario}>Compartir texto</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onCerrar} style={estilos.secundario}>
              <Text style={estilos.textoSecundario}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(40,76,59,0.55)', justifyContent: 'center', padding: 16 },
  panel: { backgroundColor: colores.fondo, borderRadius: 24, padding: 18, gap: 10, maxHeight: '92%' },
  titulo: { fontFamily: fuentes.negrita, fontSize: 22, color: colores.textoPrincipal },
  tarjeta: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colores.borde },
  banda: { backgroundColor: colores.textoPrincipal, padding: 16, gap: 6 },
  etiqueta: { fontFamily: fuentes.seminegrita, fontSize: 11, letterSpacing: 2, color: colores.acento },
  nombre: { fontFamily: fuentes.negrita, fontSize: 22, color: colores.textoSobrePrimario },
  cuerpo: { padding: 14, gap: 4, backgroundColor: colores.fondoSuave2 },
  descripcion: { fontFamily: fuentes.normal, fontSize: 15, color: colores.textoPrincipal },
  dominio: { fontFamily: fuentes.normal, fontSize: 13, color: colores.textoSobreCristal },
  mensaje: { maxHeight: 90, backgroundColor: colores.fondoSuave, borderRadius: 12, padding: 12 },
  textoMensaje: { fontFamily: fuentes.normal, fontSize: 15, lineHeight: 22, color: colores.textoPrincipal },
  aviso: { fontFamily: fuentes.normal, fontSize: 14, color: colores.textoSobreCristal, textAlign: 'center' },
  error: { fontFamily: fuentes.media, fontSize: 16, color: colores.error },
  primario: { paddingVertical: 15, borderRadius: 999, backgroundColor: colores.primario, alignItems: 'center' },
  textoPrimario: { fontFamily: fuentes.seminegrita, fontSize: 18, color: colores.textoSobrePrimario },
  desactivado: { opacity: 0.55 },
  fila: { flexDirection: 'row', gap: 10 },
  secundario: { flex: 1, paddingVertical: 13, borderRadius: 999, backgroundColor: colores.chip, alignItems: 'center' },
  textoSecundario: { fontFamily: fuentes.seminegrita, fontSize: 16, color: colores.textoPrincipal },
});
