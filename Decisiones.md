# Diario de decisiones

- **D1**: Acceso con modo invitado o registrarse con cuenta de manera opcional, porque las calculadoras deben servir sin registro para         agilizar el proceso.

- **D2**: Navegacion: 3 tabs, stack, modales, porque es simple de usar.

- **D3**: Estado global con Zustand y persistencia en AsyncStorage, porque es ligero y facil de probar.

- **D4**: Firebase (Auth + Firestore), porque cuenta como mi backend y cubre las operaciones.

- **D5**: Con cuenta, la nube es la fuente, el invitado solo local, porque evita conflictos entre dispositivos.

- **D8**: Al iniciar sesion, un aviso unico pregunta si pasar los datos de invitado a la cuenta, para no perder datos y no mezclarlos sin permiso.

- **D9**: Cada calculo guarda una foto completa (valores, unidad, resultado, fecha), para que el historial no cambie si cambia una formula.

- **D10-D13**: Resultado en vivo sin presionar algun boton, error de rango solo al salir del campo, conversion de unidades segura, porque es mas agil y sin riesgo clinico por unidades.

- **D14**: Historial sin duplicados identicos, guardar al salir de la calculadora, para no llenar el historial de calculos replicados.

- **D15**: Compartir texto y enlace corto, sin internet, enlace largo con el resultado dentro, porque compartir nunca debe fallar. Espera de 5 s: menos fallaba en redes lentas, mas se sentia congelado.

- **D16**: Diseno verde suave, Hanken Grotesk, tarjetas tipo cristal, ya por cuestion personal aunque el profe me dijo que parecia del imss, lo probe con dos medicos y les gusto igual, de hecho trate de agrear un modo oscuro, pero no me gustaba como se veia.

- **D17**: Solo vertical. Por que: es una herramienta de uso rapido, no hay necesidad de rotar.

- **D18**: Campos numericos con teclado de digitos, maximo 8 caracteres, porque evita aceptar entradas invalidas como letras y valores negativos el rango se valida al salir.

- **D19**: Catalogo de 19 calculadora, se quito Urgencias y CHA2DS2-VASc, porque estaban repetidas.

- **D20**: Liga de entrega con EAS Update, abierta con Expo Go, porque npx expo start solo sirve con mi laptop encendida.

- **D21**: El significado del resultado se muestra tambien con el teclado abierto, antes solo aparecia al cerrar el teclado y parecia que la app no explicaba el resultado del  valor obtenido.

- **D22**: CHA2DS2-VA muestra una recomendacion distinta segun el puntaje (0, 1, 2 o mas; guia ESC 2024), porque estaba mostrando el mismo mensaje despues de calcular cualquier valor y debe ser variable.

- **D23**: Aclaramiento de creatinina la dejamos con una nota fija porque no tiene una clasificacion estandar unica para ese valor.

