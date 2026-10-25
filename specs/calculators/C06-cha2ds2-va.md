# Calculadora C06: CHA₂DS₂-VA

> Versión 0.1 (borrador). Hereda el comportamiento de `F03-calculadora-en-vivo.md`. Es la variante de C02 que no incluye el sexo. Lo marcado **por validar** debe revisarse con un médico.

## Objetivo

Estimar el riesgo de ictus en pacientes con fibrilación auricular con un puntaje de 0 a 8, sin considerar el sexo como factor de riesgo.

## Actor

Médico (invitado o con cuenta), en pacientes adultos con fibrilación auricular.

## Fuentes

- **Definición del puntaje:** Van Gelder IC, et al. *2024 ESC Guidelines for the management of atrial fibrillation*. Eur Heart J 2024 (Tabla 10). Componentes y puntos leídos en una página que reproduce la guía (https://www.tomwademd.net/?p=160363). **Por validar:** consultar la guía original.
- **Máximo del puntaje:** la página consultada indicaba 9 puntos, pero la suma de los componentes da **8**, porque la edad aporta una sola categoría (65 a 74 años: 1 punto, o 75 años o más: 2 puntos). Se usa 8. **Por validar** con la guía.
- La guía recomienda anticoagulación oral con puntaje de 2 o más y valorarla con 1 punto. Esa recomendación **no se muestra** en el MVP (igual que en C02) hasta tener validación médica.

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C06-1 | Relación con C02 | Son calculadoras separadas, cada una con su fuente. C02 (VASc) conserva el sexo |
| C06-2 | Valores iniciales | Edad sin selección. Los sí/no inician en "No" (D15) |
| C06-3 | Interpretación | Solo el puntaje y una nota; sin categorías de riesgo ni recomendaciones de tratamiento |

## Campos

| ID | Etiqueta | Tipo | Opciones y puntos | Valor inicial | Obligatorio |
|---|---|---|---|---|---|
| `edad` | Edad | Opción | Menor de 65 años (0), 65 a 74 años (+1), 75 años o más (+2) | Sin selección | Sí |
| `icc` | Insuficiencia cardiaca crónica | Sí/No | Sí (+1) | No | Sí |
| `hta` | Hipertensión | Sí/No | Sí (+1) | No | Sí |
| `dm` | Diabetes mellitus | Sí/No | Sí (+1) | No | Sí |
| `ictus` | Ictus, AIT o tromboembolia arterial previa | Sí/No | Sí (+2) | No | Sí |
| `vascular` | Enfermedad vascular | Sí/No | Sí (+1) | No | Sí |

## Fórmula

```
Puntaje = puntos(edad) + icc + hta + dm + 2 × ictus + vascular
```

Mínimo 0, máximo 8.

## Interpretación (por validar con un médico)

"Puntaje N de 8", con la nota: "Estimación del riesgo de ictus en fibrilación auricular. No incluye el sexo como factor. La decisión de anticoagular depende de las guías vigentes y del criterio clínico."

## Casos de prueba

| Edad | ICC | HTA | DM | Ictus | Vascular | Puntaje |
|---|---|---|---|---|---|---|
| Menor de 65 | No | No | No | No | No | 0 |
| 65 a 74 | No | No | No | No | No | 1 |
| 75 o más | No | No | No | No | No | 2 |
| 65 a 74 | No | Sí | No | No | No | 2 |
| Menor de 65 | No | No | No | Sí | No | 2 |
| 65 a 74 | Sí | Sí | No | No | Sí | 4 |
| 75 o más | No | No | Sí | No | Sí | 4 |
| 75 o más | Sí | Sí | Sí | Sí | Sí | 8 (máximo) |

Error: sin edad seleccionada, "Falta: Edad" y sin resultado.

## Criterios de aceptación

- [ ] Al abrir, la edad no tiene selección, los cinco sí/no están en "No" y la barra dice "Falta: Edad".
- [ ] Al elegir la edad aparece el puntaje sin otra acción.
- [ ] Los ocho casos de prueba dan el puntaje indicado y el máximo es 8.
- [ ] No existe campo de sexo.
- [ ] Se muestran la fuente y la nota.

## Tasks

- [x] Definición, función `calcularChaDsVa` y pruebas.
- [x] Registrar en el catálogo (cardiovascular).
- [ ] Probar los criterios de aceptación en el teléfono.

## Pendientes

- [ ] Consultar la guía ESC 2024 original y confirmar puntos, máximo (8) y definiciones.
- [ ] Validar con un médico el texto de la nota.
- [ ] Decidir con un médico si se muestran los umbrales de la guía (2 o más: recomendada; 1: considerar).
