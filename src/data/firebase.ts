// Inicialización de Firebase. Las claves viven en .env (EXPO_PUBLIC_FIREBASE_*), que no se sube a GitHub.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getAuth, initializeAuth, type Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// En React Native, Firebase exporta getReactNativePersistence, pero sus tipos solo describen la versión web.
const getReactNativePersistence = (
  FirebaseAuth as unknown as { getReactNativePersistence: (almacenamiento: typeof AsyncStorage) => Persistence }
).getReactNativePersistence;

const configuracion = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const yaIniciada = getApps().length > 0;
export const app = yaIniciada ? getApp() : initializeApp(configuracion);

// La sesión se guarda en el teléfono (AsyncStorage) y sobrevive al cerrar la app.
export const auth = yaIniciada
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);
