// Resultados compartidos: un documento corto en Firestore (compartidos/{id}) que la página pública lee por su identificador.
import { doc, setDoc } from 'firebase/firestore';

import type { CargaResultado } from '../domain/compartir';
import { db } from './firebase';

const ESPERA_MS = 5000;

/**
 * Guarda el resultado (sin notas ni datos del usuario) y devuelve true si quedó guardado.
 * Sin conexión no se queda esperando: pasados 5 segundos devuelve false y se usa el enlace largo.
 */
export async function publicarResultado(id: string, carga: CargaResultado): Promise<boolean> {
  try {
    const guardado = setDoc(doc(db, 'compartidos', id), { datos: JSON.stringify(carga), creado: Date.now() }).then(
      () => true,
    );
    const limite = new Promise<boolean>((resolver) => setTimeout(() => resolver(false), ESPERA_MS));
    return await Promise.race([guardado, limite]);
  } catch {
    return false;
  }
}
