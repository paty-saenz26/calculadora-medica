import { useState } from 'react';
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { colores, fuentes } from '../tema';
import { Cristal } from './Cristal';

type Props = { visible: boolean; texto: string; onCerrar: () => void };

/** Modal de compartir (F06): vista previa del texto y menú de compartir del sistema. */
export function ModalCompartir({ visible, texto, onCerrar }: Props) {
  const [error, setError] = useState<string>();

  const compartir = async () => {
    setError(undefined);
    try {
      await Share.share({ message: texto }); // cancelar el menú no es un error
    } catch {
      setError('No pudimos abrir el menú de compartir. Intenta de nuevo');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.tarjeta}>
          <Cristal>
            <View style={estilos.contenido}>
              <Text style={estilos.titulo}>Compartir resultado</Text>
              <ScrollView style={estilos.vista}>
                <Text style={estilos.texto} selectable>
                  {texto}
                </Text>
              </ScrollView>
              <Text style={estilos.aviso}>No incluye notas ni datos personales.</Text>
              {error ? <Text style={estilos.error}>{error}</Text> : null}
              <View style={estilos.botones}>
                <Pressable accessibilityRole="button" onPress={onCerrar} style={estilos.secundario}>
                  <Text style={estilos.textoSecundario}>Cerrar</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={compartir} style={estilos.primario}>
                  <Text style={estilos.textoPrimario}>Compartir texto</Text>
                </Pressable>
              </View>
            </View>
          </Cristal>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(40,76,59,0.35)', justifyContent: 'center', padding: 16 },
  tarjeta: { backgroundColor: colores.fondoSuave2, borderRadius: 24 },
  contenido: { padding: 20, gap: 10 },
  titulo: { fontFamily: fuentes.negrita, fontSize: 24, color: colores.textoPrincipal },
  vista: { maxHeight: 340, backgroundColor: colores.fondo, borderRadius: 16, padding: 14 },
  texto: { fontFamily: fuentes.normal, fontSize: 17, lineHeight: 25, color: colores.textoPrincipal },
  aviso: { fontFamily: fuentes.normal, fontSize: 15, color: colores.textoSobreCristal },
  error: { fontFamily: fuentes.media, fontSize: 16, color: colores.error },
  botones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
  secundario: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, backgroundColor: colores.chip },
  textoSecundario: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoPrincipal },
  primario: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, backgroundColor: colores.primario },
  textoPrimario: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoSobrePrimario },
});
