# F05: Historial (CRUD)

> Versión 0.1 (borrador). Entidad principal del CRUD de la rúbrica: **CálculoGuardado**. Decisiones: B1 (sin duplicados) y confirmación antes de eliminar.

## Objetivo

Guardar automáticamente los cálculos que hace el médico, mostrarlos en una lista paginada y permitir agregar una nota, compartirlos y eliminarlos.

## Actor

Médico, invitado (guardado local) o con cuenta (nube, D6).

## Precondiciones

- Para guardar, debe haber un resultado válido al salir de la pantalla de la calculadora (D4).
- Con cuenta y sin conexión, las operaciones se encolan y se sincronizan al volver la conexión.

## CRUD

| Operación | Cómo |
|---|---|
| **Crear** | Automático al salir de la calculadora con resultado válido |
| **Leer** | Lista paginada en la pestaña Historial y pantalla de detalle |
| **Actualizar** | Solo la nota (D2); el resto del cálculo no cambia (D9) |
| **Eliminar** | Desde la lista o el detalle, con confirmación |

## Flujo

**Crear (guardado automático):**
1. El usuario abre una calculadora y captura datos.
2. Al salir de la pantalla (regresar, cambiar de pestaña o cerrar), si hay resultado válido, se guarda un CálculoGuardado: calculadora y su versión, valores con la unidad ingresada, resultado e interpretación, y fecha (D9).
3. **Sin duplicados (B1):** en una visita se guarda un solo registro, con el estado final al salir. Si los valores, unidades y versión son idénticos al último cálculo guardado de esa calculadora, no se crea otro.
4. Si al salir no hay resultado válido, no se guarda nada (R1).

**Leer (lista):**
1. La pestaña Historial muestra los cálculos de más reciente a más antiguo.
2. Cada fila muestra nombre de la calculadora, resultado, fecha y un ícono si tiene nota.
3. Carga de 20 en 20: al llegar cerca del final se piden los siguientes (scroll infinito). Se muestra un indicador al cargar.
4. Jalar hacia abajo actualiza la lista.
5. Tocar una fila abre el detalle: valores con unidades, resultado, interpretación, fuente, fecha y nota, con botones **Compartir** (F06), **Nota** y **Eliminar**.

**Actualizar la nota:**
1. En el detalle, "Agregar nota" o "Editar nota" abre un modal con un campo de texto y el aviso "No escribas nombres ni datos de pacientes".
2. Máximo **200 caracteres**, con contador. Una nota vacía la elimina.
3. Al guardar se cierra el modal y el detalle y la lista reflejan el cambio.

**Eliminar:**
1. El usuario toca el ícono de borrar en la fila o "Eliminar" en el detalle.
2. Aparece un diálogo del sistema "¿Eliminar este cálculo?" con "Esta acción no se puede deshacer" y dos botones: **Cancelar** y **Eliminar**.
3. Con **Eliminar** se borra y desaparece de la lista; con **Cancelar** no pasa nada.
4. Al borrar el último cálculo de una calculadora, esta sale de Recientes (D10).

## Validaciones

- La nota: máximo 200 caracteres; se recortan espacios al inicio y al final.
- Solo se guarda un cálculo cuyo resultado es válido y completo (D11).

## Casos de error y estados vacíos

| Situación | Comportamiento |
|---|---|
| Historial vacío | "Aún no tienes cálculos. Cuando calcules algo se guardará aquí" y botón a Inicio |
| Falla la carga de la lista | Mensaje "No pudimos cargar tu historial" con botón "Reintentar"; lo ya cargado se conserva |
| Falla la carga de más elementos | Aviso al final de la lista con "Reintentar" |
| Sin conexión con cuenta | La lista muestra lo disponible en el teléfono; guardar, editar nota y eliminar quedan encolados |
| Falla la sincronización de una operación | Se reintenta en segundo plano; no se interrumpe al usuario |
| Eliminar un cálculo que ya no existe en la nube | Se quita de la lista sin error |

## Resultado esperado

El historial se llena solo con cálculos útiles, sin repetidos, y el médico puede revisarlos, anotarlos y borrarlos con pocos toques.

## Estructura en Firebase y operaciones (para la rúbrica)

Colección `usuarios/{uid}/calculos/{id}` con los campos de CálculoGuardado. Reglas de seguridad: solo el dueño (`request.auth.uid == uid`) lee y escribe (R6).

| # | Operación | Servicio |
|---|---|---|
| 5 | Crear cálculo | Firestore |
| 6 | Listar cálculos paginados (orden por fecha, cursor) | Firestore |
| 7 | Actualizar nota | Firestore |
| 8 | Eliminar cálculo | Firestore |

## Criterios de aceptación

- [ ] Salir de una calculadora con resultado válido crea un cálculo; sin resultado válido no crea nada.
- [ ] Volver a una calculadora con los mismos valores que el último guardado no crea un duplicado.
- [ ] La lista se ordena por fecha descendente y carga de 20 en 20.
- [ ] El detalle muestra valores con las unidades ingresadas, resultado, interpretación, fuente y nota.
- [ ] La nota se puede agregar, editar y quitar, con máximo de 200 caracteres y su aviso.
- [ ] Eliminar pide confirmación y respeta Cancelar.
- [ ] Un cálculo eliminado deja de aparecer en el historial y en Recientes.
- [ ] Invitado: todo funciona sin conexión y sin salir del teléfono.
- [ ] Con cuenta: los cambios se sincronizan, y sin conexión se encolan y se aplican al reconectar.
- [ ] Todos los estados vacíos y de error muestran su mensaje.

## Tasks

- [ ] Actualizar `02-data-model.md` (nota de 200 caracteres, regla de no duplicados, estructura en Firebase).
- [ ] Función de dominio `esDuplicado(nuevo, ultimo)` con pruebas.
- [ ] Función de dominio `validarNota` con pruebas.
- [ ] Almacenamiento local del historial (AsyncStorage) para invitado.
- [ ] Servicio de Firestore para crear, listar, actualizar nota y eliminar.
- [ ] Cola de operaciones pendientes y reintento.
- [ ] Guardado automático al salir de la calculadora.
- [ ] Pantalla Historial con FlatList paginada, pull to refresh y estados vacíos y de error.
- [ ] Pantalla de detalle y modal de nota.
- [ ] Confirmación de eliminar.
- [ ] Pruebas de integración: guardado automático, sin duplicados, editar nota y eliminar.
- [ ] Probar los criterios de aceptación en iOS.

## Pendientes

- [ ] Decidir si se agrega filtro o búsqueda en el historial (fuera del MVP).
- [ ] Definir el formato exacto de fecha en la lista (relativa o completa).
- [ ] Decidir cómo se resuelve un conflicto si se edita la misma nota en dos teléfonos (por ahora gana la última escritura).
