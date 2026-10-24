import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CampoOpcion } from '../../domain/tipos';
import { colores, fuentes } from '../tema';
import { Cristal } from './Cristal';

type Props = {
  campo: CampoOpcion;
  valor?: string;
  onCambiar: (valor: string) => void;
};

export function CampoOpcionUI({ campo, valor, onCambiar }: Props) {
  return (
    <Cristal>
      <View style={estilos.contenido}>
        <Text style={estilos.etiqueta}>{campo.etiqueta}</Text>
        <View style={estilos.opciones}>
          {campo.opciones.map((o) => {
            const activa = o.valor === valor;
            return (
              <Pressable
                key={o.valor}
                accessibilityRole="radio"
                accessibilityState={{ selected: activa }}
                onPress={() => onCambiar(o.valor)}
                style={[estilos.opcion, activa && estilos.opcionActiva]}
              >
                <Text style={[estilos.texto, activa && estilos.textoActivo]}>{o.etiqueta}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Cristal>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 16, gap: 10 },
  etiqueta: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal },
  opciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcion: {
    minHeight: 52,
    minWidth: 100,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.chip,
  },
  opcionActiva: { backgroundColor: colores.primario },
  texto: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal },
  textoActivo: { color: colores.textoSobrePrimario },
});
