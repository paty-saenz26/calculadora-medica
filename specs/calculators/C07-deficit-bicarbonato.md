# Calculadora C07: Déficit de bicarbonato

> Versión 0.1 (borrador). Hereda el comportamiento de `F03-calculadora-en-vivo.md`. Lo marcado **por validar** debe revisarse con un médico y contra las fuentes originales.

## Objetivo

Estimar los miliequivalentes (mEq) de bicarbonato que faltan para llevar el bicarbonato sérico a un valor deseado, como apoyo en acidosis metabólica.

## Actor

Médico (invitado o con cuenta), en pacientes adultos.

## Fuentes (por validar)

- **Fórmula y factor 0.5:** reproducida en una calculadora que cita a Sabatini S, Kurtzman NA. *Bicarbonate therapy in severe metabolic acidosis*. J Am Soc Nephrol 2009, y a Lim S. *Metabolic acidosis*. Acta Med Indones 2007 (https://www.omnicalculator.com/health/bicarbonate-deficit). **Por validar:** consultar ambos artículos. Algunas referencias usan un factor de 0.4 a 0.6 según la gravedad de la acidosis.
- **Valor deseado por defecto (24 mmol/L):** dentro del rango de referencia 22 a 29 mmol/L citado en la misma página. **Por validar.**

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C07-1 | Factor | 0.5 fijo. Un factor variable queda como futuro |
| C07-2 | Bicarbonato deseado | Campo opcional; vacío usa 24. Se puede cambiar |
| C07-3 | Déficit negativo | Si el medido es igual o mayor que el deseado, el resultado es 0 con un mensaje, no un valor negativo |
| C07-4 | Unidades | Peso: kg ⇄ lb (D14). Bicarbonato en mEq/L (equivale numéricamente a mmol/L, sin conversión) |
| C07-5 | Redondeo | Entero (mEq) |
| C07-6 | Dosis | La spec **no** sugiere cuánto reponer ni a qué velocidad. Solo estima el déficit |

## Campos

| ID | Etiqueta | Tipo | Unidades | Rango válido (por validar) | Obligatorio |
|---|---|---|---|---|---|
| `peso` | Peso | Número, 1 decimal | kg, lb | 20 a 300 kg | Sí |
| `medido` | Bicarbonato sérico | Número, 1 decimal | mEq/L | 1 a 40 | Sí |
| `deseado` | Bicarbonato deseado (opcional) | Número, 1 decimal | mEq/L | 10 a 40 | No (pista: "Si lo dejas vacío: 24") |

## Fórmula

```
Déficit (mEq) = 0.5 × peso (kg) × (bicarbonato deseado − bicarbonato medido)
```

## Interpretación (por validar con un médico)

Resultado en mEq con la nota: "Estimación de la cantidad de bicarbonato (mEq) necesaria para llevar el nivel sérico al valor deseado. El uso de bicarbonato es controvertido en algunos pacientes y la dosis depende de la causa y la gravedad: decida según el criterio clínico."

Si el déficit es cero o negativo: resultado 0 y el mensaje "No hay déficit: el bicarbonato medido ya está en el valor deseado o por encima."

## Casos de prueba

| Peso | Medido | Deseado | Cálculo | Resultado |
|---|---|---|---|---|
| 70 kg | 10 | vacío (24) | 0.5 × 70 × 14 | 490 mEq |
| 80 kg | 15 | vacío (24) | 0.5 × 80 × 9 | 360 mEq |
| 60 kg | 18 | 24 | 0.5 × 60 × 6 | 180 mEq |
| 70 kg | 12 | 20 | 0.5 × 70 × 8 | 280 mEq |
| 154.3 lb | 10 | vacío | ≈ 69.99 kg → 489.9 | 490 mEq |
| 70 kg | 28 | vacío | negativo | 0 mEq con mensaje "No hay déficit" |

Errores: bicarbonato vacío ("Falta: Bicarbonato sérico"), bicarbonato 60 (rango), deseado 5 (rango), peso 500 kg (rango). Todos sin resultado.

## Criterios de aceptación

- [ ] Con peso y bicarbonato válidos aparece el déficit sin otra acción; el deseado vacío usa 24.
- [ ] Los casos de prueba dan lo indicado, también con el peso en libras.
- [ ] Un déficit cero o negativo muestra 0 y el mensaje, nunca un número negativo.
- [ ] Un valor fuera de rango muestra error al salir del campo y no hay resultado.
- [ ] Se muestran la fuente y la nota.

## Tasks

- [x] Definición, función `calcularDeficitBicarbonato` y pruebas.
- [x] Registrar en el catálogo (renal).
- [ ] Probar los criterios de aceptación en el teléfono.

## Pendientes

- [ ] Consultar a Sabatini y Kurtzman (2009) y confirmar el factor 0.5 y el valor deseado de 24.
- [ ] Validar con un médico los rangos, la nota y si debe advertirse que se repone solo una parte del déficit.
- [ ] Decidir si se agrega un factor variable (0.4 a 0.6).
