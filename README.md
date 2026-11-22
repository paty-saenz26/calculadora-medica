# Calculadora Médica

App móvil de calculadoras y escalas clínicas en español, inspirada en MDCalc. Hecha con Expo (React Native) y TypeScript para la materia de Aplicaciones Móviles, UABC FIAD, grupo 972.

> Los resultados son apoyo a la decisión clínica y no sustituyen el criterio médico. Las calculadoras están **pendientes de validación por un médico**; cada una muestra su fuente bibliográfica.

## Qué hace

- **19 calculadoras y escalas** (PAM, CHA₂DS₂-VA, Cockcroft-Gault, IMC y superficie corporal, FIB-4, CKD-EPI 2021, Wells TEP, NIHSS, Child-Pugh, entre otras) con resultado en vivo, validación de rangos y cambio de unidades.
- **Inicio** con búsqueda en vivo (ignora acentos y mayúsculas, encuentra por siglas) y pestañas Especialidades, Recientes, Favoritas y Todas.
- **Favoritos** con estrella.
- **Historial** de cálculos con paginación (20 por página), notas de hasta 200 caracteres y eliminación con confirmación. Se guarda al salir de la calculadora y no repite cálculos idénticos.
- **Cuenta** con Firebase Authentication (registro, inicio de sesión, recuperar contraseña, sesión persistente) y sincronización del historial y favoritos con Firestore. Sin cuenta se usa como invitado, todo en el teléfono.
- **Compartir** el resultado como tarjeta con enlace (se ve con imagen en WhatsApp y otras apps) o como texto. La nota nunca se comparte.

## Probar la app

La app se abre con **Expo Go** (disponible en App Store y Google Play):

1. Instala Expo Go en tu celular.
2. Abre este link desde el celular: [Abrir Calculadora Médica](exp://u.expo.dev/b9fb6b2a-3e35-451f-af14-6371b8993443/group/153f85be-7646-4dc8-bc31-dc268250cfdd)

Link directo: `exp://u.expo.dev/b9fb6b2a-3e35-451f-af14-6371b8993443/group/153f85be-7646-4dc8-bc31-dc268250cfdd`

## Cómo correrla

Requisitos: Node 20 o superior y la app Expo Go en el teléfono.

```bash
npm install --legacy-peer-deps
```

Crea un archivo `.env` en la raíz con la configuración de tu proyecto de Firebase (no se sube a GitHub):

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

En Firebase hay que activar Authentication (correo y contraseña) y Firestore, con las reglas de `firestore.rules`.

```bash
npx expo start        # escanea el QR con Expo Go
npx expo start --tunnel   # si el teléfono no alcanza la PC
npm test              # pruebas unitarias y de integración
npx tsc --noEmit      # revisión de tipos
```

## Arquitectura

Aplicación monolítica (un solo proyecto Expo) en capas. Firebase es un servicio externo (BaaS). Calcular nunca necesita internet ni cuenta.

| Capa | Carpeta | Qué hace |
|---|---|---|
| Presentación | `src/app`, `src/ui` | Pantallas (expo-router) y componentes visuales. No contiene fórmulas. |
| Estado | `src/state` | Zustand: historial, favoritos y sesión. |
| Datos | `src/data` | AsyncStorage y Firebase (Auth y Firestore). |
| Dominio | `src/domain` | TypeScript puro: motor de evaluación, unidades, calculadoras, búsqueda, historial, compartir. No depende de React, Expo ni Firebase. |

Cada calculadora es una definición declarativa (campos, reglas, fórmula, fuente) registrada en `src/domain/calculadoras/catalogo.ts`. Agregar una calculadora es un archivo nuevo y una línea en el catálogo; la pantalla genérica dibuja el formulario.

Navegación: Tabs (Inicio, Historial, Perfil) + Stack por pestaña (calculadora, detalle de cálculo) + modal (acceso, compartir, notas).

## Firebase

Authentication: registrar usuario, iniciar sesión, cerrar sesión, enviar correo de recuperación.
Firestore: guardar, editar (nota) y eliminar cálculo; guardar y quitar favorito; descargar historial y favoritos de la cuenta; publicar un resultado compartido.

Estructura: `usuarios/{uid}/calculos/{id}`, `usuarios/{uid}/favoritos/{calculadoraId}` (solo su dueño las lee y escribe) y `compartidos/{id}` (lectura por identificador, creación acotada).

## Páginas de las calculadoras (carpeta `docs/`)

Sitio estático publicado con GitHub Pages: una página por calculadora con su imagen de tarjeta. Es lo que muestran WhatsApp y otras apps al compartir un resultado. La página muestra el resultado compartido leyéndolo de Firestore.

## Pruebas

365 pruebas con Jest: casos numéricos de cada calculadora, motor y unidades, búsqueda, historial, favoritos, validaciones de cuenta, estado (con Firestore y Auth simulados) y 6 pruebas de integración que recorren flujos completos (calcular y guardar, registro y sincronización, credenciales incorrectas, cierre de sesión, búsqueda y favoritos, paginación).

## Documentación del proyecto

La especificación vive en `specs/` (Spec-Driven Development): constitución, plan, modelo de datos, navegación, una especificación por funcionalidad y una por calculadora.

- [Bitácora de IA](BitacoraIA.md)
- [Diario de decisiones](Decisiones.md)

## Pendientes conocidos

- Validación médica de las fórmulas y textos.
- Cuatro calculadoras complejas (Glasgow-Blatchford, GRACE, ASCVD 2013, Duke-ISCVID 2023).
- Cola de cambios pendientes sin conexión.
- Abrir la app directamente desde el enlace compartido (requiere un build nativo).
