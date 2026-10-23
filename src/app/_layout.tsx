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

  if (!fuentesListas) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
