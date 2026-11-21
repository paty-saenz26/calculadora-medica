import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colores, fuentes, estilosTema } from '../tema';
import { useTema } from '../useTema';
import { Cristal } from './Cristal';

type Props = Pick<TextInputProps, 'keyboardType' | 'autoCapitalize' | 'secureTextEntry' | 'textContentType' | 'autoComplete'> & {
  etiqueta: string;
  valor: string;
  error?: string;
  onCambiar: (texto: string) => void;
  onTerminar: () => void;
};

/** Campo de texto con etiqueta y error debajo (D12: el error aparece al salir del campo). */
export function CampoTexto({ etiqueta, valor, error, onCambiar, onTerminar, ...resto }: Props) {
  useTema();
  return (
    <View style={estilos.contenedor}>
      <Cristal bordeColor={error ? colores.error : undefined}>
        <View style={estilos.contenido}>
          <Text style={estilos.etiqueta}>{etiqueta}</Text>
          <TextInput
            accessibilityLabel={etiqueta}
            value={valor}
            onChangeText={onCambiar}
            onBlur={onTerminar}
            style={estilos.entrada}
            placeholderTextColor={colores.textoSobreCristal}
            {...resto}
          />
        </View>
      </Cristal>
      {error ? <Text style={estilos.error}>{error}</Text> : null}
    </View>
  );
}

const estilos = estilosTema(() => StyleSheet.create({
  contenedor: { gap: 6 },
  contenido: { paddingHorizontal: 16, paddingVertical: 12 },
  etiqueta: { fontFamily: fuentes.media, fontSize: 16, color: colores.textoSobreCristal },
  entrada: { fontFamily: fuentes.normal, fontSize: 20, color: colores.textoPrincipal, paddingVertical: 4 },
  error: { fontFamily: fuentes.media, fontSize: 16, color: colores.error, paddingHorizontal: 8 },
}));
