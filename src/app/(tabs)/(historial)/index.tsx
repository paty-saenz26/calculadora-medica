// Historial: pantalla provisional hasta F05.
import { StyleSheet, Text, View } from 'react-native';

import { Fondo } from '../../../ui/componentes/Fondo';
import { colores, fuentes } from '../../../ui/tema';

export default function Historial() {
  return (
    <Fondo>
      <View style={estilos.centro}>
        <Text style={estilos.titulo}>Historial</Text>
        <Text style={estilos.texto}>Próximamente (F05)</Text>
      </View>
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  titulo: { fontFamily: fuentes.negrita, fontSize: 28, color: colores.textoPrincipal },
  texto: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoSobreCristal },
});
