# F06: Compartir resultado

> Versión 0.1 (borrador). Feature nativa del proyecto (menú de compartir del sistema). Diseño visual de la tarjeta pendiente de la paleta.

## Objetivo

Que el médico envíe el resultado de un cálculo (por ejemplo a un colega por mensaje) como una tarjeta en imagen o como texto, sin datos de pacientes.

## Actor

Médico, invitado o con cuenta.

## Precondiciones

- Hay un resultado válido: en la pantalla de la calculadora (F03) o en el detalle de un cálculo del historial (F05).
- No requiere cuenta ni conexión para generar el contenido.

## Datos de entrada

| Entrada | Detalle |
|---|---|
| Cálculo a compartir | Calculadora, valores con unidad, resultado, interpretación |
| Formato | Imagen (principal) o texto |

## Flujo

1. El usuario toca "Compartir" junto al resultado. Se abre un **modal** con la vista previa de la tarjeta (D7).
2. Botón principal **"Compartir imagen"**: se genera la imagen de la tarjeta y se abre el menú de compartir del sistema.
3. Botón secundario **"Compartir texto"**: se abre el menú de compartir del sistema con el resultado en texto.
4. Al terminar o cancelar, se cierra el menú y se regresa al modal; "Cerrar" regresa a la pantalla anterior.

## Contenido

**Tarjeta (imagen):** banda de color superior con el nombre de la calculadora, cuerpo con valores de entrada (con unidades), resultado en grande y su interpretación, y pie discreto con la fuente y el nombre de la app. Es un diseño propio, inspirado solo en la distribución general de las tarjetas de otras apps.

**Texto:**

```
Presión arterial media (PAM)
PAS 120 mm Hg · PAD 80 mm Hg
Resultado: 93 mm Hg
Fuente: StatPearls
Calculadora Médica
```

(El formato exacto se define en la implementación a partir de este ejemplo.)

## Reglas

- **La nota del historial nunca se incluye** (P3, D7).
- No se incluyen nombre del usuario, correo ni datos identificables.
- Los valores aparecen con la unidad con la que se capturaron (D9).
- Si se comparte desde el historial, se usa la foto guardada del cálculo (D9), no se recalcula con la versión actual.
- Incluye la fuente de la calculadora; el aviso de apoyo clínico va en la app, no ocupa la tarjeta.

## Validaciones

- El botón "Compartir" no aparece (o está desactivado) mientras no haya resultado válido (P6, D11).

## Casos de error

| Situación | Comportamiento |
|---|---|
| El usuario cancela el menú de compartir | No es un error: se queda en el modal sin mensaje |
| Falla la generación de la imagen | Mensaje "No pudimos crear la imagen. Puedes compartir el resultado como texto" y se ofrece el texto |
| El sistema no puede compartir | Mensaje claro y el botón de texto sigue disponible |

## Resultado esperado

El destinatario recibe un resumen legible del cálculo, sin información personal ni nota.

## Criterios de aceptación

- [ ] Con resultado válido aparece "Compartir"; sin él, no.
- [ ] El modal muestra la vista previa y dos opciones: imagen (principal) y texto.
- [ ] La imagen y el texto contienen calculadora, valores con unidad, resultado, interpretación y fuente.
- [ ] La nota nunca aparece en ninguno de los dos formatos.
- [ ] Desde el historial se comparte lo guardado, sin recalcular.
- [ ] Cancelar el menú no genera errores.
- [ ] Probado en iOS.

## Tasks

- [ ] Función de dominio `armarTextoCompartir(calculo)` con pruebas (incluida la ausencia de la nota).
- [ ] Componente de tarjeta (con la paleta definida).
- [ ] Captura de la tarjeta como imagen (`react-native-view-shot`).
- [ ] Integración con `expo-sharing` y con la Share API para texto.
- [ ] Modal de vista previa.
- [ ] Manejo de errores.
- [ ] Probar los criterios de aceptación en iOS.

## Pendientes

- [ ] Diseño visual definitivo de la tarjeta (depende de paleta y nombre).
- [ ] Formato final del texto.
- [ ] Confirmar con el docente si una sola feature nativa basta para la rúbrica.
