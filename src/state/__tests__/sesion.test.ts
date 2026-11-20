import type { ServicioAuth } from '../../data/autenticacion';
import type { Usuario } from '../../domain/cuenta';
import { crearSesion } from '../sesion';

const usuario: Usuario = { uid: 'u1', email: 'medico@hospital.mx' };
const error = (code: string) => Object.assign(new Error(code), { code });

const authSimulado = (): jest.Mocked<ServicioAuth> => ({
  registrar: jest.fn().mockResolvedValue(usuario),
  iniciarSesion: jest.fn().mockResolvedValue(usuario),
  cerrarSesion: jest.fn().mockResolvedValue(undefined),
  recuperar: jest.fn().mockResolvedValue(undefined),
  escuchar: jest.fn(),
});

describe('sesión (Firebase Auth simulado)', () => {
  it('registrar inicia sesión', async () => {
    const auth = authSimulado();
    const useS = crearSesion(auth);
    expect(await useS.getState().registrar('medico@hospital.mx', 'clave1234')).toEqual({ ok: true });
    expect(useS.getState().usuario).toEqual(usuario);
  });

  it('credenciales incorrectas: mensaje genérico y sin sesión', async () => {
    const auth = authSimulado();
    auth.iniciarSesion.mockRejectedValue(error('auth/invalid-credential'));
    const useS = crearSesion(auth);
    const r = await useS.getState().entrar('a@b.co', 'mala1234');
    expect(r).toEqual({ ok: false, mensaje: 'Correo o contraseña incorrectos' });
    expect(useS.getState().usuario).toBeNull();
  });

  it('correo ya registrado', async () => {
    const auth = authSimulado();
    auth.registrar.mockRejectedValue(error('auth/email-already-in-use'));
    const r = await crearSesion(auth).getState().registrar('a@b.co', 'clave1234');
    expect(r).toEqual({ ok: false, mensaje: 'Ya existe una cuenta con este correo' });
  });

  it('cerrar sesión deja la app como invitado; si falla, conserva la sesión', async () => {
    const auth = authSimulado();
    const useS = crearSesion(auth);
    await useS.getState().entrar('a@b.co', 'clave1234');
    expect((await useS.getState().cerrar()).ok).toBe(true);
    expect(useS.getState().usuario).toBeNull();

    await useS.getState().entrar('a@b.co', 'clave1234');
    auth.cerrarSesion.mockRejectedValue(new Error('x'));
    expect((await useS.getState().cerrar()).ok).toBe(false);
    expect(useS.getState().usuario).toEqual(usuario);
  });

  it('recuperar responde igual exista o no el correo, salvo sin conexión', async () => {
    const auth = authSimulado();
    const useS = crearSesion(auth);
    auth.recuperar.mockRejectedValue(error('auth/user-not-found'));
    expect(await useS.getState().recuperar('a@b.co')).toEqual({ ok: true });
    auth.recuperar.mockRejectedValue(error('auth/network-request-failed'));
    expect((await useS.getState().recuperar('a@b.co')).ok).toBe(false);
  });

  it('la sesión guardada llega por el listener y dispara la descarga de datos', () => {
    const auth = authSimulado();
    let aviso: (u: Usuario | null) => void = () => undefined;
    auth.escuchar.mockImplementation((cb) => {
      aviso = cb;
      return () => undefined;
    });
    const alEntrar = jest.fn();
    const useS = crearSesion(auth, alEntrar);
    useS.getState().iniciar();
    expect(useS.getState().lista).toBe(false);
    aviso(usuario);
    expect(useS.getState()).toMatchObject({ lista: true, usuario });
    expect(alEntrar).toHaveBeenCalledWith(usuario);
    aviso(null);
    expect(useS.getState().usuario).toBeNull();
  });
});
