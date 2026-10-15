# Calculadora C05: FIB-4 (fibrosis hepática)

> Versión 0.1 (borrador). **Calculadora extra, fuera del MVP actual** (00-project.md lista C01 a C04); se redacta para validar el flujo "fórmula desde fuente original". Hereda el comportamiento de `F03-calculadora-en-vivo.md`. Lo marcado **por validar** debe revisarse con un médico y contra el artículo original.

## Objetivo

Estimar el riesgo de fibrosis hepática avanzada con edad, AST, ALT y plaquetas, como apoyo para decidir si hacen falta más estudios.

## Actor

Médico (invitado o con cuenta), en pacientes adultos.

## Fuentes

- **Artículo original:** Sterling RK, Lissen E, Clumeck N, et al. *Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection*. Hepatology 2006;43:1317-1325. Fórmula y puntos de corte verificados en la calculadora de la Universidad de Washington (https://www.hepatitisc.uw.edu/page/clinical-calculators/fib-4), que cita el artículo. **Por validar:** consultar el artículo original.
- El artículo se desarrolló en coinfección VIH/VHC; su uso en otras poblaciones es una extensión clínica común. **Por validar** con un médico qué advertencia de población mostrar.

## Decisiones de esta calculadora

| # | Tema | Decisión |
|---|---|---|
| C05-1 | Redondeo | 2 decimales; la categoría se decide con el valor ya redondeado (igual que C04-4) |
| C05-2 | Plaquetas | Una sola unidad, ×10⁹/L (equivale numéricamente a ×10³/µL, que es como muchos laboratorios reportan). No hay conversión |
| C05-3 | Categorías | Solo las dos que define la fuente (menor de 1.45 y mayor de 3.25); el tramo intermedio se llama "indeterminado" sin más interpretación |

## Campos

| ID | Etiqueta | Tipo | Unidad | Rango válido (por validar) | Obligatorio |
|---|---|---|---|---|---|
| `edad` | Edad | Número entero | años | 18 a 120 | Sí |
| `ast` | AST (TGO) | Número, 1 decimal | U/L | 1 a 5000 | Sí |
| `alt` | ALT (TGP) | Número, 1 decimal | U/L | 1 a 5000 | Sí |
| `plaquetas` | Plaquetas | Número, 1 decimal | ×10⁹/L (= ×10³/µL) | 10 a 1000 | Sí |

- Mínimos mayores que cero para evitar divisiones entre cero y raíz de cero.
- Sin pista de valor esperado por ahora: los rangos de referencia dependen del laboratorio (**pendiente**).

## Reglas entre campos

Ninguna.

## Fórmula

```
FIB-4 = (edad × AST) / (plaquetas × raíz cuadrada(ALT))
```

## Redondeo

2 decimales.

## Interpretación (por validar con un médico)

Sobre el valor mostrado:

| FIB-4 | Texto |
|---|---|
| Menor de 1.45 | Baja probabilidad de fibrosis avanzada (valor predictivo negativo de 90% en el estudio original) |
| De 1.45 a 3.25 (inclusive) | Indeterminado |
| Mayor de 3.25 | Alta probabilidad de fibrosis avanzada (especificidad de 97% y valor predictivo positivo de 65% en el estudio original) |

Nota visible: "Índice no invasivo de apoyo. Un resultado indeterminado o alto requiere valoración clínica y estudios complementarios."

## Casos de prueba (cálculo manual)

| Edad | AST | ALT | Plaquetas | FIB-4 | Mostrado | Categoría |
|---|---|---|---|---|---|---|
| 50 | 40 | 36 | 200 | 2000 / (200 × 6) = 1.6667 | 1.67 | Indeterminado |
| 40 | 20 | 25 | 250 | 800 / (250 × 5) = 0.64 | 0.64 | Baja |
| 65 | 80 | 36 | 100 | 5200 / (100 × 6) = 8.6667 | 8.67 | Alta |
| 58 | 50 | 100 | 200 | 2900 / 2000 = 1.45 | 1.45 | Indeterminado (límite inferior inclusivo) |
| 65 | 100 | 100 | 200 | 6500 / 2000 = 3.25 | 3.25 | Indeterminado (límite superior inclusivo) |

Casos de error:

| Entrada | Esperado |
|---|---|
| ALT 0 | Error de rango, sin resultado |
| Plaquetas vacías | "Falta: Plaquetas", sin resultado |
| Edad 17 | Error de rango, sin resultado |

## Criterios de aceptación

- [ ] El formulario muestra los cuatro campos con su unidad.
- [ ] Con los cuatro válidos aparece el índice con 2 decimales y su categoría sin otra acción.
- [ ] Los cinco casos de prueba producen lo indicado, incluidos los dos límites.
- [ ] Un valor fuera de rango muestra error al salir del campo y no hay resultado.
- [ ] Se muestran la fuente y la nota de interpretación.

## Tasks

- [ ] Definición de la calculadora (campos, fórmula, categorías).
- [ ] Función `calcularFib4` y pruebas con la tabla de casos (límites incluidos).
- [ ] Registrar en el catálogo (especialidad: gastroenterología / hepatología) con palabras clave "FIB4", "fibrosis".
- [ ] Probar los criterios de aceptación.

## Pendientes

- [ ] Consultar el artículo original y confirmar fórmula y cortes.
- [ ] Validar con un médico la advertencia de población y los rangos válidos.
- [ ] Definir si se agrega una pista de valor normal por laboratorio.
- [ ] Decidir si C05 entra al MVP o queda como extra.
