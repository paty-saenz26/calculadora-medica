import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { limpiarTecleo } from '../../domain/unidades';
import type { CampoNumero } from '../../domain/tipos';
import { colores, fuentes } from '../tema';
import { Cristal } from './Cristal';

type Props = {
  campo: CampoNumero;
  texto: string;
  unidadId: string;
  /** Mensaje bajo el campo (error de rango o de regla), ya decidido por la pantalla (D12). */
  error?: string;
  onCambiarTexto: (texto: string) => void;
  /** Se dispara al terminar de editar (D12). */
  onTerminar: () => void;
  onCambiarUnidad: (unidadId: string) => void;
};

export function CampoNumeroUI({
  campo,
  texto,
  unidadId,
  error,
  onCambiarTexto,
  onTerminar,
  onCambiarUnidad,
}: Props) {
  const [enfocado, setEnfocado] = useState(false);
  const unidad = campo.unidades.find((u) => u.id === unidadId) ?? campo.unidades[0];
  const hayVarias = campo.unidades.length > 1;

  const siguienteUnidad = () => {
    const indice = campo.unidades.findIndex((u) => u.id === unidad.id);
    onCambiarUnidad(campo.unidades[(indice + 1) % campo.unidades.length].id);
  };

  return (
    <View>
      <Cristal bordeColor={error ? colores.error : enfocado ? colores.primario : undefined}>
        <View style={estilos.contenido}>
          <View style={estilos.fila}>
            <Text style={estilos.etiqueta}>{campo.etiqueta}</Text>
            {campo.pista ? <Text style={estilos.pista}>{campo.pista}</Text> : null}
          </View>
          <View style={estilos.filaEntrada}>
            <TextInput
              accessibilityLabel={campo.etiqueta}
              value={texto}
              onChangeText={(t) => onCambiarTexto(limpiarTecleo(t, campo.entero))}
              onFocus={() => setEnfocado(true)}
              onBlur={() => {
                setEnfocado(false);
                onTerminar();
              }}
              keyboardType={campo.entero ? 'number-pad' : 'decimal-pad'}
              placeholder="0"
              placeholderTextColor={colores.acento}
              style={estilos.entrada}
            />
            {hayVarias ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Cambiar unidad, ahora ${unidad.etiqueta}`}
                onPress={siguienteUnidad}
                style={estilos.botonUnidad}
              >
                <Text style={estilos.unidad}>{unidad.etiqueta}</Text>
                <Ionicons name="swap-horizontal" size={20} color={colores.textoPrincipal} />
              </Pressable>
            ) : (
              <Text style={estilos.unidad}>{unidad.etiqueta}</Text>
            )}
          </View>
        </View>
      </Cristal>
      {error ? (
        <View style={estilos.filaError}>
          <Ionicons name="alert-circle" size={18} color={colores.error} />
          <Text style={estilos.error}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 16, gap: 2 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  etiqueta: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal, flexShrink: 1 },
  pista: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoSobreCristal },
  filaEntrada: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  entrada: {
    flex: 1,
    minWidth: 0,
    height: 60,
    padding: 0,
    fontFamily: fuentes.delgada,
    fontSize: 44,
    color: colores.textoPrincipal,
  },
  botonUnidad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colores.chip,
  },
  unidad: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoPrincipal },
  filaError: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, paddingHorizontal: 8 },
  error: { fontFamily: fuentes.media, fontSize: 18, color: colores.error, flexShrink: 1 },
});
