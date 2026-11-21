import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type Nombre = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Icono de contorno para cada especialidad de la pestaña Inicio. */
export const ICONOS_ESPECIALIDAD: Record<string, Nombre> = {
  Cardiovascular: 'heart-pulse',
  'Cuidados intensivos': 'bed-outline',
  Gastroenterología: 'stomach',
  'Medicina general': 'medical-bag',
  Neumología: 'lungs',
  Neurología: 'brain',
  Nutrición: 'food-apple-outline',
  Oncología: 'ribbon',
  Renal: 'water-outline',
  Reumatología: 'bone',
};

export const iconoEspecialidad = (especialidad: string): Nombre =>
  ICONOS_ESPECIALIDAD[especialidad] ?? 'hospital-box-outline';
