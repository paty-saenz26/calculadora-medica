# Modelo de datos

> Versión 0.1 (borrador). Primero se describen las entidades; la herramienta de almacenamiento se decide en el plan.

## Entidades

### Calculadora (vive en el código de la app)
Definición de una calculadora. No se guarda en base de datos: así funciona siempre sin conexión (P2).

```ts
Calculadora {
  id            // "pam", "cha2ds2-vasc", ...
  nombre
  descripcion   // una línea, se muestra en la lista
  especialidades // para la pestaña Especialidades
  version       // sube cuando cambia la fórmula, los campos o el redondeo
  fuente        // cita de la referencia clínica
  campos        // lista de Campo
  reglas        // validaciones entre campos (p. ej. diastólica menor que sistólica), cada una con su mensaje de error
  calcular(valores) -> Resultado
}
```

### Campo (parte de la definición de una calculadora)
Tres tipos base (P7). Cualquiera puede ser opcional.

```ts
CampoNumero {
  id, etiqueta
  unidades      // cada una con su factor de conversión a la unidad base
  unidadBase
  rangoValido   // rechaza errores de captura
  rangoNormal?  // solo informativo
  opcional?
}

CampoOpcion {
  id, etiqueta
  opciones      // { valor, etiqueta, puntos? }
  opcional?
}

CampoSiNo {
  id, etiqueta
  puntos?       // puntos que suma si la respuesta es Sí
  valorInicial? // Sí o No; si se define, el campo inicia con ese valor y no cuenta como pendiente
  opcional?
}
```

### Resultado
```ts
Resultado {
  valor         // número o puntaje
  unidad?
  interpretacion // texto breve
}
```

### CálculoGuardado (entidad principal del CRUD, D9)
Es una foto de lo que el usuario vio al calcular.

```ts
CalculoGuardado {
  id
  usuarioId?          // solo con cuenta
  calculadoraId
  calculadoraVersion
  valores             // lista de { campoId, valor, unidad? } tal como se ingresaron
  resultado           // Resultado tal como se mostró
  fecha               // momento en que se guardó (al salir de la pantalla)
  nota?               // texto corto opcional
}
```

### Favorito
```ts
Favorito {
  usuarioId?          // solo con cuenta
  calculadoraId
  fecha               // para ordenar
}
```

### Usuario
Lo maneja el servicio de autenticación: ID y correo. La app no guarda contraseñas.

### Solo en el teléfono (no se sincronizan)
```ts
AjustesLocales {
  bienvenidaVista     // true tras la primera vez (D1b)
}

OperacionPendiente {  // cola de guardados sin conexión (D6)
  id, tipo, datos, fecha
  // tipo: crear cálculo | editar nota | eliminar cálculo | agregar o quitar favorito
}
```

## Dónde vive cada cosa

| Entidad | Invitado | Con cuenta |
|---|---|---|
| Calculadora | Código | Código |
| CálculoGuardado | Teléfono | Nube (fuente de verdad) |
| Favorito | Teléfono | Nube (fuente de verdad) |
| Usuario | No existe | Servicio de autenticación |
| AjustesLocales | Teléfono | Teléfono |
| OperacionPendiente | No aplica | Teléfono, hasta sincronizar |

## Reglas del modelo

- **R1.** Un CálculoGuardado se crea al salir de la pantalla de la calculadora, solo si hay resultado válido (D4).
- **R2.** Un CálculoGuardado no cambia después de creado: solo se puede editar su nota o eliminarlo (D9).
- **R3.** Los valores se guardan con la unidad con que se ingresaron; la conversión a la unidad base ocurre solo al calcular.
- **R4.** La nota nunca se incluye al compartir (D7).
- **R5.** Un Favorito es único por usuario y calculadora.
- **R6.** Los datos en la nube solo los puede leer y modificar su dueño (P3).
- **R7.** Al aceptar el aviso de D8, los cálculos y favoritos locales se crean en la cuenta; los favoritos repetidos se fusionan en uno solo.
- **R8.** La pestaña **Recientes** no es una entidad: se deriva del historial, tomando la fecha más reciente por calculadora. Una calculadora abierta sin resultado válido no aparece.

## Pendientes del modelo
- [ ] Longitud máxima de la nota (se define en la spec de F05).
- [ ] Qué hacer si el usuario vuelve a una calculadora con los mismos valores que el último guardado (¿duplicar o no?) (se define en la spec de F05).
- [ ] Estructura concreta en la nube (depende de la decisión de backend).
