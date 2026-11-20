// Instancias reales de los almacenes: aquí se conectan Zustand, AsyncStorage y Firebase.
import { servicioAuth } from '../data/autenticacion';
import { almacenamientoLocal } from '../data/local';
import { nubeFirestore } from '../data/nube';
import { crearAlmacen } from './almacen';
import { crearSesion } from './sesion';

export const useAlmacen = crearAlmacen(almacenamientoLocal, nubeFirestore);

// Al haber sesión (o iniciar una), se descarga el historial y los favoritos de la cuenta.
export const useSesion = crearSesion(servicioAuth, (usuario) => {
  useAlmacen
    .getState()
    .importarDeNube(usuario.uid)
    .catch(() => undefined); // sin conexión: se usa lo que ya hay en el teléfono
});
