# Plan técnico

> Versión 0.1 (borrador) · 23 de octubre de 2026. Responde al **cómo**: herramientas, estructura de carpetas y orden de trabajo. El **qué** vive en las specs. Si este plan contradice una spec o la constitución, se corrige el plan.

## Decisiones técnicas

| # | Tema | Decisión | Por qué |
|---|---|---|---|
| D22 | Navegación | **expo-router** | Es el estándar de Expo; pestañas, stacks y modales ya vienen resueltos y cubren `01-navigation.md` con poca configuración |
| D23 | Estado global | **Zustand** | Poco código, fácil de probar, y guarda datos en AsyncStorage con un complemento oficial |
| D24 | Firebase | **Firebase JS SDK** (`firebase`) | Funciona en Expo Go sin compilar; cubre Authentication y Firestore (D16) |

## Dependencias

Cada dependencia debe justificarse (P8). Se instalan con `npx expo install` para que la versión sea compatible con el SDK del proyecto.

| Paquete | Para qué |
|---|---|
| `expo-router` (con `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`) | Navegación (D22) |
| `zustand` | Estado global (D23) |
| `firebase` | Authentication y Firestore (D24) |
| `@react-native-async-storage/async-storage` | Persistencia local (P2, P3) y sesión de Firebase |
| `expo-blur` | Efecto cristal (constitución, sección 3.1) |
| `expo-font` y `@expo-google-fonts/hanken-grotesk` | Tipografía |
| `react-native-view-shot` y `expo-sharing` | Compartir la tarjeta como imagen (F06) |
| `@expo/vector-icons` (ya viene con Expo) | Íconos |
| Desarrollo: `jest`, `jest-expo`, `@testing-library/react-native`, `@types/jest` | Pruebas unitarias y de integración |

## Estructura de carpetas

Sigue las capas de la constitución (P7): UI → dominio puro → datos.

```
app/                      Pantallas y rutas (expo-router). Solo UI.
  _layout.tsx             Raíz: carga fuentes, sesión y bienvenida
  bienvenida.tsx
  (tabs)/
    _layout.tsx           Barra de pestañas
    (inicio)/
      index.tsx           Inicio (F02)
      especialidad/[id].tsx
      calculadora/[id].tsx
    (historial)/
      index.tsx           Historial (F05)
      [id].tsx            Detalle de cálculo
    perfil.tsx            Perfil (F07)
  acceso/
    iniciar-sesion.tsx
    crear-cuenta.tsx
    recuperar-contrasena.tsx
  (modales)/
    compartir.tsx
    editar-nota.tsx
    datos-invitado.tsx

src/
  domain/                 Dominio puro en TypeScript. SIN React, Expo ni Firebase.
    tipos.ts              Calculadora, Campo, Resultado, CalculoGuardado, Favorito
    motor.ts              Validación, conversión de unidades y cálculo en vivo
    calculadoras/
      pam.ts  cha2ds2-vasc.ts  cockcroft-gault.ts  imc-sc.ts  fib4.ts
      catalogo.ts         Registro de todas las calculadoras
    busqueda.ts           buscarCalculadoras (F02)
    historial.ts          esDuplicado, validarNota (F05)
    compartir.ts          armarTextoCompartir (F06)
    validaciones.ts       Correo y contraseña (F01)
  data/                   Almacenamiento. Sin lógica de negocio.
    firebase.ts           Inicialización de Firebase
    auth.ts               Registro, inicio y cierre de sesión, recuperar contraseña
    local.ts              AsyncStorage (historial, favoritos, ajustes, cola)
    nube.ts               Firestore: cálculos y favoritos
    sincronizacion.ts     Cola de operaciones pendientes y reintento
  state/                  Stores de Zustand
    sesion.ts  historial.ts  favoritos.ts  ajustes.ts
  ui/                     Componentes reutilizables
    tema.ts               Tokens de color, tipografía y espacios
    componentes/          Tarjeta de cristal, campo numérico, botón, chip, etc.

firestore.rules           Reglas de seguridad (R6)
__tests__/                Pruebas (unitarias junto a su dominio, integración aparte)
```

Reglas de la arquitectura:
- `src/domain` no importa nada de React, Expo ni Firebase (P7). Todo cálculo y toda regla de las specs se prueba ahí con Jest, sin teléfono.
- `app/` y `src/ui` no hacen cálculos: llaman al dominio y muestran el resultado.
- `src/data` es la única capa que conoce AsyncStorage y Firestore. Los stores la usan, la UI no.
- Agregar una calculadora = un archivo nuevo en `domain/calculadoras/` y una línea en `catalogo.ts`; no se toca la UI (P7).
- Los colores y la tipografía salen de `ui/tema.ts`, nunca sueltos en las pantallas.

## Cómo funciona cada parte

**Motor de calculadoras.** Recibe la definición (campos, rangos, reglas) y los valores capturados, y devuelve: campos que faltan, errores por campo, o el resultado. Aplica D11 (nunca resultado parcial), D12 (error al salir del campo) y D13 (conversión de unidades con restauración exacta). Es la base de F03 y de las cinco calculadoras.

