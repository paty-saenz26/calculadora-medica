// Validaciones de cuenta y mensajes de error de Firebase Auth (F01). Funciones puras, sin Firebase.

export type Usuario = { uid: string; email: string };

/** Devuelve el mensaje de error, o undefined si es válido. */
export function validarCorreo(correo: string): string | undefined {
  const c = correo.trim();
  if (c === '') return 'Escribe tu correo';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c)) return 'Escribe un correo válido';
  return undefined;
}

export const MINIMO_CONTRASENA = 8;

/** Registro: mínimo 8 caracteres, al menos una letra y un número. */
export function validarContrasenaNueva(contrasena: string): string | undefined {
  if (contrasena === '') return 'Escribe una contraseña';
  if (contrasena.length < MINIMO_CONTRASENA) return `Mínimo ${MINIMO_CONTRASENA} caracteres`;
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(contrasena) || !/\d/.test(contrasena)) {
    return 'Debe incluir al menos una letra y un número';
  }
  return undefined;
}

/** Inicio de sesión: solo no vacía. */
export function validarContrasenaActual(contrasena: string): string | undefined {
  return contrasena === '' ? 'Escribe tu contraseña' : undefined;
}

export function validarConfirmacion(contrasena: string, confirmacion: string): string | undefined {
  if (confirmacion === '') return 'Confirma tu contraseña';
  return contrasena === confirmacion ? undefined : 'Las contraseñas no coinciden';
}

export const MENSAJE_RECUPERACION =
  'Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña';

/** Traduce el código de error de Firebase Auth a un mensaje en español (F01). */
export function mensajeErrorAuth(codigo: string | undefined): string {
  switch (codigo) {
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este correo';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'Correo o contraseña incorrectos';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta de nuevo en unos minutos';
    case 'auth/network-request-failed':
      return 'Necesitas conexión para continuar. Puedes seguir usando la app sin cuenta';
    default:
      return 'Algo salió mal. Intenta de nuevo';
  }
}
