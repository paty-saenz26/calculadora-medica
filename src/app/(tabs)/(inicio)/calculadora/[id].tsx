// Pantalla de calculadora con resultado en vivo (F03). Dibuja el formulario a partir de la definición.
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { obtenerCalculadora } from '../../../../domain/calculadoras/catalogo';
import { construirCalculo, nuevoId } from '../../../../domain/historial';
import { evaluar } from '../../../../domain/motor';
import type { Calculadora } from '../../../../domain/tipos';
import { cambiarUnidad, type OrigenConversion } from '../../../../domain/unidades';
import { useEsFavorita, useUid } from '../../../../state/hooks';
import { useAlmacen, useSesion } from '../../../../state/instancias';
import { useEspacioBarra } from '../../../../ui/barraPestanas';
import { BarraResultado } from '../../../../ui/componentes/BarraResultado';
import { BotonFavorito } from '../../../../ui/componentes/BotonFavorito';
import { CampoNumeroUI } from '../../../../ui/componentes/CampoNumeroUI';
import { CampoOpcionUI } from '../../../../ui/componentes/CampoOpcionUI';
import { CampoSiNoUI } from '../../../../ui/componentes/CampoSiNoUI';
import { ModalCompartir } from '../../../../ui/componentes/ModalCompartir';
import { Cristal } from '../../../../ui/componentes/Cristal';
import { Encabezado } from '../../../../ui/componentes/Encabezado';
import { Fondo } from '../../../../ui/componentes/Fondo';
import { colores, fuentes, estilosTema } from '../../../../ui/tema';
import { useTema } from '../../../../ui/useTema';

export default function PantallaCalculadora() {
  useTema();
  const { id } = useLocalSearchParams<{ id: string }>();
  const calculadora = obtenerCalculadora(id);
  if (!calculadora) {
    return (
      <Fondo>
        <Encabezado titulo="Calculadora" atras />
        <Text style={estilos.noEncontrada}>Calculadora no encontrada</Text>
      </Fondo>
    );
  }
  return <CalculadoraEnVivo calculadora={calculadora} />;
}

function CalculadoraEnVivo({ calculadora }: { calculadora: Calculadora }) {
  useTema();
  const espacioBarra = useEspacioBarra();

  const [valores, setValores] = useState<Record<string, string | boolean | undefined>>({});
  const [unidades, setUnidades] = useState<Record<string, string>>({});
  const [origenes, setOrigenes] = useState<Record<string, OrigenConversion | undefined>>({});
  const [tocados, setTocados] = useState<Record<string, boolean>>({});
  const [ultimoEditado, setUltimoEditado] = useState<string>();
  const [tecladoVisible, setTecladoVisible] = useState(false);
  const [compartiendo, setCompartiendo] = useState(false);

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

  // F05: al salir de la calculadora se guarda el cálculo si hay resultado válido (y no es repetido).
  const ultimo = useRef({ valores, unidades, resultado: estado.resultado });
  ultimo.current = { valores, unidades, resultado: estado.resultado };
  useEffect(
    () => () => {
      const { valores: v, unidades: u, resultado } = ultimo.current;
      if (!resultado) return;
      const ahora = Date.now();
      const uidActual = useSesion.getState().usuario?.uid;
      useAlmacen
        .getState()
        .guardarCalculo(
          construirCalculo(calculadora, { valores: v, unidades: u }, resultado, nuevoId(ahora), ahora, uidActual),
        );
    },
    [calculadora],
  );

  const uid = useUid();
  const esFavorita = useEsFavorita(calculadora.id);
  const alternarFavorito = useAlmacen((s) => s.alternarFavorito);

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
      <Encabezado titulo="Calculadora" atras />
      <KeyboardAvoidingView style={estilos.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[estilos.contenido, { paddingTop: 16 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.encabezado}>
            <View style={estilos.grupoDerecha}>
              {estado.resultado ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Compartir"
                  onPress={() => setCompartiendo(true)}
                  style={estilos.botonCircular}
                >
                  <Cristal radio={24}>
                    <View style={estilos.contenidoBoton}>
                      <Ionicons name="share-outline" size={24} color={colores.textoPrincipal} />
                    </View>
                  </Cristal>
                </Pressable>
              ) : null}
              <View style={estilos.botonCircular}>
                <Cristal radio={24}>
                  <View style={estilos.contenidoBoton}>
                    <BotonFavorito activo={esFavorita} onPress={() => alternarFavorito(calculadora.id, uid)} />
                  </View>
                </Cristal>
              </View>
            </View>
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
      {estado.resultado ? (
        <ModalCompartir
          visible={compartiendo}
          calculadora={calculadora}
          calculo={construirCalculo(calculadora, { valores, unidades }, estado.resultado, 'compartir', Date.now())}
          onCerrar={() => setCompartiendo(false)}
        />
      ) : null}
    </Fondo>
  );
}

const estilos = estilosTema(() => StyleSheet.create({
  flex: { flex: 1 },
  noEncontrada: { marginTop: 120, textAlign: 'center', fontFamily: fuentes.media, fontSize: 18, color: colores.textoPrincipal },
  contenido: { paddingHorizontal: 16, paddingBottom: 24, gap: 14 },
  encabezado: { flexDirection: 'row', justifyContent: 'flex-end' },
  grupoDerecha: { flexDirection: 'row', gap: 10 },
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
}));
