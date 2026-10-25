# Calculadora C09: STOP-Bang

> Versión 0.1 (borrador). Hereda el comportamiento de `F03-calculadora-en-vivo.md`. Lo marcado **por validar** debe revisarse con un médico.

## Objetivo

Tamizar el riesgo de apnea obstructiva del sueño (AOS) con ocho preguntas de sí o no.

## Actor

Médico (invitado o con cuenta), en pacientes adultos.

## Fuentes

- **Cuestionario y puntaje:** Chung F, et al. *STOP questionnaire: a tool to screen patients for obstructive sleep apnea*. Anesthesiology 2008;108:812-21. Versión modificada: Chung F, et al. Br J Anaesth 2012;108:768-75, y J Clin Sleep Med 2014;10:951-8. Preguntas y cortes leídos en la versión del cuestionario publicada por una clínica (https://www.psychdb.com/_media/sleep/stop-bang.pdf), que indica ser propiedad de la University Health Network (www.stopbang.ca). **Por validar:** consultar los artículos y las condiciones de uso del cuestionario.

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C09-1 | Preguntas | Las ocho, todas sí/no con valor inicial "No" (D15); no hay campos pendientes |
| C09-2 | Cuello | Una pregunta con ambos cortes: 43 cm o más en hombres, 41 cm o más en mujeres (versión de la fuente consultada; otras versiones usan un solo corte de 40 cm. **Por validar**) |
| C09-3 | Nivel de riesgo | Se calcula con el puntaje y la regla adicional (ver abajo) |
| C09-4 | Resultado | Puntaje "N de 8" y nivel de riesgo en el texto |

## Campos (cada "Sí" suma 1 punto)

| ID | Pregunta |
|---|---|
| `ronquido` | Ronca fuerte (se oye a través de una puerta cerrada o la pareja lo codea) — **S** |
| `cansancio` | Se siente cansado, fatigado o con sueño durante el día — **T** |
| `apneas` | Alguien ha observado que deja de respirar o se ahoga mientras duerme — **O** |
| `presion` | Tiene hipertensión o está en tratamiento para ella — **P** |
| `imc` | IMC mayor de 35 kg/m² |
| `edad` | Edad mayor de 50 años |
| `cuello` | Cuello grande (a la altura de la nuez): 43 cm o más en hombres, 41 cm o más en mujeres |
| `hombre` | Sexo masculino |

## Nivel de riesgo

| Condición | Riesgo |
|---|---|
| 5 a 8 puntos | Alto |
| 2 o más "Sí" entre las cuatro preguntas STOP (S, T, O, P) **y** además sexo masculino, IMC mayor de 35 o cuello grande | Alto (aunque el puntaje sea 3 o 4) |
| 3 a 4 puntos (sin la regla anterior) | Intermedio |
| 0 a 2 puntos | Bajo |

## Interpretación (por validar con un médico)

"Riesgo [bajo / intermedio / alto] de apnea obstructiva del sueño." con la nota: "Herramienta de tamizaje, no diagnóstica. La confirmación de apnea obstructiva del sueño requiere un estudio del sueño."

## Casos de prueba

| Respuestas "Sí" | Puntaje | Riesgo |
|---|---|---|
| Ninguna | 0 | Bajo |
| Ronquido y edad | 2 | Bajo |
| Ronquido, edad e IMC | 3 | Intermedio |
| Ronquido, edad, IMC y sexo masculino | 4 | Intermedio (solo 1 de STOP) |
| Ronquido, cansancio, apneas, edad e IMC | 5 | Alto |
| Ronquido, cansancio y sexo masculino | 3 | Alto (regla adicional) |
| Ronquido, presión e IMC | 3 | Alto (regla adicional) |
| Apneas, cansancio y cuello grande | 3 | Alto (regla adicional) |
| Ronquido, sexo masculino y edad | 3 | Intermedio (solo 1 de STOP) |
| Todas | 8 | Alto |

## Criterios de aceptación

- [ ] Al abrir, las ocho preguntas están en "No" y ya se muestra "0 de 8, riesgo bajo".
- [ ] Cada "Sí" suma 1 punto de inmediato.
- [ ] Los casos de prueba dan el puntaje y el riesgo indicados, incluida la regla adicional.
- [ ] Se muestran la fuente y la nota de que no es diagnóstico.

## Tasks

- [x] Definición, funciones `calcularStopBang` y `nivelRiesgoStopBang`, y pruebas.
- [x] Registrar en el catálogo (neumología).
- [ ] Probar los criterios de aceptación en el teléfono.

## Pendientes

- [ ] Consultar los artículos originales y confirmar preguntas, cortes y la regla adicional.
- [ ] Revisar las condiciones de uso del cuestionario (propiedad de la University Health Network).
- [ ] Validar con un médico el texto de las preguntas en español y la nota.
- [ ] Decidir el corte de cuello (versión por sexo o un solo corte de 40 cm).
