# Constitución del proyecto: Calculadora Médica

Principios que rigen toda spec, plan y tarea del proyecto. Si una decisión los contradice, se cambia la decisión o se enmienda este documento (ver Gobernanza).

## 1. Propósito
App móvil en español que agiliza la práctica médica mediante el cálculo preciso de fórmulas y escalas clínicas, con acceso rápido (búsqueda, favoritos, recientes), historial y la opción de compartir resultados.

## 2. Principios

### P1. La precisión clínica es lo primero
- Cada fórmula o escala se implementa a partir de una **fuente citada** (guía, artículo original o referencia oficial), anotada en su spec.
- Cada calculadora tiene **pruebas unitarias con casos de referencia** conocidos antes de considerarse terminada.
- El redondeo y las unidades de salida se definen en la spec, nunca se improvisan en el código.

### P2. Las calculadoras funcionan siempre, con o sin conexión y con o sin cuenta
- Las definiciones y fórmulas viven en el código de la app; calcular nunca depende de internet ni de iniciar sesión.
- La nube se usa solo para lo que requiere cuenta: autenticación y sincronización de historial y favoritos.
- Sin conexión, los guardados en la nube quedan pendientes en el teléfono y se reintentan al volver la conexión; el usuario nunca pierde el acceso a calcular.

### P3. Privacidad por diseño
- La app no almacena ni solicita datos identificables de pacientes.
- Invitado: historial y favoritos viven solo en el teléfono. Con cuenta: se guardan además en la nube, asociados a esa cuenta y accesibles solo por su dueño (reglas de seguridad).
- El historial guarda calculadora, valores, resultado, fecha y una nota opcional. La nota lleva un aviso de no escribir nombres de pacientes.
- Los valores solo salen del dispositivo para sincronizar con la cuenta del usuario o cuando el usuario decide compartir. **La nota nunca se incluye al compartir.**

### P4. Rapidez de uso
- Se puede calcular sin crear cuenta; la bienvenida aparece solo la primera vez.
- El resultado se muestra **en vivo** mientras se capturan los datos, sin botón "Calcular".
- Llegar de la pantalla de inicio a un resultado debe tomar pocos toques, con formularios pensados para captura con una mano (teclado numérico, campos en orden lógico, botones grandes para uso con guantes).

### P5. Español primero y unidades explícitas
- Toda la interfaz y la terminología clínica en español estándar.
- Cada campo muestra su unidad; cuando una fórmula admite varias (p. ej. mg/dL y µmol/L), la conversión es explícita y está cubierta por pruebas.

### P6. Validación estricta de entradas
- Cada campo define su **rango válido** (para rechazar errores de captura) y, si aplica, su **rango normal** (solo informativo).
- Con entradas inválidas o incompletas, la app **no muestra resultado**: muestra qué campos faltan o qué valor es inválido.

### P7. Arquitectura en capas con dominio puro
- **UI** (pantallas y componentes) → **Dominio** (cálculos e interpretación) → **Datos** (almacenamiento local y servicio en la nube).
- La capa de dominio son funciones puras en TypeScript, **sin dependencias de React, Expo ni Firebase**.
- Cada calculadora es una **definición declarativa** (`id`, `nombre`, `campos`, `calcular`, `interpretar`) registrada en un catálogo. Los tipos de campo base son: **número** (con unidades y rangos), **opción** (con o sin puntos) y **sí/no**; un campo puede ser opcional. Agregar una calculadora no debe requerir cambios en la UI.

### P8. Simplicidad y alcance acotado
- Se construye lo mínimo que cumple la spec vigente. Nada de funcionalidades especulativas.
- Una dependencia nueva debe justificarse en el plan.

### P9. Herramienta de apoyo, no sustituto del criterio clínico
- La app muestra un aviso visible de que sus resultados son apoyo a la decisión clínica.
- Cada resultado incluye su interpretación y la fuente de referencia.

## 3. Stack técnico
Definido:
- Expo + React Native + TypeScript en modo estricto.
- Persistencia local: AsyncStorage.
- Compartir: tarjeta como imagen (`react-native-view-shot` + `expo-sharing`) y texto con la Share API nativa.
- Pruebas: Jest (unitarias de dominio) y pruebas de integración de flujos.

Pendiente de decidir en el plan:
- Backend: Firebase (Auth + Firestore) o API REST.
- Estado global: se sugiere Zustand.
- Navegación: expo-router o React Navigation.

## 4. Cumplimiento de la rúbrica del curso

| Requisito | Dónde se cubre |
|---|---|
| Autenticación | F01 acceso y sesión, F07 perfil |
| Navegación (≥5 pantallas, Stack, Tabs, Modal) | `01-navigation.md` |
| CRUD de una entidad principal | F05 historial |
| Persistencia local | P2, P3 (AsyncStorage) |
| Backend (REST o Firebase, ≥5 endpoints) | Pendiente: confirmar con el docente |
| Feature nativa | F06 compartir resultado |
| Estado global | Pendiente (Zustand sugerido) |
| ≥3 formularios validados | Login, registro y formularios de calculadoras (P6) |
| Lista optimizada (FlatList paginada) | F05 historial |
| ≥12 tests unitarios + 4 de integración | P1 (dominio) y flujos de F01, F05, F06 |

## 5. Flujo de trabajo (SDD)
1. Toda funcionalidad empieza con una **spec** (qué y por qué, con criterios de aceptación verificables), sin decisiones técnicas.
2. De la spec sale una lista de **tareas** pequeñas y verificables.
3. Se implementa **una tarea a la vez**, respetando la spec y sin agregar funcionalidades nuevas. Si cambia un requisito, **primero se actualiza la spec**, luego el código.
4. Una funcionalidad se da por terminada cuando cumple todos sus criterios de aceptación.
5. Cada commit referencia el ID de la feature o calculadora que implementa.

## 6. Definición de terminado (por calculadora)
- [ ] Spec con fuente citada, campos, unidades, rangos válidos, fórmula e interpretación.
- [ ] Función de dominio con pruebas de casos de referencia y casos límite.
- [ ] Entrada validada, con resultado en vivo solo cuando los datos están completos y son válidos.
- [ ] Registrada en el catálogo (aparece en búsqueda, favoritos y recientes).
- [ ] Se guarda en el historial al salir de la pantalla si hay resultado válido.
- [ ] Se puede compartir como tarjeta y como texto (sin la nota).
- [ ] Aviso de apoyo clínico visible.

## 7. Gobernanza
- Este documento se modifica solo de forma deliberada, indicando fecha y motivo.
- Ante conflicto entre una spec y esta constitución, prevalece la constitución.

## Historial de cambios
- **v1.0 (1 oct 2026):** versión inicial (app offline, sin cuentas ni backend).
- **v1.1 (9 oct 2026):** se incorporan los requisitos del curso y las decisiones D1 a D7 (`00-project.md`): modo invitado con cuenta opcional, nube para sincronización, historial automático con nota, resultado en vivo, compartir como imagen y texto. P2 y P3 reescritos; se agrega el cumplimiento de la rúbrica.

**Versión:** 1.1 · **Fecha:** 9 de octubre de 2026
