// Pantalla temporal de H0: sirve para comprobar el tema y la fuente.
import { StyleSheet, Text, View } from 'react-native';

import { colores, fuentes } from '../ui/tema';

export default function Inicio() {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.nombre}>Presión arterial media</Text>
      <Text style={estilos.numero}>93</Text>
      <Text style={estilos.etiqueta}>mm Hg</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.fondo,
    gap: 8,
  },
  nombre: { fontFamily: fuentes.negrita, fontSize: 28, color: colores.textoPrincipal },
  numero: { fontFamily: fuentes.delgada, fontSize: 64, color: colores.textoPrincipal },
  etiqueta: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoSecundario },
});
