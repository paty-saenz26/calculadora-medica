# Calculadora C08: CKD-EPI 2021 (tasa de filtrado glomerular)

> Versión 0.1 (borrador). Hereda el comportamiento de `F03-calculadora-en-vivo.md`. Lo marcado **por validar** debe revisarse con un médico.

## Objetivo

Estimar la tasa de filtrado glomerular (TFG) con creatinina sérica, edad y sexo, y mostrar su categoría G.

## Actor

Médico (invitado o con cuenta), en pacientes adultos.

## Fuentes

- **Ecuación:** Inker LA, et al. *New creatinine- and cystatin C-based equations to estimate GFR without race*. N Engl J Med 2021;385:1737-49. Constantes verificadas en la página de la National Kidney Foundation (https://www.kidney.org/professionals/ckd-epi-creatinine-equation-2021). **Por validar:** consultar el artículo original.
- **Categorías G:** National Kidney Foundation, "How to Classify CKD" (https://www.kidney.org/professionals/explore-your-knowledge/how-to-classify-ckd). La página no nombra la guía de origen (KDIGO); **por validar** la atribución.

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C08-1 | Ecuación | Solo la versión 2021 con creatinina (sin cistatina C y sin raza) |
| C08-2 | Unidades | Creatinina mg/dL ⇄ µmol/L, igual que C03 (1 mg/dL = 88.4 µmol/L, por validar). Resultado en mL/min/1.73 m² |
| C08-3 | Redondeo | Entero. La categoría se decide con el valor ya redondeado |
| C08-4 | Población | Adultos. Para menores de 18 años no aplica |

## Campos

| ID | Etiqueta | Tipo | Unidades | Rango válido (por validar) | Obligatorio |
|---|---|---|---|---|---|
| `sexo` | Sexo | Opción: Mujer / Hombre, sin selección inicial | — | — | Sí |
| `edad` | Edad | Número entero | años | 18 a 120 | Sí |
| `creatinina` | Creatinina sérica | Número, 2 decimales en mg/dL y 0 en µmol/L | mg/dL, µmol/L | 0.2 a 20 mg/dL | Sí |

## Fórmula

```
eGFRcr = 142 × mín(Scr/κ, 1)^α × máx(Scr/κ, 1)^−1.200 × 0.9938^edad × 1.012 [si es mujer]
```

Con Scr en mg/dL; κ = 0.7 (mujer) o 0.9 (hombre); α = −0.241 (mujer) o −0.302 (hombre).

## Interpretación

| TFG mostrada | Categoría |
|---|---|
| 90 o más | G1: normal o alta |
| 60 a 89 | G2: ligeramente disminuida |
| 45 a 59 | G3a: ligera a moderadamente disminuida |
| 30 a 44 | G3b: moderada a gravemente disminuida |
| 15 a 29 | G4: gravemente disminuida |
| Menos de 15 | G5: falla renal |

Nota: "Estimación de la tasa de filtrado glomerular. En ausencia de marcadores de daño renal, las categorías G1 y G2 no cumplen criterios de enfermedad renal crónica."

## Casos de prueba (calculados con la ecuación)

| Sexo | Edad | Creatinina (mg/dL) | TFG sin redondear | Mostrada | Categoría |
|---|---|---|---|---|---|
| Hombre | 25 | 0.8 | 125.95 | 126 | G1 |
| Hombre | 60 | 1.0 | 86.16 | 86 | G2 |
| Mujer | 60 | 0.8 | 84.30 | 84 | G2 |
| Hombre | 65 | 1.4 | 55.78 | 56 | G3a |
| Hombre | 70 | 2.0 | 35.24 | 35 | G3b |
| Mujer | 70 | 2.5 | 20.18 | 20 | G4 |
| Mujer | 80 | 3.5 | 12.67 | 13 | G5 |
| Hombre | 30 | 0.7 | 127.12 | 127 | G1 (Scr menor que κ) |
| Mujer | 40 | 0.5 | 121.52 | 122 | G1 (Scr menor que κ) |

Con unidades alternas: hombre de 60 años con 88.4 µmol/L equivale a 1.0 mg/dL (86).
Errores: sin sexo ("Falta: Sexo"), edad 17 y creatinina 0 (rango). Sin resultado.

## Criterios de aceptación

- [ ] Con sexo, edad y creatinina válidos aparece la TFG y su categoría sin otra acción.
- [ ] Los casos de prueba dan lo indicado, también con creatinina en µmol/L.
- [ ] Los límites de las categorías (90, 60, 45, 30, 15) caen en la categoría correcta.
- [ ] Un valor fuera de rango muestra error al salir del campo y no hay resultado.
- [ ] Se muestran la fuente y la nota.

## Tasks

- [x] Definición, función `calcularCkdEpi2021`, categorías y pruebas.
- [x] Registrar en el catálogo (renal).
- [ ] Probar los criterios de aceptación en el teléfono.

## Pendientes

- [ ] Consultar el artículo de Inker 2021 y confirmar constantes.
- [ ] Confirmar la atribución (KDIGO) de las categorías G.
- [ ] Validar con un médico los rangos y la nota.
- [ ] Decidir si se agrega la versión con cistatina C.
