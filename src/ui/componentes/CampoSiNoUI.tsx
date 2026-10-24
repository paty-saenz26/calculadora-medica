import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CampoSiNo } from '../../domain/tipos';
import { colores, fuentes } from '../tema';
import { Cristal } from './Cristal';

type Props = {
  campo: CampoSiNo;
  valor?: boolean;
  onCambiar: (valor: boolean) => void;
};

export function CampoSiNoUI({ campo, valor, onCambiar }: Props) {
  const boton = (activa: boolean, etiqueta: string, nuevo: boolean) => (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: activa }}
      onPress={() => onCambiar(nuevo)}
      style={[estilos.opcion, activa && estilos.opcionActiva]}
    >
      <Text style={[estilos.texto, activa && estilos.textoActivo]}>{etiqueta}</Text>
    </Pressable>
  );

  return (
    <Cristal>
      <View style={estilos.contenido}>
        <Text style={estilos.etiqueta}>{campo.etiqueta}</Text>
        <View style={estilos.opciones}>
          {boton(valor === false, 'No', false)}
          {boton(valor === true, 'Sí', true)}
        </View>
      </View>
    </Cristal>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  etiqueta: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal, flexShrink: 1 },
  opciones: { flexDirection: 'row', gap: 8 },
  opcion: {
    minHeight: 52,
    minWidth: 72,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.chip,
  },
  opcionActiva: { backgroundColor: colores.primario },
  texto: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal },
  textoActivo: { color: colores.textoSobrePrimario },
});
