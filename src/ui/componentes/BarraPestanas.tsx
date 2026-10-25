import type { Tabs } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BARRA, margenInferiorBarra } from '../barraPestanas';
import { colores, fuentes } from '../tema';
import { FondoCristal } from './FondoCristal';

type PropiedadesBarra = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

/** Barra de pestañas flotante de cristal; la pestaña activa es una píldora verde sólida (constitución, 3.1). */
export function BarraPestanas({ state, descriptors, emitter, navigateToTab }: PropiedadesBarra) {
  const insets = useSafeAreaInsets();
  const [tecladoVisible, setTecladoVisible] = useState(false);

  // La barra se esconde mientras el teclado está abierto.
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const alMostrar = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () => setTecladoVisible(true));
    const alOcultar = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => setTecladoVisible(false));
    return () => {
      alMostrar.remove();
      alOcultar.remove();
    };
  }, []);

  if (tecladoVisible) {
    return null;
  }

  return (
    <View
      style={[estilos.contenedor, { bottom: margenInferiorBarra(insets.bottom) }]}
      accessibilityRole="tablist"
    >
      <FondoCristal radio={BARRA.radio} />
      {state.routes.map((ruta, indice) => {
        const { options } = descriptors[ruta.key];
        const activa = state.index === indice;
        const color = activa ? colores.textoSobrePrimario : colores.textoPrincipal;
        const etiqueta = options.title ?? ruta.name;

        const alTocar = () => {
          const evento = emitter.emit({ type: 'tabPress', target: ruta.key, canPreventDefault: true });
          if (!activa && !evento.defaultPrevented) {
            navigateToTab(ruta.key);
          }
        };

        return (
          <Pressable
            key={ruta.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: activa }}
            accessibilityLabel={etiqueta}
            onPress={alTocar}
            onLongPress={() => emitter.emit({ type: 'tabLongPress', target: ruta.key })}
            style={[estilos.pestana, activa && estilos.pestanaActiva]}
          >
            {options.tabBarIcon?.({ focused: activa, color, size: 24 })}
            <Text style={[estilos.etiqueta, { color }]}>{etiqueta}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    left: BARRA.margenLateral,
    right: BARRA.margenLateral,
    height: BARRA.alto,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  pestana: {
    flex: 1,
    height: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pestanaActiva: { backgroundColor: colores.primario },
  etiqueta: { fontFamily: fuentes.media, fontSize: 12 },
});
