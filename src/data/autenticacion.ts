// Firebase Authentication: operaciones 1 a 4 de F01/F07. Detrás de una interfaz para poder simularla en pruebas.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

import type { Usuario } from '../domain/cuenta';
import { auth } from './firebase';

export type ServicioAuth = {
  registrar: (correo: string, contrasena: string) => Promise<Usuario>;
  iniciarSesion: (correo: string, contrasena: string) => Promise<Usuario>;
  cerrarSesion: () => Promise<void>;
  recuperar: (correo: string) => Promise<void>;
  /** Avisa al abrir la app (sesión guardada) y en cada cambio. Devuelve la función para dejar de escuchar. */
  escuchar: (alCambiar: (usuario: Usuario | null) => void) => () => void;
};

const aUsuario = (u: User): Usuario => ({ uid: u.uid, email: u.email ?? '' });

export const servicioAuth: ServicioAuth = {
  registrar: async (correo, contrasena) =>
    aUsuario((await createUserWithEmailAndPassword(auth, correo.trim(), contrasena)).user),
  iniciarSesion: async (correo, contrasena) =>
    aUsuario((await signInWithEmailAndPassword(auth, correo.trim(), contrasena)).user),
  cerrarSesion: () => signOut(auth),
  recuperar: (correo) => sendPasswordResetEmail(auth, correo.trim()),
  escuchar: (alCambiar) => onAuthStateChanged(auth, (u) => alCambiar(u ? aUsuario(u) : null)),
};
