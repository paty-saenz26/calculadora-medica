# Feature F03: Calculadora con resultado en vivo

> Versión 0.1 (borrador). Es el molde de todas las calculadoras: cada una (C01, C02, ...) solo aporta su definición y sus casos de prueba. Referencias: constitución P1, P4, P5, P6, P7; `02-data-model.md` (Calculadora, Campo, Resultado); decisiones D4, D5, D11, D12 y D13.

## Objetivo

Permitir que el médico capture los datos de una calculadora y vea el resultado al instante, sin botón "Calcular", con validación que impida resultados erróneos.

## Actor

Médico (invitado o con cuenta). No requiere sesión ni conexión.

## Precondiciones

- La calculadora existe en el catálogo y tiene su definición (campos, rangos, fórmula e interpretación).
- El usuario llegó desde el catálogo (Stack: Inicio → Calculadora).

## Datos de entrada

Los campos que defina cada calculadora, de tres tipos:

- **Número**: valor con unidad (posiblemente alternable), rango válido y, si aplica, rango normal informativo.
- **Opción**: una selección entre varias, con o sin puntos.
- **Sí/No**: respuesta binaria, con o sin puntos; puede definir un valor inicial.

Cualquier campo puede ser opcional; cómo afecta al cálculo lo define la spec de cada calculadora.

## Flujo principal

1. El usuario abre una calculadora.
2. El sistema muestra su nombre, una descripción breve y todos los campos. La barra de resultado, fija abajo, indica qué campos obligatorios faltan; los campos con valor inicial definido (por ejemplo, un sí/no que inicia en "No") no cuentan como pendientes.
3. El usuario captura o selecciona los valores. Los campos numéricos abren el teclado numérico.
4. Al terminar de editar un campo numérico, el sistema valida su valor contra el rango válido.
5. Mientras falte algún campo obligatorio o haya un valor inválido, la barra no muestra resultado.
6. Cuando todos los campos obligatorios están completos y son válidos, la barra muestra el resultado, su unidad (si aplica) y su interpretación.
7. Si el usuario cambia cualquier campo, el resultado se actualiza de inmediato, o se oculta si el cambio deja la calculadora incompleta o inválida.
8. Si el usuario cambia la unidad de un campo con valor, el sistema convierte el valor a la nueva unidad y lo revalida con el rango de esa unidad.
9. Al salir de la pantalla con un resultado válido, el sistema dispara el guardado en el historial (comportamiento definido en F05).

## Validaciones

- Los campos obligatorios deben tener valor.
- Los campos numéricos aceptan solo números, con **punto** como separador decimal. La coma y otros caracteres no se aceptan al escribir.
- Cada valor debe estar dentro del **rango válido** del campo, en la unidad seleccionada. El rango normal es solo informativo y nunca bloquea.
- Un campo opcional vacío no impide mostrar el resultado.
- Las **reglas entre campos** de la calculadora (por ejemplo, diastólica menor que sistólica) se evalúan cuando los campos involucrados tienen valor. Si no se cumplen, se muestra el mensaje de la regla bajo el campo que el usuario terminó de editar y no hay resultado.

## Casos de error

- **Datos incompletos**: la barra muestra "Falta:" seguido de los nombres de los campos obligatorios pendientes (D11). Nunca se muestra un resultado parcial.
- **Valor fuera de rango**: al terminar de editar el campo aparece un mensaje bajo el campo con el rango aceptado (D12). Mientras se escribe no se muestra error. Mientras el valor sea inválido, no hay resultado.
- **Campo borrado**: si el usuario vacía un campo obligatorio, el resultado desaparece y el campo vuelve a la lista de faltantes.

## Resultado esperado

Una barra de resultado fija en la parte inferior, siempre visible al desplazar el formulario, que muestra el estado actual: campos faltantes, valores por corregir o el resultado con su interpretación. Debajo o junto al resultado se muestran la fuente de referencia y el aviso de que la herramienta es apoyo clínico (P9).

## Criterios de aceptación

- [ ] Al abrir una calculadora se muestran todos sus campos y no existe un botón "Calcular".
- [ ] Al abrir, la barra lista todos los campos obligatorios que no tienen valor inicial.
- [ ] Un campo sí/no con valor inicial (por ejemplo "No") aparece ya seleccionado y el usuario puede cambiarlo.
- [ ] Todo campo con unidades alternables muestra siempre el botón para cambiar la unidad.
- [ ] Al llenar el último campo obligatorio con un valor válido, el resultado aparece sin ninguna otra acción.
- [ ] Mientras falte un campo obligatorio no se muestra ningún resultado, ni parcial, y la lista de faltantes se reduce a medida que se llenan.
- [ ] Un valor fuera del rango válido muestra su error al salir del campo, no mientras se escribe, y no hay resultado hasta corregirlo.
- [ ] Al corregir el valor, el error desaparece y el resultado se recalcula.
- [ ] Si se incumple una regla entre campos (por ejemplo, diastólica mayor o igual que sistólica), se muestra su mensaje al terminar de editar y no hay resultado hasta corregirlo.
- [ ] Cambiar cualquier campo con resultado visible actualiza el resultado de inmediato.
- [ ] Los campos numéricos usan teclado numérico y aceptan solo el punto como separador decimal.
- [ ] Al cambiar la unidad de un campo con valor, el valor se convierte (por ejemplo, 120 mg/dL se muestra con su equivalente en mmol/L, coincidiendo con el valor de referencia de las pruebas).
- [ ] Al cambiar de unidad y volver a la original sin editar el campo, se restaura el valor exacto que el usuario había escrito.
- [ ] Tras cambiar de unidad, el valor se revalida con el rango válido de la nueva unidad.
- [ ] Un campo opcional vacío no impide mostrar el resultado.
- [ ] La barra de resultado permanece visible al desplazar el formulario.
- [ ] Se muestran la fuente y el aviso de apoyo clínico.
- [ ] Al salir con resultado válido se dispara el guardado; sin resultado válido no se guarda nada.
- [ ] Todo funciona sin conexión y sin cuenta.

## Tasks

- [ ] Definir los tipos `Calculadora`, `Campo` y `Resultado` en TypeScript, según `02-data-model.md`.
- [ ] Crear la función pura de validación de un campo (obligatorio, rango válido, formato) y de las reglas entre campos, con sus pruebas.
- [ ] Crear la función pura de conversión de unidades y sus pruebas.
- [ ] Crear la función pura que evalúa el estado de una calculadora (faltantes, inválidos o resultado) y sus pruebas.
- [ ] Crear los componentes de campo: número, opción y sí/no.
- [ ] Crear la pantalla de calculadora que dibuja el formulario a partir de la definición.
- [ ] Crear la barra de resultado fija con sus tres estados (faltantes, por corregir, resultado).
- [ ] Implementar el cambio de unidad conservando el valor original escrito.
- [ ] Conectar el disparo de guardado al salir de la pantalla (se completa con F05).
- [ ] Probar los criterios de aceptación.

## Pendientes de esta spec
- [ ] Decimales mostrados al convertir unidades (se define por campo en cada calculadora).
- [ ] Posición y formato exactos del aviso clínico y la fuente (se definen con el diseño visual).
- [ ] Qué hacer si el teclado del dispositivo ofrece coma en lugar de punto (regiones con coma decimal): verificar en pruebas con un iPhone en región México.
