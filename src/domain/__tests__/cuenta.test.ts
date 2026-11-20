import {
  mensajeErrorAuth,
  validarConfirmacion,
  validarContrasenaActual,
  validarContrasenaNueva,
  validarCorreo,
} from '../cuenta';

describe('F01 validaciones de cuenta', () => {
  it.each(['', '   ', 'abc', 'a@b', 'a b@c.com', '@c.com'])('rechaza el correo "%s"', (c) => {
    expect(validarCorreo(c)).toBeDefined();
  });
  it.each(['medico@hospital.mx', ' x@y.co '])('acepta el correo "%s"', (c) => {
    expect(validarCorreo(c)).toBeUndefined();
  });

  it('contraseña nueva: mínimo 8, con letra y número', () => {
    expect(validarContrasenaNueva('')).toBeDefined();
    expect(validarContrasenaNueva('abc123')).toMatch(/8/);
    expect(validarContrasenaNueva('abcdefgh')).toMatch(/letra y un número/);
    expect(validarContrasenaNueva('12345678')).toMatch(/letra y un número/);
    expect(validarContrasenaNueva('clave1234')).toBeUndefined();
  });

  it('contraseña de inicio de sesión: solo no vacía', () => {
    expect(validarContrasenaActual('')).toBeDefined();
    expect(validarContrasenaActual('x')).toBeUndefined();
  });

  it('confirmación debe coincidir', () => {
    expect(validarConfirmacion('clave1234', '')).toBeDefined();
    expect(validarConfirmacion('clave1234', 'clave12345')).toMatch(/no coinciden/);
    expect(validarConfirmacion('clave1234', 'clave1234')).toBeUndefined();
  });

  it('mapea errores de Firebase a mensajes en español sin revelar cuentas', () => {
    expect(mensajeErrorAuth('auth/email-already-in-use')).toBe('Ya existe una cuenta con este correo');
    const generico = 'Correo o contraseña incorrectos';
    expect(mensajeErrorAuth('auth/invalid-credential')).toBe(generico);
    expect(mensajeErrorAuth('auth/user-not-found')).toBe(generico);
    expect(mensajeErrorAuth('auth/wrong-password')).toBe(generico);
    expect(mensajeErrorAuth('auth/too-many-requests')).toMatch(/Demasiados intentos/);
    expect(mensajeErrorAuth('auth/network-request-failed')).toMatch(/conexión/);
    expect(mensajeErrorAuth('otro')).toBe('Algo salió mal. Intenta de nuevo');
    expect(mensajeErrorAuth(undefined)).toBe('Algo salió mal. Intenta de nuevo');
  });
});
