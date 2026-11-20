// Sesión de usuario (Zustand) sobre Firebase Authentication. El servicio se inyecta para poder simularlo en pruebas.
import { create } from 'zustand';

import type { ServicioAuth } from '../data/autenticacion';
import { mensajeErrorAuth, type Usuario } from '../domain/cuenta';

export type Respuesta = { ok: true } | { ok: false; mensaje: string };

export type EstadoSesion = {
  usuario: Usuario | null;
  /** Ya se sabe si hay sesión guardada (la primera respuesta de Firebase llegó). */
  lista: boolean;
  /** Empieza a escuchar la sesión. Devuelve la función para dejar de escuchar. */
  iniciar: () => () => void;
  registrar: (correo: string, contrasena: string) => Promise<Respuesta>;
  entrar: (correo: string, contrasena: string) => Promise<Respuesta>;
  cerrar: () => Promise<Respuesta>;
  recuperar: (correo: string) => Promise<Respuesta>;
};

const codigoDe = (e: unknown) => (e as { code?: string } | null)?.code;

export function crearSesion(auth: ServicioAuth, alEntrar?: (usuario: Usuario) => void) {
  return create<EstadoSesion>()((set) => ({
    usuario: null,
    lista: false,
    iniciar: () =>
      auth.escuchar((usuario) => {
        set({ usuario, lista: true });
        if (usuario) alEntrar?.(usuario);
      }),
    registrar: async (correo, contrasena) => {
      try {
        set({ usuario: await auth.registrar(correo, contrasena) });
        return { ok: true };
      } catch (e) {
        return { ok: false, mensaje: mensajeErrorAuth(codigoDe(e)) };
      }
    },
    entrar: async (correo, contrasena) => {
      try {
        set({ usuario: await auth.iniciarSesion(correo, contrasena) });
        return { ok: true };
      } catch (e) {
        return { ok: false, mensaje: mensajeErrorAuth(codigoDe(e)) };
      }
    },
    cerrar: async () => {
      try {
        await auth.cerrarSesion();
        set({ usuario: null });
        return { ok: true };
      } catch {
        return { ok: false, mensaje: 'No pudimos cerrar tu sesión. Intenta de nuevo' };
      }
    },
    recuperar: async (correo) => {
      try {
        await auth.recuperar(correo);
      } catch (e) {
        // Para no revelar si el correo existe, solo la falta de conexión se informa.
        if (codigoDe(e) === 'auth/network-request-failed') {
          return { ok: false, mensaje: mensajeErrorAuth('auth/network-request-failed') };
        }
      }
      return { ok: true };
    },
  }));
}
