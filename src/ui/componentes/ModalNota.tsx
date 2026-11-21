import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { LIMITE_NOTA, validarNota } from '../../domain/historial';
import { colores, fuentes } from '../tema';
import { Cristal } from './Cristal';

type Props = {
  visible: boolean;
  notaInicial?: string;
  onCancelar: () => void;
  onGuardar: (texto: string) => void;
};

/** Modal para agregar, editar o quitar la nota de un cálculo (F05, R9). */
export function ModalNota({ visible, notaInicial, onCancelar, onGuardar }: Props) {
  const [texto, setTexto] = useState(notaInicial ?? '');
  useEffect(() => {
    if (visible) setTexto(notaInicial ?? '');
  }, [visible, notaInicial]);

  const validacion = validarNota(texto);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={estilos.fondo}>
        <View style={estilos.tarjeta}>
          <Cristal>
            <View style={estilos.contenido}>
              <Text style={estilos.titulo}>Nota</Text>
              <Text style={estilos.aviso}>No escribas nombres ni datos de pacientes.</Text>
              <TextInput
                accessibilityLabel="Nota"
                value={texto}
                onChangeText={setTexto}
                multiline
                maxLength={LIMITE_NOTA}
                placeholder="Escribe una nota"
                placeholderTextColor={colores.textoSobreCristal}
                style={estilos.entrada}
              />
              <Text style={estilos.contador}>
                {texto.length}/{LIMITE_NOTA}
              </Text>
              {!validacion.ok ? <Text style={estilos.error}>{validacion.mensaje}</Text> : null}
              {notaInicial ? (
                <Pressable accessibilityRole="button" onPress={() => onGuardar('')} style={estilos.quitar}>
                  <Text style={estilos.textoQuitar}>Quitar nota</Text>
                </Pressable>
              ) : null}
              <View style={estilos.botones}>
                <Pressable accessibilityRole="button" onPress={onCancelar} style={estilos.secundario}>
                  <Text style={estilos.textoSecundario}>Cancelar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={!validacion.ok}
                  onPress={() => onGuardar(texto)}
                  style={[estilos.primario, !validacion.ok && estilos.desactivado]}
                >
                  <Text style={estilos.textoPrimario}>Guardar</Text>
                </Pressable>
              </View>
            </View>
          </Cristal>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(40,76,59,0.35)', justifyContent: 'center', padding: 16 },
  tarjeta: { backgroundColor: colores.fondoSuave2, borderRadius: 24 },
  contenido: { padding: 20, gap: 10 },
  titulo: { fontFamily: fuentes.negrita, fontSize: 24, color: colores.textoPrincipal },
  aviso: { fontFamily: fuentes.normal, fontSize: 16, color: colores.textoSobreCristal },
  entrada: {
    minHeight: 96,
    textAlignVertical: 'top',
    fontFamily: fuentes.normal,
    fontSize: 18,
    color: colores.textoPrincipal,
    backgroundColor: colores.fondo,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  contador: { fontFamily: fuentes.normal, fontSize: 14, color: colores.textoSobreCristal, textAlign: 'right' },
  error: { fontFamily: fuentes.media, fontSize: 16, color: colores.error },
  botones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  secundario: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, backgroundColor: colores.chip },
  textoSecundario: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoPrincipal },
  primario: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, backgroundColor: colores.primario },
  textoPrimario: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.textoSobrePrimario },
  quitar: { alignSelf: 'flex-start', paddingVertical: 6 },
  textoQuitar: { fontFamily: fuentes.seminegrita, fontSize: 16, color: colores.error },
  desactivado: { opacity: 0.45 },
});
