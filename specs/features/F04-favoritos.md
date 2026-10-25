# F04: Favoritos

> Versión 0.1 (borrador). Depende de la decisión de backend para la parte de sincronización.

## Objetivo

Que el médico marque con una estrella las calculadoras que usa más, para tenerlas a la mano en la pestaña Favoritas.

## Actor

Médico, invitado o con cuenta.

## Precondiciones

- Ninguna para invitado (guardado local).
- Con cuenta, la sincronización requiere conexión; sin ella el cambio queda pendiente (P2, D6).

## Datos de entrada

| Entrada | Detalle |
|---|---|
| Calculadora | Se marca o desmarca desde la fila del catálogo o desde el encabezado de su pantalla |

## Flujo

1. El usuario toca la estrella de una calculadora. La estrella se llena y el cambio se ve de inmediato.
2. Se guarda un Favorito (calculadora + fecha de marcado), según `02-data-model.md`.
3. Al tocar otra vez la estrella llena, se quita el favorito.
4. La pestaña Favoritas (F02) refleja el cambio, con la más reciente primero.

## Reglas

- Un favorito es una calculadora, no un resultado (D3).
- Una calculadora solo puede estar una vez en favoritos.
- **Invitado:** se guarda solo en el teléfono.
- **Con cuenta:** la nube es la fuente de verdad (D6). Se actualiza la interfaz al instante y se sincroniza en segundo plano; sin conexión, la operación queda en la cola de pendientes y se reintenta al volver la conexión.
- Al crear cuenta o iniciar sesión, los favoritos locales entran en el aviso único de D8.
- Cerrar sesión no borra los favoritos del teléfono del invitado, y no muestra los de la cuenta.

## Validaciones

- No se puede marcar una calculadora que ya no existe en el catálogo (por ejemplo, favorito en la nube de una calculadora que una versión futura retire): se ignora al mostrar.

## Casos de error

| Situación | Comportamiento |
|---|---|
| Falla la sincronización | El cambio queda visible, se reintenta en segundo plano y no se interrumpe al usuario |
| Favorito en la nube de una calculadora desconocida | No se muestra y no genera error |
| Doble toque rápido | Se interpreta como un solo cambio de estado por toque, sin duplicados |

## Resultado esperado

Marcar o desmarcar es instantáneo y se conserva al cerrar la app y, con cuenta, al cambiar de teléfono.

## Criterios de aceptación

- [ ] La estrella aparece en la fila del catálogo y en la pantalla de la calculadora, y ambas muestran el mismo estado.
- [ ] Marcar y desmarcar actualizan Favoritas de inmediato.
- [ ] Los favoritos persisten al cerrar y abrir la app.
- [ ] Sin cuenta, los favoritos no salen del teléfono.
- [ ] Con cuenta y sin conexión, el cambio se aplica y se sincroniza al volver la conexión.
- [ ] No hay favoritos duplicados.

## Tasks

- [ ] Funciones de dominio `alternarFavorito` y orden de favoritos, con pruebas.
- [ ] Almacenamiento local de favoritos (AsyncStorage).
- [ ] Estado global de favoritos.
- [ ] Componente estrella reutilizable.
- [ ] Sincronización con la nube y cola de pendientes (cuando se defina el backend).
- [ ] Probar los criterios de aceptación.

## Pendientes

- [ ] Estructura en la nube (depende de la decisión Firebase o API REST).
- [ ] Decidir si se permite reordenar manualmente las favoritas (fuera del MVP por ahora).
