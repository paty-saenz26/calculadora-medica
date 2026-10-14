# Calculadora C01: Presión arterial media (PAM)

> Versión 0.1 (borrador). Hereda el comportamiento general de `F03-calculadora-en-vivo.md`; aquí solo va lo propio de esta calculadora. Los valores marcados como **por validar** deben revisarse con un médico antes de dar la spec por buena.

## Objetivo

Estimar la presión arterial media a partir de la presión sistólica y la diastólica, de forma inmediata.

## Actor

Médico (invitado o con cuenta), en pacientes adultos.

## Fuentes

- **Fórmula y significado clínico:** Wachs D (ed.). *Physiology, Mean Arterial Pressure*. StatPearls. Actualizado el 10/04/2023. https://www.statpearls.com/point-of-care/24804
- **Rango normal informativo:** Whelton PK, et al. *2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults*. Hypertension 2018;71(6):1269-1324. doi:10.1161/HYP.0000000000000066
- **Limitaciones de la fórmula (nota):** Meaney E, et al. *Formula and nomogram for the sphygmomanometric calculation of the mean arterial pressure*. Heart. https://heart.bmj.com/content/84/1/64 (**por validar:** completar año y paginación al citar).

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C01-1 | Fórmula | Clásica: PAM = PAD + (PAS − PAD) / 3 (equivale a (PAS + 2 × PAD) / 3) |
| C01-2 | Redondeo | Resultado como número entero (mm Hg) y PAS y PAD capturadas solo como enteros (confirmado) |
| C01-3 | Validación | Cada campo con **rango válido** (rechaza errores) y **rango normal** informativo (pista de valor esperado), más una regla entre campos |

## Campos

| ID | Etiqueta | Tipo | Unidad | Rango válido (por validar) | Pista de valor esperado | Obligatorio |
|---|---|---|---|---|---|---|
| `pas` | Presión sistólica | Número entero | mm Hg | 40 a 300 | Normal: menos de 120 | Sí |
| `pad` | Presión diastólica | Número entero | mm Hg | 20 a 200 | Normal: menos de 80 | Sí |

- La pista se muestra en el campo como información; **nunca bloquea** un valor (la presión de un paciente grave puede estar fuera de lo normal y ser real).
- La pista aplica a adultos (clasificación ACC/AHA 2017).

## Reglas entre campos

| ID | Regla | Mensaje de error |
|---|---|---|
| R1 | `pad` debe ser menor que `pas` | "La diastólica debe ser menor que la sistólica" |

## Fórmula

```
PAM = (PAS + 2 × PAD) / 3
```

## Redondeo

Se redondea al entero más cercano. Con presiones enteras, el resultado nunca cae justo en .5.

## Interpretación (por validar con un médico)

Se basa en el valor redondeado que se muestra, para que el resultado y el mensaje siempre coincidan.

| Resultado | Mensaje |
|---|---|
| Menor que 60 mm Hg | "Por debajo de 60 mm Hg. Si se mantiene, no se perfunden bien los órganos vitales (riesgo de isquemia)." |
| 60 mm Hg o más | "En o por encima de 60 mm Hg, mínimo necesario para perfundir órganos vitales." |

Metas clínicas específicas (por ejemplo en choque) quedan fuera del MVP hasta contar con fuente y validación médica.

## Nota de la fuente (visible en la app)

La PAM calculada a partir de PAS y PAD es una estimación; no sustituye la medición directa cuando esta se requiere.

## Casos de prueba (cálculo manual, para pruebas unitarias)

| PAS | PAD | Cálculo | Resultado mostrado |
|---|---|---|---|
| 120 | 80 | (120 + 160) / 3 = 93.33 | 93 |
| 110 | 70 | (110 + 140) / 3 = 83.33 | 83 |
| 140 | 90 | (140 + 180) / 3 = 106.67 | 107 |
| 90 | 60 | (90 + 120) / 3 = 70 | 70 |
| 100 | 50 | (100 + 100) / 3 = 66.67 | 67 |
| 80 | 50 | (80 + 100) / 3 = 60 | 60 (mensaje: 60 o más) |
| 79 | 50 | (79 + 100) / 3 = 59.67 | 60 (mensaje: 60 o más, por usar el valor redondeado) |
| 75 | 45 | (75 + 90) / 3 = 55 | 55 (mensaje: menor que 60) |

Casos de error:

| PAS | PAD | Esperado |
|---|---|---|
| 80 | 80 | Error R1, sin resultado |
| 70 | 90 | Error R1, sin resultado |
| 350 | 80 | Error de rango en PAS, sin resultado |
| 120 | vacío | "Falta: Presión diastólica", sin resultado |

## Criterios de aceptación

- [ ] Los campos PAS y PAD son enteros en mm Hg y muestran su pista de valor esperado.
- [ ] Con PAS y PAD válidas y PAD < PAS, aparece la PAM redondeada al entero sin ninguna otra acción.
- [ ] Todos los casos de prueba de la tabla producen el resultado indicado.
- [ ] Con PAD mayor o igual que PAS se muestra el error R1 y no hay resultado.
- [ ] Un valor fuera del rango válido muestra error al salir del campo y no hay resultado.
- [ ] Un valor fuera de la pista (por ejemplo, PAS 85) **no** genera error: solo se calcula.
- [ ] La interpretación coincide con el valor mostrado en los casos 80/50, 79/50 y 75/45.
- [ ] Se muestran la fuente y la nota de estimación.

## Tasks

- [ ] Escribir la definición de la calculadora (campos, regla R1, fórmula, interpretación).
- [ ] Escribir la función `calcularPam` y sus pruebas con la tabla de casos.
- [ ] Escribir la prueba de la regla R1 y de los rangos válidos.
- [ ] Registrar la calculadora en el catálogo (especialidad: cardiovascular).
- [ ] Probar los criterios de aceptación.

## Pendientes

- [ ] Validar con un médico los rangos válidos, la interpretación y el uso del valor redondeado para el umbral de 60 mm Hg.
- [ ] Completar la cita del artículo de *Heart*.
