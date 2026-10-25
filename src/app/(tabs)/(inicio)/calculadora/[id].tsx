// Pantalla de calculadora con resultado en vivo (F03). Dibuja el formulario a partir de la definición.
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { obtenerCalculadora } from '../../../../domain/calculadoras/catalogo';
import { evaluar } from '../../../../domain/motor';
import type { Calculadora } from '../../../../domain/tipos';
import { cambiarUnidad, type OrigenConversion } from '../../../../domain/unidades';
import { useEspacioBarra } from '../../../../ui/barraPestanas';
import { BarraResultado } from '../../../../ui/componentes/BarraResultado';
import { CampoNumeroUI } from '../../../../ui/componentes/CampoNumeroUI';
import { CampoOpcionUI } from '../../../../ui/componentes/CampoOpcionUI';
import { CampoSiNoUI } from '../../../../ui/componentes/CampoSiNoUI';
import { Cristal } from '../../../../ui/componentes/Cristal';
import { Fondo } from '../../../../ui/componentes/Fondo';
import { colores, fuentes } from '../../../../ui/tema';

export default function PantallaCalculadora() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const calculadora = obtenerCalculadora(id);
  if (!calculadora) {
    return (
      <Fondo>
        <Text style={estilos.noEncontrada}>Calculadora no encontrada</Text>
      </Fondo>
    );
  }
  return <CalculadoraEnVivo calculadora={calculadora} />;
}

function CalculadoraEnVivo({ calculadora }: { calculadora: Calculadora }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const espacioBarra = useEspacioBarra();

  const [valores, setValores] = useState<Record<string, string | boolean | undefined>>({});
  const [unidades, setUnidades] = useState<Record<string, string>>({});
  const [origenes, setOrigenes] = useState<Record<string, OrigenConversion | undefined>>({});
  const [tocados, setTocados] = useState<Record<string, boolean>>({});
  const [ultimoEditado, setUltimoEditado] = useState<string>();
  const [tecladoVisible, setTecladoVisible] = useState(false);

  // Con el teclado abierto el espacio es poco: la barra de resultado pasa a su versión compacta.
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const alMostrar = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () => setTecladoVisible(true));
    const alOcultar = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => setTecladoVisible(false));
    return () => {
      alMostrar.remove();
      alOcultar.remove();
    };
  }, []);

  const estado = useMemo(
    () => evaluar(calculadora, { valores, unidades }),
    [calculadora, valores, unidades],
  );

  const cambiarTexto = (campoId: string, texto: string) => {
    setValores((v) => ({ ...v, [campoId]: texto }));
    setOrigenes((o) => ({ ...o, [campoId]: undefined })); // al editar, ya no hay valor original que restaurar
  };

  const terminarEdicion = (campoId: string) => {
    setTocados((t) => ({ ...t, [campoId]: true }));
    setUltimoEditado(campoId);
  };

  // Error visible bajo un campo: de rango (solo tras terminar de editarlo, D12) o de regla entre campos.
  const errorDe = (campoId: string): string | undefined => {
    if (tocados[campoId] && estado.errores[campoId]) {
      return estado.errores[campoId];
    }
    if (ultimoEditado === campoId) {
      return estado.reglas.find((r) => r.campos.includes(campoId))?.mensaje;
    }
    return undefined;
  };

  return (
    <Fondo>
      <KeyboardAvoidingView style={estilos.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[estilos.contenido, { paddingTop: insets.top + 12 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.encabezado}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={() => router.back()}
              style={estilos.botonCircular}
            >
              <Cristal radio={24}>
                <View style={estilos.contenidoBoton}>
                  <Ionicons name="chevron-back" size={24} color={colores.textoPrincipal} />
                </View>
              </Cristal>
            </Pressable>
          </View>

          <View style={estilos.titulos}>
            {calculadora.especialidades[0] ? (
              <Text style={estilos.chip}>{calculadora.especialidades[0]}</Text>
            ) : null}
            <Text style={estilos.nombre}>{calculadora.nombre}</Text>
          </View>

          <View style={estilos.campos}>
            {calculadora.campos.map((campo) => {
              if (campo.tipo === 'numero') {
                const unidadId = unidades[campo.id] ?? campo.unidades[0].id;
                const texto = typeof valores[campo.id] === 'string' ? (valores[campo.id] as string) : '';
                return (
                  <CampoNumeroUI
                    key={campo.id}
                    campo={campo}
                    texto={texto}
                    unidadId={unidadId}
                    error={errorDe(campo.id)}
                    onCambiarTexto={(t) => cambiarTexto(campo.id, t)}
                    onTerminar={() => terminarEdicion(campo.id)}
                    onCambiarUnidad={(nueva) => {
                      const r = cambiarUnidad(campo, { texto, unidadId, origen: origenes[campo.id] }, nueva);
                      setValores((v) => ({ ...v, [campo.id]: r.texto }));
                      setUnidades((u) => ({ ...u, [campo.id]: r.unidadId }));
                      setOrigenes((o) => ({ ...o, [campo.id]: r.origen }));
                      setTocados((t) => ({ ...t, [campo.id]: true })); // D13: se revalida con el rango de la nueva unidad
                    }}
                  />
                );
              }
              if (campo.tipo === 'opcion') {
                const valor = typeof valores[campo.id] === 'string' ? (valores[campo.id] as string) : undefined;
                return (
                  <CampoOpcionUI
                    key={campo.id}
                    campo={campo}
                    valor={valor}
                    onCambiar={(v) => setValores((x) => ({ ...x, [campo.id]: v }))}
                  />
                );
              }
              const valor = typeof valores[campo.id] === 'boolean' ? (valores[campo.id] as boolean) : campo.valorInicial;
              return (
                <CampoSiNoUI
                  key={campo.id}
                  campo={campo}
                  valor={valor}
                  onCambiar={(v) => setValores((x) => ({ ...x, [campo.id]: v }))}
                />
              );
            })}
          </View>

          <Text style={estilos.fuente}>
            Fuente: {calculadora.fuente}
            {calculadora.notaFuente ? `\n${calculadora.notaFuente}` : ''}
            {'\n'}Resultado de apoyo a la decisión clínica; no sustituye el criterio médico.
          </Text>
        </ScrollView>

        <View style={[estilos.barra, { paddingBottom: tecladoVisible ? 8 : espacioBarra }]}>
          <BarraResultado estado={estado} compacta={tecladoVisible} />
        </View>
      </KeyboardAvoidingView>
      {/* Difuminado bajo la barra de estado: el contenido ya no se encima con la hora. */}
      <BlurView
        pointerEvents="none"
        intensity={40}
        tint="light"
        style={[estilos.barraEstado, { height: insets.top }]}
      />
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  noEncontrada: { marginTop: 120, textAlign: 'center', fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal },
  contenido: { paddingHorizontal: 16, paddingBottom: 24, gap: 14 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between' },
  botonCircular: { width: 48, height: 48 },
  contenidoBoton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  titulos: { gap: 8, alignItems: 'flex-start' },
  chip: {
    fontFamily: fuentes.media,
    fontSize: 18,
    color: colores.textoPrincipal,
    backgroundColor: colores.chip,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  nombre: { fontFamily: fuentes.negrita, fontSize: 32, lineHeight: 38, color: colores.textoPrincipal },
  campos: { gap: 14 },
  fuente: { fontFamily: fuentes.normal, fontSize: 18, lineHeight: 26, color: colores.textoPrincipal, marginTop: 6 },
  barra: { paddingHorizontal: 16, paddingTop: 8 },
  barraEstado: { position: 'absolute', top: 0, left: 0, right: 0 },
});
