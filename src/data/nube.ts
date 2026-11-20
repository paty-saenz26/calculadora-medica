// Firestore: usuarios/{uid}/calculos/{id} y usuarios/{uid}/favoritos/{calculadoraId} (02-data-model.md).
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';

import type { CalculoGuardado, Favorito } from '../domain/historial';
import { db } from './firebase';

export type Nube = {
  guardarCalculo: (uid: string, calculo: CalculoGuardado) => Promise<void>;
  eliminarCalculo: (uid: string, id: string) => Promise<void>;
  guardarFavorito: (uid: string, favorito: Favorito) => Promise<void>;
  eliminarFavorito: (uid: string, calculadoraId: string) => Promise<void>;
  descargar: (uid: string) => Promise<{ calculos: CalculoGuardado[]; favoritos: Favorito[] }>;
};

/** Firestore no acepta `undefined`: se quitan los campos vacíos antes de guardar. */
const limpiar = <T extends object>(objeto: T): T => JSON.parse(JSON.stringify(objeto)) as T;

export const nubeFirestore: Nube = {
  guardarCalculo: (uid, calculo) =>
    setDoc(doc(db, 'usuarios', uid, 'calculos', calculo.id), limpiar({ ...calculo, usuarioId: uid })),
  eliminarCalculo: (uid, id) => deleteDoc(doc(db, 'usuarios', uid, 'calculos', id)),
  guardarFavorito: (uid, favorito) =>
    setDoc(doc(db, 'usuarios', uid, 'favoritos', favorito.calculadoraId), limpiar({ ...favorito, usuarioId: uid })),
  eliminarFavorito: (uid, calculadoraId) => deleteDoc(doc(db, 'usuarios', uid, 'favoritos', calculadoraId)),
  descargar: async (uid) => {
    const [calculos, favoritos] = await Promise.all([
      getDocs(collection(db, 'usuarios', uid, 'calculos')),
      getDocs(collection(db, 'usuarios', uid, 'favoritos')),
    ]);
    return {
      calculos: calculos.docs.map((d) => ({ ...(d.data() as CalculoGuardado), usuarioId: uid })),
      favoritos: favoritos.docs.map((d) => ({ ...(d.data() as Favorito), usuarioId: uid })),
    };
  },
};
