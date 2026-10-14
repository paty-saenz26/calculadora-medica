# Calculadora C03: Aclaramiento de creatinina (Cockcroft-Gault)

> Versión 0.1 (borrador). Hereda el comportamiento general de `F03-calculadora-en-vivo.md`; aquí solo va lo propio de esta calculadora. Los valores marcados como **por validar** deben revisarse con un médico y contra la fuente original antes de dar la spec por buena.

## Objetivo

Estimar el aclaramiento de creatinina (en mL/min) a partir de la edad, el sexo, el peso y la creatinina sérica, para apoyar el ajuste de dosis de fármacos de eliminación renal.

## Actor

Médico (invitado o con cuenta), en pacientes adultos.

## Fuentes

- **Fórmula original:** Cockcroft DW, Gault MH. *Prediction of creatinine clearance from serum creatinine*. Nephron 1976;16:31-41. **Por validar:** consultar el artículo original; en esta etapa la fórmula se verificó en apéndices de protocolos de ensayos clínicos de ClinicalTrials.gov que la reproducen y citan el artículo (por ejemplo, https://cdn.clinicaltrials.gov/large-docs/92/NCT03383692/Prot_SAP_000.pdf).
- **Uso clínico (ajuste de dosis en adultos):** *Taber's Cyclopedic Medical Dictionary*, entrada "Cockcroft-Gault formula".
- **Conversión de creatinina:** 1 mg/dL = 88.4 µmol/L (los protocolos citados usan el factor 0.0113, equivalente a 1/88.4). **Por validar** con una fuente de unidades de laboratorio.

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C03-1 | Peso | Se usa únicamente el peso real capturado. No hay campo de talla ni variantes de peso (ideal o ajustado) en el MVP; quedan como funcionalidad futura |
| C03-2 | Unidades | Peso: kg ⇄ lb. Creatinina: mg/dL ⇄ µmol/L. El usuario cambia la unidad con el botón de flechas (D13: el valor se convierte). Unidades por defecto (confirmado): **kg** y **mg/dL** |
| C03-3 | Redondeo | Resultado como número entero (mL/min), igual que la PAM (confirmado) |

## Campos

| ID | Etiqueta | Tipo | Unidades (base primero) | Rango válido (por validar) | Obligatorio |
|---|---|---|---|---|---|
| `sexo` | Sexo | Opción: Mujer / Hombre, sin selección inicial | — | — | Sí |
| `edad` | Edad | Número entero | años | 18 a 120 | Sí |
| `peso` | Peso | Número, 1 decimal | kg, lb | 20 a 300 kg (equivalente en lb) | Sí |
| `creatinina` | Creatinina sérica | Número, 2 decimales en mg/dL y 0 decimales en µmol/L | mg/dL, µmol/L | 0.2 a 20 mg/dL (equivalente en µmol/L) | Sí |

- Los rangos válidos se definen en la unidad base y se convierten automáticamente a la unidad seleccionada.
- El mínimo de creatinina es mayor que cero para evitar una división entre cero.
- **Pista de valor esperado:** edad y peso no tienen un "valor normal" útil, así que no llevan pista. Para la creatinina **no hay un único rango**: las fuentes consultadas difieren según población, método de laboratorio, sexo y edad (por ejemplo, el límite superior en hombres va de 1.11 a 1.3 mg/dL). Por ahora no se muestra un rango numérico; la decisión queda pendiente (ver Pendientes).
- Cantidad de decimales por unidad: propuesta, **por validar**.

## Reglas entre campos

Ninguna por ahora.

## Fórmula

Con creatinina en mg/dL y peso en kg:

```
Hombre:  CrCl = ((140 − edad) × peso) / (72 × creatinina)
Mujer:   CrCl = ((140 − edad) × peso) / (72 × creatinina) × 0.85
```

Si el usuario captura en otras unidades, primero se convierten a kg y mg/dL (D13 y R3 del modelo de datos: se guarda lo ingresado, la conversión ocurre solo al calcular).

## Redondeo

Al entero más cercano, en mL/min (propuesta C03-3).

## Interpretación

El resultado se muestra como "Aclaramiento de creatinina estimado: N mL/min", acompañado de esta nota (por validar):

> Estimación para apoyar el ajuste de dosis de fármacos de eliminación renal en adultos. Los puntos de corte para ajustar dosis dependen de cada fármaco: consulte su ficha técnica.

No se muestran categorías ni semáforos en el MVP: los umbrales de dosificación los define cada fármaco, y no se agregan categorías hasta contar con fuente verificada y validación médica.

## Casos de prueba (cálculo manual, para pruebas unitarias)

| Sexo | Edad | Peso | Creatinina | Cálculo | Resultado mostrado |
|---|---|---|---|---|---|
| Hombre | 70 | 75 kg | 1.0 mg/dL | (70 × 75) / 72 = 72.92 | 73 |
| Mujer | 55 | 60 kg | 0.9 mg/dL | (85 × 60) / (72 × 0.9) × 0.85 = 66.90 | 67 |
| Hombre | 40 | 80 kg | 1.0 mg/dL | (100 × 80) / 72 = 111.11 | 111 |
| Mujer | 80 | 55 kg | 1.2 mg/dL | (60 × 55) / (72 × 1.2) × 0.85 = 32.47 | 32 |
| Hombre | 70 | 75 kg | 88.4 µmol/L | Equivale a 1.0 mg/dL → 72.92 | 73 |

Casos de conversión de unidades (para pruebas de D13):

| Entrada | Se convierte a | Nota |
|---|---|---|
| Creatinina 1.0 mg/dL | 88 µmol/L (88.4 sin redondear) | Ida y vuelta sin editar restaura 1.0 |
| Peso 75 kg | 165.3 lb | Ida y vuelta sin editar restaura 75 |

Casos de error:

| Entrada | Esperado |
|---|---|
| Sin sexo seleccionado | "Falta: Sexo", sin resultado |
| Edad 17 | Error de rango en edad, sin resultado |
| Creatinina 0 | Error de rango en creatinina, sin resultado |
| Peso 500 kg | Error de rango en peso, sin resultado |

## Criterios de aceptación

- [ ] El formulario muestra Sexo, Edad, Peso y Creatinina, con peso y creatinina en kg y mg/dL por defecto.
- [ ] El botón de flechas alterna kg ⇄ lb y mg/dL ⇄ µmol/L, convirtiendo el valor ya escrito y revalidando con el rango de la nueva unidad.
- [ ] Sexo no tiene selección inicial y la barra indica "Falta: Sexo" hasta elegirlo.
- [ ] Con los cuatro campos válidos aparece el resultado en mL/min, redondeado al entero, sin ninguna otra acción.
- [ ] Todos los casos de prueba producen el resultado indicado, también al capturar en las unidades alternas.
- [ ] Un valor fuera del rango válido muestra error al salir del campo y no hay resultado.
- [ ] No existe campo de talla ni selector de tipo de peso.
- [ ] Se muestran la fuente y la nota de interpretación.

## Tasks

- [ ] Escribir la definición de la calculadora (campos, unidades con factores de conversión, fórmula, interpretación).
- [ ] Escribir la función `calcularAclaramientoCreatinina` y sus pruebas con la tabla de casos.
- [ ] Escribir las pruebas de conversión de unidades (peso y creatinina) y de rangos válidos.
- [ ] Registrar la calculadora en el catálogo (especialidad: renal).
- [ ] Probar los criterios de aceptación.

## Pendientes

- [ ] Validar con un médico los rangos válidos, el texto de la nota y los decimales por unidad.
- [ ] Decidir con un médico la pista de la creatinina: A) texto "según su laboratorio" sin números, B) rango por sexo, C) un rango único amplio para adultos.
- [ ] Consultar el artículo original de Cockcroft y Gault y confirmar el factor de conversión de creatinina.
- [ ] Decidir si se agregan en el futuro la talla opcional y las variantes de peso (ideal y ajustado).