**Sesión.** Firebase Authentication guarda la sesión en AsyncStorage para que persista al cerrar la app (F01). El store de sesión expone: invitado o con cuenta, y el usuario. Verificar el método de persistencia en la documentación vigente de Firebase al implementarlo.

**Datos según el modo (D6).**
- **Invitado:** el historial y los favoritos viven solo en AsyncStorage.
- **Con cuenta:** Firestore es la fuente de verdad. Los stores muestran los cambios al instante y los sincronizan en segundo plano.
- **Sin conexión:** el SDK web de Firebase en React Native no guarda una caché persistente fiable, así que se usa **nuestra cola de operaciones pendientes** en AsyncStorage (crear cálculo, editar nota, eliminar, agregar o quitar favorito). Se reintenta al volver la conexión y al abrir la app.
- **Aviso de D8:** al iniciar sesión con datos locales de invitado, la app pregunta si agregarlos a la cuenta. Los repetidos se fusionan (R7).

**Historial paginado.** Firestore con consulta ordenada por fecha, 20 por página y cursor (`startAfter`); `FlatList` con `onEndReached` (F05). Para invitado, la misma interfaz pagina sobre la lista local.

**Guardado automático.** Un solo punto: el evento de pérdida de foco de la pantalla de calculadora (volver o cambiar de pestaña) llama a la función de guardado, que usa `esDuplicado` (B1/D19) antes de crear el registro. Abrir el modal de compartir no dispara el guardado (`01-navigation.md`).

**Compartir (F06).** Imagen: `react-native-view-shot` captura la tarjeta y `expo-sharing` abre el menú del sistema. Texto: la `Share` nativa de React Native con el texto armado por el dominio. La nota nunca entra (R4).

**Configuración de Firebase.** Los datos de configuración van en variables `EXPO_PUBLIC_FIREBASE_*` en un archivo `.env` que **no se sube a GitHub** (se agrega a `.gitignore`). Aunque esas claves no son secretas, es mejor no publicarlas. La seguridad real está en `firestore.rules`.

**Reglas de seguridad de Firestore (R6).** Cada usuario solo lee y escribe `usuarios/{uid}/...` si `request.auth.uid == uid`. Se prueban manualmente con una segunda cuenta antes de la entrega.

## Pruebas

La rúbrica pide al menos 12 pruebas unitarias y 4 de integración.

| Tipo | Qué cubre | Cantidad aproximada |
|---|---|---|
| Unitarias del dominio | Cada calculadora con su tabla de casos (C01 a C05), conversión de unidades, rangos, búsqueda, `esDuplicado`, `validarNota`, contraseñas, texto de compartir | 40 o más |
| Integración | 1. Arranque con y sin bienvenida. 2. Registro e inicio de sesión (Firebase simulado). 3. Guardado automático sin duplicados. 4. Historial: editar nota y eliminar con confirmación. 5. Compartir como texto sin la nota | 5 |

Firebase se simula (mock) en las pruebas; no se toca la nube real.

## Orden de trabajo

Una tarea a la vez (constitución, sección 5). Cada hito termina con sus criterios de aceptación cumplidos y un commit con el ID (por ejemplo `feat(C01): calcula PAM`). Las fechas son aproximadas, contando la entrega a finales de noviembre.

| Hito | Contenido | Semana aprox. |
|---|---|---|
| H0 | Preparación: expo-router, carpetas, tema, fuentes, Jest | 26 oct |
| H1 | Dominio: tipos, motor y **C01 (PAM)** con sus pruebas | 26 oct |
| H2 | **F03** calculadora en vivo (UI) y **F02** catálogo con búsqueda | 2 nov |
| H3 | C02, C03 y C04 con sus pruebas, registradas en el catálogo | 2 nov |
| H4 | **F05** historial local (invitado) y **F04** favoritos locales | 9 nov |
| H5 | Firebase: **F01** acceso y sesión, **F07** perfil | 9 nov |
| H6 | Sincronización con la nube, cola de pendientes y aviso D8 | 16 nov |
| H7 | **F06** compartir (imagen y texto) | 16 nov |
| H8 | Pruebas de integración, pulido visual, README y revisión de rúbrica | 23 nov |
| Extra | C05 (FIB-4) si hay tiempo | — |

## Riesgos

- **Cola de pendientes y sincronización (H6)** es lo más complicado. Si se aprieta el tiempo, se entrega con sincronización simple (reintento al abrir la app) y se documenta.
- **Efecto cristal:** el desenfoque puede pesar en listas largas; se prueba en un iPhone real (constitución, sección 3.1).
- **Validación médica:** las fórmulas y rangos siguen marcados "por validar"; no bloquean el desarrollo, pero hay que revisarlos antes de la entrega.

## Pendientes

- [ ] Confirmar la versión de Expo SDK del proyecto y que Expo Go la soporta en tu iPhone.
- [ ] Crear el proyecto de Firebase (Authentication con correo y Firestore) y guardar su configuración en `.env`.
- [ ] Verificar en la documentación vigente de Firebase y de `expo-blur` los pasos de instalación concretos.
- [ ] Decidir si se publica la app (App Store) o solo se entrega el proyecto.
