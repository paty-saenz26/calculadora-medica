import {
  HankenGrotesk_200ExtraLight,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/hanken-grotesk';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useSesion } from '../state/instancias';

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

  if (!fuentesListas) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="acceso" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
