# F01: Acceso y sesión

> Versión 0.1 (borrador). Backend: Firebase Authentication (D16). Decisión A1: acceso solo con correo y contraseña.

## Objetivo

Que el médico pueda usar la app de inmediato como invitado, o crear una cuenta e iniciar sesión para sincronizar su historial y favoritos, con la sesión guardada hasta que la cierre.

## Actor

Médico: invitado (sin cuenta) o usuario con cuenta.

## Precondiciones

- Registro, inicio de sesión y recuperación de contraseña requieren conexión.
- Usar la app como invitado no requiere cuenta ni conexión (P2).

## Datos de entrada

| Formulario | Campos |
|---|---|
| Crear cuenta | Correo, contraseña, confirmar contraseña |
| Iniciar sesión | Correo, contraseña |
| Recuperar contraseña | Correo |

## Flujo

**Primera vez (D1b):** al abrir la app por primera vez se muestra una bienvenida con tres botones: **Continuar sin cuenta**, **Iniciar sesión** y **Crear cuenta**. Se guarda `bienvenidaVista` en el teléfono; después la app abre directo en Inicio y el acceso queda en Perfil (F07).

**Crear cuenta:**
1. El usuario llena correo, contraseña y confirmación.
2. Los campos se validan al salir de cada uno (D12). El botón se activa con el formulario válido.
3. Se crea la cuenta en Firebase Authentication y se inicia sesión.
4. Si hay cálculos o favoritos locales de invitado, aparece el aviso único de D8.
5. La app va a Inicio.

**Iniciar sesión:** igual, sin confirmación de contraseña. Si ya existen datos locales de invitado, se aplica el aviso de D8.

**Recuperar contraseña:** desde Iniciar sesión, "¿Olvidaste tu contraseña?". El usuario escribe su correo y Firebase envía el enlace. La pantalla siempre responde "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña", sin confirmar si existe.

**Sesión persistente:** con cuenta, la sesión se conserva al cerrar y abrir la app hasta que el usuario cierre sesión (F07). Al abrir sin conexión con sesión previa, la app entra con esa sesión y las calculadoras funcionan; la sincronización espera a la conexión.

## Validaciones

| Campo | Regla |
|---|---|
| Correo | No vacío, formato de correo válido |
| Contraseña (registro) | Mínimo 8 caracteres (por validar), al menos una letra y un número |
| Confirmar contraseña | Igual a la contraseña |
| Contraseña (inicio de sesión) | No vacía |

Los mensajes de error aparecen debajo del campo y en español.

## Casos de error

| Situación | Mensaje |
|---|---|
| Correo ya registrado | "Ya existe una cuenta con este correo" |
| Credenciales incorrectas | "Correo o contraseña incorrectos" (mismo mensaje si el correo no existe, para no revelar cuentas) |
| Demasiados intentos | "Demasiados intentos. Intenta de nuevo en unos minutos" |
| Sin conexión | "Necesitas conexión para continuar. Puedes seguir usando la app sin cuenta" |
| Error inesperado | "Algo salió mal. Intenta de nuevo" |

## Resultado esperado

Con cuenta, el usuario entra a la app con su historial y favoritos. Como invitado, usa todo lo local sin fricción. La sesión sobrevive al reiniciar la app.

## Operaciones con Firebase (para la rúbrica)

| # | Operación | Servicio |
|---|---|---|
| 1 | Registrar usuario | Authentication |
| 2 | Iniciar sesión | Authentication |
| 3 | Cerrar sesión (F07) | Authentication |
| 4 | Enviar correo de recuperación | Authentication |

Las operaciones de datos (F04, F05) están en sus specs.

## Criterios de aceptación

- [ ] La bienvenida aparece solo la primera vez, con las tres opciones.
- [ ] "Continuar sin cuenta" lleva a Inicio y no vuelve a mostrar la bienvenida.
- [ ] El registro valida correo, contraseña y confirmación, con mensajes bajo cada campo.
- [ ] El inicio de sesión rechaza credenciales incorrectas con mensaje genérico.
- [ ] La recuperación de contraseña responde igual exista o no el correo.
- [ ] La sesión persiste al cerrar y abrir la app.
- [ ] Con datos locales de invitado, tras registrarse o iniciar sesión aparece una sola vez el aviso de D8.
- [ ] Sin conexión, los formularios muestran el mensaje de conexión y la app sigue usable como invitado.

## Tasks

- [ ] Funciones de dominio de validación (`validarCorreo`, `validarContrasena`) con pruebas.
- [ ] Configurar Firebase y Authentication en el proyecto.
- [ ] Pantalla de bienvenida y guardado de `bienvenidaVista`.
- [ ] Formularios de registro, inicio de sesión y recuperación.
- [ ] Persistencia de sesión.
- [ ] Mapeo de errores de Firebase a mensajes en español, con pruebas.
- [ ] Aviso de D8 (compartido con F04 y F05).
- [ ] Pruebas de integración: registro, inicio de sesión y error de credenciales.
- [ ] Probar los criterios de aceptación en iOS.

## Pendientes

- [ ] Decidir si se pide verificar el correo (fuera del MVP por ahora).
- [ ] Validar la regla de contraseña (mínimo y composición).
- [ ] Revisar pantallas de bienvenida con la paleta definitiva.
