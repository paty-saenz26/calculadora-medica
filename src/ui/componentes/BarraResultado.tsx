import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { EstadoCalculadora } from '../../domain/motor';
import { colores, fuentes, radios } from '../tema';
import { Cristal } from './Cristal';

type Props = {
  estado: EstadoCalculadora;
  /** Versión de una sola línea, para cuando el teclado está abierto y el espacio es poco. */
  compacta?: boolean;
};

/** Barra fija con tres estados: faltantes, por corregir y resultado (F03, D11). */
export function BarraResultado({ estado, compacta = false }: Props) {
  const { faltantes, errores, reglas, resultado } = estado;
  const hayProblemas = Object.keys(errores).length > 0 || reglas.length > 0;

  return (
    <Cristal radio={compacta ? 24 : radios.resultado}>
      <View
        style={compacta ? estilos.contenidoCompacto : estilos.contenido}
        accessibilityLiveRegion="polite"
      >
        {resultado ? (
          compacta ? (
            <>
              <Text style={estilos.titulo}>Resultado</Text>
              <View style={estilos.filaValor}>
                <Text style={estilos.valorCompacto}>{resultado.valor}</Text>
                {resultado.unidad ? <Text style={estilos.unidad}>{resultado.unidad}</Text> : null}
              </View>
              {resultado.detalles?.map((d) => (
                <Text key={d.etiqueta} style={estilos.detalle}>
                  {d.etiqueta}: {d.valor} {d.unidad}
                </Text>
              ))}
            </>
          ) : (
            <>
              <Text style={estilos.titulo}>Resultado</Text>
              <View style={estilos.filaValor}>
                <Text style={estilos.valor}>{resultado.valor}</Text>
                {resultado.unidad ? <Text style={estilos.unidad}>{resultado.unidad}</Text> : null}
              </View>
              {resultado.detalles?.map((d) => (
                <Text key={d.etiqueta} style={estilos.detalle}>
                  {d.etiqueta}: {d.valor} {d.unidad}
                </Text>
              ))}
              <Text style={estilos.interpretacion}>{resultado.interpretacion}</Text>
            </>
          )
        ) : faltantes.length > 0 ? (
          <>
            {compacta ? null : <Text style={estilos.titulo}>Resultado</Text>}
            <Text style={estilos.mensaje} numberOfLines={compacta ? 1 : undefined}>
              Falta: {faltantes.join(', ')}
            </Text>
          </>
        ) : hayProblemas ? (
          <View style={estilos.filaAviso}>
            <Ionicons name="alert-circle" size={22} color={colores.error} />
            <Text style={estilos.mensaje} numberOfLines={compacta ? 1 : undefined}>
              Corrige los valores para ver el resultado
            </Text>
          </View>
        ) : null}
      </View>
    </Cristal>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 16, gap: 6 },
  contenidoCompacto: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 56, justifyContent: 'center' },
  titulo: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal },
  filaValor: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  valor: { fontFamily: fuentes.delgada, fontSize: 64, lineHeight: 72, color: colores.textoPrincipal },
  valorCompacto: { fontFamily: fuentes.delgada, fontSize: 40, lineHeight: 44, color: colores.textoPrincipal },
  unidad: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoSobreCristal },
  detalle: { fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal },
  interpretacion: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoPrincipal },
  mensaje: { fontFamily: fuentes.normal, fontSize: 18, color: colores.textoPrincipal, flexShrink: 1 },
  filaAviso: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
