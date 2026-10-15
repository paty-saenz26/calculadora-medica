# Calculadora C02: CHA₂DS₂-VASc

> Versión 0.1 (borrador). Hereda el comportamiento general de `F03-calculadora-en-vivo.md`; aquí solo va lo propio de esta calculadora. Los puntos marcados **por validar** deben revisarse con un médico y contra la fuente original antes de dar la spec por buena.

## Objetivo

Estimar el riesgo de ictus (accidente cerebrovascular) en pacientes con fibrilación auricular mediante un puntaje de 0 a 9 que suma factores de riesgo.

## Actor

Médico (invitado o con cuenta), en pacientes adultos con fibrilación auricular no valvular.

## Fuentes

- **Puntaje original:** Lip GYH, Nieuwlaat R, Pisters R, Lane DA, Crijns HJ. *Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation using a novel risk factor-based approach: the Euro Heart Survey on Atrial Fibrillation*. Chest 2010;137(2):263-72. **Por validar:** consultar el artículo original; en esta etapa los puntos se verificaron en tablas secundarias coincidentes (por ejemplo, Merck Manual: https://www.merckmanuals.com/professional/multimedia/table/cha2ds2-vasc-score).
- **Definiciones de los componentes:** referencia secundaria (ClinCalc: https://clincalc.com/cardiology/stroke/chadsvasc.aspx). **Por validar** con una guía clínica vigente.
- **Variante sin sexo (CHA₂DS₂-VA):** las guías ESC 2024 de fibrilación auricular la adoptan. **Por validar:** consultar la guía y confirmar la cita; en esta etapa solo se conoce por una referencia secundaria.

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C02-1 | Variante | Se implementa CHA₂DS₂-VASc (incluye sexo). CHA₂DS₂-VA queda como funcionalidad futura |
| C02-2 | Valores iniciales | Edad y sexo sin selección inicial. Los campos sí/no inician en "No" y el usuario cambia a "Sí" cuando aplique (D15, confirmado) |
| C02-3 | Interpretación | En el MVP se muestra el puntaje y una nota; las categorías de riesgo y las tasas anuales de ictus quedan fuera hasta tener validación médica |

## Campos

| ID | Etiqueta | Tipo | Opciones y puntos | Valor inicial | Obligatorio |
|---|---|---|---|---|---|
| `edad` | Edad | Opción | Menor de 65 años (0), 65 a 74 años (+1), 75 años o más (+2) | Sin selección | Sí |
| `sexo` | Sexo | Opción | Mujer (+1), Hombre (0) | Sin selección | Sí |
| `icc` | Insuficiencia cardiaca (con evidencia objetiva de disfunción cardiaca) | Sí/No | Sí (+1), No (0) | No | Sí |
| `hta` | Hipertensión | Sí/No | Sí (+1), No (0) | No | Sí |
| `dm` | Diabetes mellitus | Sí/No | Sí (+1), No (0) | No | Sí |
| `ictus` | Ictus, AIT o tromboembolia previa | Sí/No | Sí (+2), No (0) | No | Sí |
| `vascular` | Enfermedad vascular (infarto previo, enfermedad arterial periférica o placa aórtica) | Sí/No | Sí (+1), No (0) | No | Sí |

- Cada opción muestra sus puntos junto a la etiqueta, como en la referencia de diseño.
- Los campos sí/no, al tener valor inicial, no cuentan como pendientes: con solo elegir edad y sexo aparece el resultado.
- No hay campos numéricos, así que no hay rangos válidos ni pistas de valor esperado.

## Reglas entre campos

Ninguna.

## Fórmula

```
Puntaje = puntos(edad) + puntos(sexo) + puntos(icc) + puntos(hta)
        + puntos(dm) + puntos(ictus) + puntos(vascular)
```

El mínimo es 0 y el máximo es 9 (la edad aporta como máximo 2 puntos).

## Redondeo

No aplica: el resultado es un entero.

## Interpretación (por validar con un médico)

El resultado se muestra como "Puntaje CHA₂DS₂-VASc: N de 9", acompañado de esta nota:

> Estimación del riesgo de ictus en fibrilación auricular no valvular. La decisión de anticoagular depende de las guías vigentes y del criterio clínico.

Mensaje adicional, solo cuando el **único** punto proviene del sexo femenino (mujer, menor de 65 años y todos los demás campos en "No"):

> El único punto proviene del sexo femenino, que por sí solo no se considera un factor de riesgo independiente (riesgo bajo).

No se muestran categorías de riesgo ni recomendaciones de tratamiento en el MVP.

## Casos de prueba (cálculo manual, para pruebas unitarias)

| Edad | Sexo | ICC | HTA | DM | Ictus | Vascular | Puntaje |
|---|---|---|---|---|---|---|---|
| Menor de 65 | Hombre | No | No | No | No | No | 0 |
| Menor de 65 | Mujer | No | No | No | No | No | 1 (con mensaje de solo sexo) |
| 65 a 74 | Hombre | No | No | No | No | No | 1 (sin mensaje de solo sexo) |
| 65 a 74 | Mujer | No | Sí | No | No | No | 3 |
| 65 a 74 | Hombre | Sí | Sí | No | No | No | 3 |
| 75 o más | Hombre | No | No | Sí | No | Sí | 4 |
| 75 o más | Mujer | No | Sí | Sí | Sí | No | 7 |
| 75 o más | Mujer | Sí | Sí | Sí | Sí | Sí | 9 (máximo) |

Casos de error:

| Entrada | Esperado |
|---|---|
| Sin edad ni sexo seleccionados | "Falta: Edad, Sexo", sin resultado |
| Edad elegida, sin sexo | "Falta: Sexo", sin resultado |
| Todos los sí/no en "No", edad y sexo elegidos | Resultado calculado (no hay campos pendientes) |

## Criterios de aceptación

- [ ] Al abrir, edad y sexo no tienen selección, los cinco campos sí/no aparecen en "No" y la barra indica "Falta: Edad, Sexo".
- [ ] Al elegir edad y sexo aparece el puntaje sin ninguna otra acción.
- [ ] Cambiar un campo sí/no a "Sí" suma sus puntos de inmediato (+2 para ictus, +1 para los demás).
- [ ] Los ocho casos de prueba producen el puntaje indicado.
- [ ] El puntaje máximo posible es 9.
- [ ] El mensaje de "solo sexo" aparece únicamente cuando el único punto es el de mujer.
- [ ] Cada opción muestra sus puntos.
- [ ] Se muestran la fuente y la nota de interpretación.

## Tasks

- [ ] Escribir la definición de la calculadora (campos, puntos, valores iniciales, fórmula, interpretación).
- [ ] Escribir la función `calcularChaDsVasc` y sus pruebas con la tabla de casos.
- [ ] Escribir la prueba del mensaje de "solo sexo" en sus casos positivos y negativos.
- [ ] Registrar la calculadora en el catálogo (especialidad: cardiovascular).
- [ ] Probar los criterios de aceptación.

## Pendientes

- [ ] Consultar el artículo original (Chest 2010) y una guía vigente para validar puntos y definiciones.
- [ ] Validar con un médico el texto de la nota y el mensaje de "solo sexo".
- [ ] Decidir con un médico si se agregan categorías de riesgo o tasas anuales de ictus, con su fuente.
- [ ] Decidir si se agrega después la variante CHA₂DS₂-VA.
