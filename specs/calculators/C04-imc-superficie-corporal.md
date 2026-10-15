# Calculadora C04: IMC y superficie corporal

> Versión 0.1 (borrador). Hereda el comportamiento general de `F03-calculadora-en-vivo.md`; aquí solo va lo propio de esta calculadora. Las fórmulas y los puntos de corte de esta spec **no se pudieron verificar en texto de fuente durante su redacción** (las búsquedas solo devolvieron títulos de páginas): provienen de las referencias clásicas citadas y deben contrastarse con ellas, y con un médico, antes de dar la spec por buena.

## Objetivo

Calcular, con peso y talla, el índice de masa corporal (IMC) y la superficie corporal (SC), para categorizar el peso y apoyar el cálculo de dosis de medicamentos que se ajustan por superficie corporal.

## Actor

Médico (invitado o con cuenta), en pacientes **adultos**.

## Fuentes (por validar)

- **IMC:** peso (kg) entre talla (m) al cuadrado. Categorías para adultos: Organización Mundial de la Salud, *Obesity: preventing and managing the global epidemic*, WHO Technical Report Series 894, 2000.
- **Superficie corporal (Mosteller):** Mosteller RD. *Simplified calculation of body-surface area*. N Engl J Med 1987;317(17):1098.
- **Alternativa (Du Bois):** Du Bois D, Du Bois EF. *A formula to estimate the approximate surface area if height and weight be known*. Arch Intern Med 1916;17:863-71.

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C04-1 | Fórmula de SC | **Propuesta pendiente de confirmar:** Mosteller, por ser la más simple y de uso muy extendido. Du Bois queda como futura (selector de fórmula) |
| C04-2 | Una calculadora, dos resultados | IMC y SC se calculan y se muestran juntos, con los mismos dos campos |
| C04-3 | Unidades | Peso: kg ⇄ lb. Talla: cm ⇄ pulgadas. Por defecto kg y cm (D14) |
| C04-4 | Redondeo | IMC con 1 decimal; SC con 2 decimales. La categoría se decide con el IMC **ya redondeado**, para que lo mostrado y la categoría no se contradigan |
| C04-5 | Población | Solo adultos. Para niños la categoría del IMC se basa en percentiles y queda fuera del MVP; la spec muestra una nota |

## Campos

| ID | Etiqueta | Tipo | Unidades (base primero) | Rango válido (por validar) | Obligatorio |
|---|---|---|---|---|---|
| `peso` | Peso | Número, 1 decimal | kg, lb | 20 a 300 kg (equivalente en lb) | Sí |
| `talla` | Talla | Número, 1 decimal | cm, in | 100 a 250 cm (equivalente en in) | Sí |

- Los rangos válidos se definen en la unidad base y se convierten a la unidad seleccionada.
- Sin pista de valor esperado: no hay un "normal" útil para peso y talla de adultos en general (**pendiente**: valorar con un médico).

## Reglas entre campos

Ninguna.

## Fórmulas

Con peso en kg y talla en cm:

```
IMC = peso / (talla / 100)²                    [kg/m²]
SC  = raíz cuadrada( talla × peso / 3600 )     [m², Mosteller]
```

## Redondeo

- IMC: 1 decimal (ejemplo: 22.857 se muestra como 22.9).
- SC: 2 decimales (ejemplo: 1.8446 se muestra como 1.84).

## Interpretación (por validar con un médico)

Categoría de IMC en adultos, sobre el valor mostrado:

| IMC mostrado | Categoría |
|---|---|
| Menor de 18.5 | Bajo peso |
| 18.5 a 24.9 | Peso normal |
| 25.0 a 29.9 | Sobrepeso |
| 30.0 a 34.9 | Obesidad grado I |
| 35.0 a 39.9 | Obesidad grado II |
| 40.0 o más | Obesidad grado III |

Nota visible: "Categorías para adultos. En menores de 18 años el IMC se interpreta con percentiles. El IMC no distingue masa muscular de grasa."

La superficie corporal se muestra sin categoría: solo el valor en m².

## Casos de prueba (cálculo manual, para pruebas unitarias)

| Peso | Talla | IMC (sin redondear) | IMC mostrado | Categoría | SC mostrada |
|---|---|---|---|---|---|
| 70 kg | 175 cm | 22.857 | 22.9 | Peso normal | 1.84 |
| 60 kg | 160 cm | 23.438 | 23.4 | Peso normal | 1.63 |
| 100 kg | 170 cm | 34.602 | 34.6 | Obesidad grado I | 2.17 |
| 50 kg | 165 cm | 18.365 | 18.4 | Bajo peso | 1.51 |
| 85 kg | 180 cm | 26.235 | 26.2 | Sobrepeso | 2.06 |
| 53.4 kg | 170 cm | 18.478 | 18.5 | Peso normal (por usar el valor redondeado) | 1.59 |

Casos de conversión de unidades (para pruebas de D13):

| Entrada | Se convierte a | Nota |
|---|---|---|
| Peso 70 kg | 154.3 lb | Ida y vuelta sin editar restaura 70 |
| Talla 175 cm | 68.9 in | Ida y vuelta sin editar restaura 175 |

El resultado con las unidades alternas debe coincidir con el de las unidades base.

Casos de error:

| Entrada | Esperado |
|---|---|
| Peso vacío | "Falta: Peso", sin resultado |
| Talla 50 cm | Error de rango en talla, sin resultado |
| Peso 500 kg | Error de rango en peso, sin resultado |

## Criterios de aceptación

- [ ] El formulario muestra Peso (kg) y Talla (cm) con botón de flechas para cambiar a lb y pulgadas.
- [ ] Con ambos campos válidos aparecen IMC, categoría y SC sin ninguna otra acción.
- [ ] Todos los casos de prueba producen los valores indicados, también con las unidades alternas.
- [ ] La categoría se decide con el IMC redondeado (caso 53.4 kg y 170 cm: 18.5, peso normal).
- [ ] Un valor fuera del rango válido muestra error al salir del campo y no hay resultado.
- [ ] Se muestran la fuente y la nota de interpretación.
- [ ] La SC se muestra sin categoría.

## Tasks

- [ ] Escribir la definición de la calculadora (campos, unidades con factores de conversión, fórmulas, categorías).
- [ ] Escribir las funciones `calcularImc` y `calcularSuperficieCorporal` y sus pruebas con la tabla de casos.
- [ ] Escribir las pruebas de conversión de unidades y de rangos válidos.
- [ ] Registrar la calculadora en el catálogo (especialidades: medicina general, nutrición).
- [ ] Probar los criterios de aceptación.

## Pendientes

- [ ] Confirmar la fórmula de SC (C04-1) y validarla contra el artículo original.
- [ ] Verificar los puntos de corte del IMC contra el documento de la OMS.
- [ ] Validar con un médico los rangos válidos y la nota.
- [ ] Decidir si en el futuro se agrega un selector de fórmula de SC (Du Bois, Haycock) y cómo se explica la diferencia.
