# F02: Catálogo y búsqueda

> Versión 0.1 (borrador). Pantalla de Inicio: lista de calculadoras, búsqueda y pestañas.

## Objetivo

Que el médico llegue a la calculadora que necesita en pocos toques, ya sea buscándola por nombre o recorriendo Recientes, Favoritas, Especialidades o Todas.

## Actor

Médico, invitado o con cuenta.

## Precondiciones

- La app está abierta. No requiere cuenta ni conexión (P2): el catálogo vive en el código.

## Datos de entrada

| Entrada | Detalle |
|---|---|
| Texto de búsqueda | Texto libre, opcional |
| Pestaña | Recientes, Favoritas, Especialidades, Todas |
| Especialidad | Selección dentro de la pestaña Especialidades |

## Flujo

1. Al abrir Inicio se ve la barra de búsqueda arriba y las pestañas debajo. La pestaña inicial es **Recientes** si el usuario tiene historial; si no, **Todas**.
2. **Búsqueda:** al escribir, la lista se filtra en vivo sobre todo el catálogo (sin importar la pestaña) y las pestañas se ocultan mientras haya texto. Al borrar el texto se regresa a la pestaña anterior.
3. **Recientes:** calculadoras con al menos un cálculo en el historial, ordenadas por fecha del último cálculo, sin repetir (D10).
4. **Favoritas:** calculadoras marcadas con estrella (F04), ordenadas de la más recientemente marcada a la más antigua.
5. **Especialidades:** lista de especialidades con el número de calculadoras; al tocar una se ve su lista. Una calculadora puede aparecer en varias.
6. **Todas:** todo el catálogo en orden alfabético.
7. Tocar una calculadora abre su pantalla (F03).

## Reglas de búsqueda

- No distingue mayúsculas ni acentos ("creatinina" encuentra "Creatinina"; "pam" encuentra "Presión arterial media").
- Busca en nombre, siglas o nombres alternos (por ejemplo "PAM", "MAP", "Cockcroft", "IMC", "BSA") y en la descripción corta.
- Los resultados se ordenan primero por coincidencia en el nombre y luego en el resto.
- Cada fila muestra nombre, descripción corta y la estrella de favorito (F04).

## Validaciones

- El texto de búsqueda se recorta de espacios al inicio y al final; no tiene longitud mínima.

## Casos de error y estados vacíos

| Situación | Comportamiento |
|---|---|
| Búsqueda sin resultados | "No encontramos calculadoras para «texto»" y sugerencia de revisar la ortografía |
| Recientes sin historial | "Aún no has calculado nada. Tus calculadoras recientes aparecerán aquí" y botón que lleva a Todas |
| Favoritas vacías | "Toca la estrella de una calculadora para tenerla aquí" |
| Con cuenta y sin conexión | El catálogo funciona normal. Recientes y Favoritas muestran lo que hay en el teléfono |

## Resultado esperado

El médico llega a la calculadora deseada en dos toques o menos desde Recientes o Favoritas, y buscando por nombre en tres (toque en búsqueda, texto, toque en resultado).

## Criterios de aceptación

- [ ] La búsqueda filtra en vivo, ignora mayúsculas y acentos, y encuentra por siglas y nombres alternos.
- [ ] Las cuatro pestañas funcionan como se describe y se ocultan mientras hay texto de búsqueda.
- [ ] Recientes se deriva del historial, sin repeticiones y sin calculadoras sin cálculo guardado (D10).
- [ ] Borrar de historial todos los cálculos de una calculadora la quita de Recientes.
- [ ] Todos los estados vacíos muestran su mensaje.
- [ ] Todo el catálogo es accesible sin conexión y sin cuenta.
- [ ] Los controles tienen tamaño suficiente para uso con una mano (P4).

## Tasks

- [x] Agregar `palabrasClave` (siglas y nombres alternos) a la definición de calculadora en `02-data-model.md`.
- [x] Escribir la función de dominio `buscarCalculadoras(catalogo, texto)` con normalización de acentos y pruebas.
- [x] Escribir las funciones que derivan Recientes y Favoritas con pruebas.
- [ ] Pantalla Inicio con barra de búsqueda y pestañas.
- [ ] Vista de Especialidades y su lista.
- [ ] Estados vacíos.
- [ ] Probar los criterios de aceptación.

## Pendientes

- [ ] Lista de especialidades definitiva (cardiovascular, renal, medicina general, nutrición, otras).
- [ ] Decidir si Recientes tiene un máximo de elementos.
- [ ] Decidir si se muestra la fecha del último cálculo en Recientes.
