import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { colores, estilosTema } from '../tema';
import { useTema } from '../useTema';

// Medidas del diseño G, pensado en una pantalla de 390 x 844.
const DISENO = { ancho: 390, alto: 844 };
const ELIPSE = { izquierda: 284, arriba: 59, ancho: 515, alto: 727 }; // asoma ~106 px por la derecha

/** Fondo de las pantallas: degradado verde claro con una sola forma curva pegada al borde derecho. */
export function Fondo({ children }: { children: ReactNode }) {
  const modo = useTema();
  const { width, height } = useWindowDimensions();
  const escalaX = width / DISENO.ancho;
  const escalaY = height / DISENO.alto;

  return (
    <LinearGradient
      colors={[colores.degradadoInicio, colores.degradadoMedio, colores.degradadoFin]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={estilos.fondo}
    >
      <StatusBar style={modo === 'oscuro' ? 'light' : 'dark'} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, estilos.recorte]}>
        <LinearGradient
          colors={[colores.formaInicio, colores.formaFin]}
          start={{ x: 0.67, y: 0 }}
          end={{ x: 0.33, y: 1 }}
          style={{
            position: 'absolute',
            left: ELIPSE.izquierda * escalaX,
            top: ELIPSE.arriba * escalaY,
            width: ELIPSE.ancho * escalaX,
            height: ELIPSE.alto * escalaY,
            borderRadius: 9999,
            opacity: 0.9,
          }}
        />
      </View>
      {children}
    </LinearGradient>
  );
}

const estilos = estilosTema(() => StyleSheet.create({
  fondo: { flex: 1 },
  recorte: { overflow: 'hidden' },
}));
