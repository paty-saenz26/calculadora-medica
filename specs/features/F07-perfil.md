# F07: Perfil

> Versión 0.1 (borrador). Pestaña Perfil: estado de la cuenta, cerrar sesión e información de la app.

## Objetivo

Mostrar al usuario si está usando la app como invitado o con cuenta, permitirle iniciar sesión o cerrarla, y tener a la mano el aviso de apoyo clínico.

## Actor

Médico, invitado o con cuenta.

## Precondiciones

- Ninguna: la pantalla funciona sin conexión.

## Flujo

**Invitado:**
1. Se muestra un mensaje: "Estás usando la app sin cuenta. Tus cálculos y favoritos se guardan solo en este teléfono".
2. Botones **Iniciar sesión** y **Crear cuenta**, que abren los formularios de F01.
3. Se explica en una línea que con cuenta se sincronizan historial y favoritos.

**Con cuenta:**
1. Se muestra el correo de la cuenta.
2. Botón **Cerrar sesión**: abre un diálogo del sistema "¿Cerrar sesión?" con **Cancelar** y **Cerrar sesión**.
3. Al confirmar, se cierra la sesión y la app queda como invitado (con sus datos locales de invitado, si los tenía).

**En ambos casos**, al final de la pantalla: aviso de apoyo clínico (P9), versión de la app y fuentes de las calculadoras.

## Reglas

- Cerrar sesión no borra los cálculos y favoritos locales del modo invitado ni los de la nube (D8).
- Al cerrar sesión, los datos de la cuenta que estaban en el teléfono dejan de mostrarse.
- Si hay operaciones pendientes de sincronizar (D6), el diálogo advierte: "Tienes N cambios sin sincronizar. Si cierras sesión ahora se perderán". El usuario decide.
- Sin conexión, cerrar sesión funciona con normalidad.

## Validaciones

No hay formularios en esta pantalla.

## Casos de error

| Situación | Comportamiento |
|---|---|
| Falla al cerrar sesión | Mensaje "No pudimos cerrar tu sesión. Intenta de nuevo" y se conserva la sesión |
| Sesión expirada o revocada | Se regresa a modo invitado con el aviso "Tu sesión terminó. Inicia sesión de nuevo" |

## Resultado esperado

El usuario sabe en qué modo está, puede cambiar de modo con pocos toques y no pierde datos por accidente.

## Criterios de aceptación

- [ ] Invitado: se muestra el mensaje y los botones Iniciar sesión y Crear cuenta.
- [ ] Con cuenta: se muestra el correo y el botón Cerrar sesión.
- [ ] Cerrar sesión pide confirmación y respeta Cancelar.
- [ ] Con operaciones pendientes, el diálogo muestra la advertencia con su número.
- [ ] Tras cerrar sesión, la app queda como invitado y la sesión no vuelve al reiniciar.
- [ ] El aviso de apoyo clínico, la versión y las fuentes aparecen en ambos modos.

## Tasks

- [ ] Pantalla Perfil con las dos variantes (invitado y con cuenta).
- [ ] Cerrar sesión con confirmación y manejo de pendientes.
- [ ] Limpiar el estado de la cuenta al cerrar sesión.
- [ ] Pruebas de integración: cierre de sesión y cambio a modo invitado.
- [ ] Probar los criterios de aceptación en iOS.

## Pendientes

- [ ] Eliminar cuenta: si la app llegara a publicarse en la App Store, Apple pide ofrecerla cuando se permite crear cuentas (verificar la regla vigente). Fuera del MVP.
- [ ] Decidir qué se muestra en Fuentes (lista por calculadora o enlace al detalle).
- [ ] Modo oscuro (futuro).
