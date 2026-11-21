import { useRef, type ReactNode } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, fuentes } from '../tema';

const ANCHO_ACCION = 96;

type Props = {
  children: ReactNode;
  onEliminar: () => void;
  /** Con la selección activa no se desliza. */
  desactivado?: boolean;
};

/** Fila que se desliza a la izquierda para mostrar "Eliminar" (como en iPhone). */
export function FilaDeslizable({ children, onEliminar, desactivado }: Props) {
  const x = useRef(new Animated.Value(0)).current;
  const abierta = useRef(false);
  const inactivo = useRef(desactivado);
  inactivo.current = desactivado;

  const mover = (a: number) => {
    abierta.current = a !== 0;
    Animated.spring(x, { toValue: a, useNativeDriver: true, bounciness: 0 }).start();
  };

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        !inactivo.current && Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        const base = abierta.current ? -ANCHO_ACCION : 0;
        x.setValue(Math.min(0, Math.max(-ANCHO_ACCION * 1.4, base + g.dx)));
      },
      onPanResponderRelease: (_, g) => {
        const base = abierta.current ? -ANCHO_ACCION : 0;
        mover(base + g.dx < -ANCHO_ACCION / 2 ? -ANCHO_ACCION : 0);
      },
      onPanResponderTerminate: () => mover(abierta.current ? -ANCHO_ACCION : 0),
    }),
  ).current;

  return (
    <View>
      {/* Solo se ve mientras se desliza: la tarjeta es translúcida y si no, el rojo se transparentaría. */}
      <Animated.View
        style={[estilos.accion, { opacity: x.interpolate({ inputRange: [-8, 0], outputRange: [1, 0], extrapolate: 'clamp' }) }]}
        pointerEvents="box-none"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Eliminar cálculo"
          onPress={() => {
            mover(0);
            onEliminar();
          }}
          style={estilos.boton}
        >
          <Text style={estilos.texto}>Eliminar</Text>
        </Pressable>
      </Animated.View>
      <Animated.View style={{ transform: [{ translateX: x }] }} {...pan.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  accion: { ...StyleSheet.absoluteFill, alignItems: 'flex-end' },
  boton: {
    width: ANCHO_ACCION - 8,
    height: '100%',
    borderRadius: 24,
    backgroundColor: colores.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { fontFamily: fuentes.seminegrita, fontSize: 16, color: '#FFFFFF' },
});
