import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Calculadora } from '../../domain/tipos';
import { colores, fuentes, estilosTema } from '../tema';
import { useTema } from '../useTema';
import { BotonFavorito } from './BotonFavorito';
import { Cristal } from './Cristal';

type Props = { calculadora: Calculadora; favorita: boolean; onFavorito: () => void };

/** Fila del catálogo: nombre, descripción corta y estrella (F02). Tocarla abre la calculadora. */
export function FilaCalculadora({ calculadora, favorita, onFavorito }: Props) {
  useTema();
  return (
    <Cristal>
      <View style={estilos.fila}>
        <Link href={{ pathname: '/calculadora/[id]', params: { id: calculadora.id } }} asChild>
          <Pressable accessibilityRole="button" style={estilos.tarjeta}>
            <Text style={estilos.nombre}>{calculadora.nombre}</Text>
            <Text style={estilos.descripcion}>{calculadora.descripcion}</Text>
          </Pressable>
        </Link>
        <View style={estilos.estrella}>
          <BotonFavorito activo={favorita} onPress={onFavorito} />
        </View>
      </View>
    </Cristal>
  );
}

const estilos = estilosTema(() => StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center' },
  tarjeta: { flex: 1, padding: 16, gap: 4 },
  estrella: { paddingRight: 16 },
  nombre: { fontFamily: fuentes.negrita, fontSize: 20, color: colores.textoPrincipal },
  descripcion: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoSobreCristal },
}));
