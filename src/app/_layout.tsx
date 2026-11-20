import {
  HankenGrotesk_200ExtraLight,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/hanken-grotesk';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useAjustes, useSesion } from '../state/instancias';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fuentesListas] = useFonts({
    HankenGrotesk_200ExtraLight,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  });

  useEffect(() => {
    if (fuentesListas) {
      SplashScreen.hideAsync();
    }
  }, [fuentesListas]);

  // Firebase avisa si hay una sesión guardada y cada vez que cambia.
  useEffect(() => useSesion.getState().iniciar(), []);

  // La bienvenida solo se muestra la primera vez: hay que esperar a leer el ajuste guardado en el teléfono.
  const [ajustesListos, setAjustesListos] = useState(useAjustes.persist.hasHydrated());
  const bienvenidaVista = useAjustes((s) => s.bienvenidaVista);
  useEffect(() => useAjustes.persist.onFinishHydration(() => setAjustesListos(true)), []);

  if (!fuentesListas || !ajustesListos) {
    return null;
  }

  return (
    <>
      {bienvenidaVista ? null : <Redirect href="/bienvenida" />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="acceso" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
