// Almacenamiento local: adaptador de AsyncStorage para Zustand persist.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

export const almacenamientoLocal: StateStorage = {
  getItem: (nombre) => AsyncStorage.getItem(nombre),
  setItem: (nombre, valor) => AsyncStorage.setItem(nombre, valor),
  removeItem: (nombre) => AsyncStorage.removeItem(nombre),
};
