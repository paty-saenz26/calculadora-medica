# Navegación

> Versión 0.1 (borrador). Describe pantallas, cómo se llega a ellas y qué pasa al salir. La librería de navegación (expo-router o React Navigation) se decide en el plan, no aquí.

## Mapa de pantallas

| # | Pantalla | Tipo | Feature | Cómo se llega |
|---|---|---|---|---|
| 1 | Bienvenida | Pantalla completa | F01 | Solo la primera vez que se abre la app (D1b) |
| 2 | Iniciar sesión | Pantalla completa (stack) | F01 | Desde Bienvenida o desde Perfil |
| 3 | Crear cuenta | Pantalla completa (stack) | F01 | Desde Bienvenida, Perfil o Iniciar sesión |
| 4 | Recuperar contraseña | Pantalla completa (stack) | F01 | Desde Iniciar sesión |
| 5 | Inicio | Pestaña | F02 | Pestaña 1; es la pantalla de arranque |
| 6 | Especialidad | Stack de Inicio | F02 | Desde la pestaña Especialidades de Inicio |
| 7 | Calculadora | Stack de Inicio | F03 | Desde cualquier lista de calculadoras |
| 8 | Historial | Pestaña | F05 | Pestaña 2 |
| 9 | Detalle de cálculo | Stack de Historial | F05 | Desde una fila del Historial |
| 10 | Perfil | Pestaña | F07 | Pestaña 3 |
| M1 | Vista previa de compartir | Modal | F06 | Desde Calculadora o Detalle de cálculo |
| M2 | Editar nota | Modal | F05 | Desde Detalle de cálculo |
| M3 | Aviso de datos de invitado (D8) | Modal | F01 | Tras registrarse o iniciar sesión, si hay datos locales |

Cumplimiento de la rúbrica: 10 pantallas, Stack, Tabs y Modal (constitución, sección 4).

## Estructura

```
Raíz
├── Bienvenida (solo la primera vez)
├── Pestañas
│   ├── Inicio (stack): Inicio → Especialidad → Calculadora
│   ├── Historial (stack): Historial → Detalle de cálculo
│   └── Perfil
├── Acceso (stack sobre las pestañas): Iniciar sesión, Crear cuenta, Recuperar contraseña
└── Modales: Vista previa de compartir, Editar nota, Aviso de datos de invitado
```

Las pestañas inferiores son tres: **Inicio**, **Historial** y **Perfil** (D5).

## Arranque

1. Si no se ha visto la bienvenida (`bienvenidaVista` falso), se muestra Bienvenida.
2. Si ya se vio, la app abre directo en **Inicio**.
3. Con una sesión guardada, la app entra con ella sin pasar por ningún formulario (F01).
4. Sin conexión, el arranque no cambia: las calculadoras funcionan (P2).

## Flujos principales

**Calcular:** Inicio → (buscar o elegir) → Calculadora. El resultado aparece en vivo (F03). Con resultado válido, aparece "Compartir" (F06).

**Compartir:** Calculadora o Detalle de cálculo → modal Vista previa → menú de compartir del sistema → regresa al modal → Cerrar → pantalla de origen.

**Revisar historial:** Historial → Detalle de cálculo → (nota, compartir o eliminar) → regresa a la lista.

**Acceder a una cuenta:** Bienvenida o Perfil → Iniciar sesión o Crear cuenta → éxito → (aviso de D8 si hay datos locales) → vuelve a donde estaba, o a Inicio si venía de Bienvenida.

**Cerrar sesión:** Perfil → diálogo de confirmación → la app queda como invitado en Perfil.

## Reglas de navegación

- **Guardado al salir (D4, F05):** el cálculo se guarda cuando la pantalla Calculadora se cierra (botón o gesto de volver) o cuando el usuario cambia de pestaña, siempre que haya resultado válido. Abrir el modal de compartir **no** cuenta como salir. Si se guarda dos veces con los mismos valores, la regla de no duplicados (B1) evita el repetido.
- **Cada pestaña conserva su pila:** al volver a una pestaña se ve la pantalla donde se quedó el usuario. Tocar la pestaña activa regresa a la primera pantalla de su pila.
- **Volver:** todas las pantallas del stack tienen botón de volver visible, redondo y de al menos 44 px (P4). El gesto de deslizar desde el borde también funciona en iOS.
- **Modales:** se cierran con su botón "Cerrar" o "Cancelar" y deslizando hacia abajo. M3 (aviso de D8) exige elegir "Sí" o "No", así que no se cierra deslizando.
- **Eliminar un cálculo desde el Detalle:** tras confirmar, se regresa a la lista de Historial.
- **Pantalla de Acceso:** al terminar con éxito se cierra el stack de Acceso y se regresa a la pantalla de origen.
- **Sesión que termina:** se regresa a modo invitado sin cerrar la app (F07).

## Estados y avisos

| Situación | Comportamiento |
|---|---|
| Abrir una calculadora que ya no existe (por ejemplo, un favorito retirado) | No aparece en las listas; no se puede abrir |
| Sin conexión | La navegación no cambia; los formularios de acceso muestran su mensaje (F01) |
| Cálculo eliminado en otro teléfono mientras se ve su detalle | Al volver a la lista desaparece, sin error |

## Criterios de aceptación

- [ ] Primera vez: se ve Bienvenida; después la app abre directo en Inicio.
- [ ] Las tres pestañas funcionan y cada una conserva su pila al cambiar de pestaña.
- [ ] Tocar la pestaña activa regresa a su primera pantalla.
- [ ] De Inicio se llega a una Calculadora en dos toques o menos desde Recientes o Favoritas.
- [ ] Los modales M1 y M2 se cierran con su botón y deslizando; M3 solo eligiendo una opción.
- [ ] Salir de una calculadora con resultado válido (volver o cambiar de pestaña) guarda el cálculo; abrir Compartir no.
- [ ] Iniciar sesión desde Perfil regresa a Perfil con el estado actualizado.
- [ ] Todos los botones de volver tienen al menos 44 px.

## Tasks

- [ ] Decidir la librería de navegación en el plan (expo-router o React Navigation).
- [ ] Crear la estructura de pestañas, stacks y modales con pantallas vacías.
- [ ] Lógica de arranque (bienvenida, sesión guardada).
- [ ] Barra de pestañas verde con la paleta definida (constitución, sección 3.1).
- [ ] Evento de salida de la calculadora que dispara el guardado (F05).
- [ ] Pruebas de integración: arranque con y sin bienvenida, y flujo Inicio → Calculadora → Historial.
- [ ] Probar los criterios de aceptación en iOS.

## Pendientes

- [ ] Elegir la librería de navegación.
- [ ] Decidir si Especialidades abre una pantalla aparte (como arriba) o filtra dentro de la misma pestaña.
- [ ] Decidir si el Detalle de cálculo ofrece "Abrir calculadora" con esos valores (funcionalidad futura; hoy el historial no se edita, D9).
- [ ] Diseño visual detallado de cada pantalla (se hace al implementar cada feature).
