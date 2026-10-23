# Proyecto: Calculadora Médica

> Nombre provisional. Versión 0.1 (borrador) · 9 de octubre de 2026

## Problema

En la práctica clínica diaria, el personal médico necesita calcular índices y escalas de forma constante. Hacerlo manualmente consume tiempo y aumenta el riesgo de errores, especialmente en urgencias o con alta carga de pacientes. Las aplicaciones existentes están mayormente en inglés, y las que están en español limitan sus funciones en la versión gratuita.

## Usuario objetivo

Médicos en general que trabajan en entorno hospitalario. Usan la app **de pie, con prisa, con o sin guantes, con una o dos manos**, por lo que la velocidad y la facilidad de uso son prioritarias.

## Propuesta de solución

Una app móvil en español que permite calcular fórmulas y escalas clínicas de forma precisa y rápida: búsqueda inmediata, resultado en vivo mientras se capturan los datos, favoritos, historial y la posibilidad de compartir el resultado como tarjeta o como texto.

## MVP

| ID | Feature | Resumen |
|---|---|---|
| F01 | Acceso y sesión | Modo invitado o cuenta (registro e inicio de sesión), con sesión persistente |
| F02 | Catálogo y búsqueda | Lista de calculadoras con búsqueda y pestañas Recientes, Favoritas, Especialidades y Todas |
| F03 | Calculadora con resultado en vivo | Motor de calculadoras con validación y resultado sin botón "Calcular" |
| F04 | Favoritos | Marcar calculadoras con estrella para tenerlas a la mano |
| F05 | Historial (CRUD) | Guardado automático al salir de la calculadora, lista paginada, nota y eliminación |
| F06 | Compartir resultado | Tarjeta como imagen o como texto, con la función nativa de compartir |
| F07 | Perfil | Cuenta (o invitar a iniciar sesión si es invitado) y cerrar sesión |

**Calculadoras iniciales del MVP** (cada una con su spec en `calculators/`):

| ID | Calculadora | Tipo de campos que cubre |
|---|---|---|
| C01 | Presión arterial media (PAM) | Números con unidad |
| C02 | CHA₂DS₂-VASc | Opciones y sí/no con puntos |
| C03 | Aclaramiento de creatinina (Cockcroft-Gault) | Números con unidades alternables, selección y campo opcional |
| C04 | IMC y superficie corporal | Números con unidades |

## Funcionalidades futuras

- Más calculadoras: CKD-EPI, FIB-4, QTc, Glasgow, CRB-65, Wells, HEART, PHQ-9, relación S/F, Child-Pugh y otras.
- Calculadoras con variantes de modelo (PREVENT) o reglas condicionales (PECARN).
- Edición de valores de un cálculo del historial y recálculo.
- Enlaces para compartir una calculadora (no solo un resultado).
- Modo oscuro.

## Fuera de alcance

- Expediente o datos identificables de pacientes.
- Notificaciones push.
- Otros idiomas (la app es solo en español).
- Roles o administración de usuarios.
- Versión web.

## Decisiones tomadas

| # | Tema | Decisión |
|---|---|---|
| D1 | Acceso | Invitado + cuenta opcional. Las calculadoras funcionan sin cuenta; la cuenta da historial y favoritos sincronizados |
| D1b | Bienvenida | Solo la primera vez; después abre directo y el login queda disponible en Perfil. La sesión persiste hasta cerrar sesión |
| D2 | Update del CRUD | Nota o etiqueta corta en cada cálculo del historial |
| D3 | Favoritos | Calculadoras marcadas con estrella; guardan la calculadora, no un resultado |
| D4 | Resultado | En vivo, con barra fija abajo; el historial se guarda al salir de la pantalla si hay resultado válido |
| D5 | Navegación | 3 tabs inferiores (Inicio, Historial, Perfil); Stack Inicio → Calculadora; modales para vista previa de tarjeta y edición de nota |
| D6 | Datos | Con cuenta, la nube es la fuente de verdad; invitado solo local; guardados pendientes se reintentan sin conexión; las calculadoras viven en el código |
| D7 | Compartir | Modal con "Compartir imagen" (principal) y "Compartir texto"; la nota nunca se incluye |
| D8 | Datos de invitado al crear cuenta | Al registrarse o iniciar sesión, un aviso único pregunta si agregar a la cuenta los cálculos y favoritos locales. Si elige "No", se conservan en el teléfono como invitado, sin borrarse |
| D9 | Qué guarda un cálculo | Foto completa: calculadora y su versión, valores con la unidad ingresada, resultado, interpretación, fecha y nota. Solo la nota y la eliminación pueden cambiarlo después |
| D10 | Recientes | Se derivan del historial, sin lista aparte. Una calculadora abierta sin resultado válido no aparece, y al borrar cálculos del historial desaparecen de Recientes |
| D11 | Datos incompletos | La barra de resultado indica qué campos faltan; nunca se muestra un resultado parcial |
| D12 | Validación de rango | El error aparece al terminar de editar el campo, no mientras se escribe; con un valor inválido no se muestra resultado |
| D13 | Cambio de unidad | Regla de seguridad: al cambiar la unidad de un campo con valor, el número se convierte a la nueva unidad |
| D14 | Unidades | En toda calculadora con unidades alternables el usuario siempre puede cambiarlas con el botón de flechas; la creatinina inicia en mg/dL |
| D15 | Campos sí/no | Pueden iniciar en "No" (por ejemplo, en CHA₂DS₂-VASc) y el usuario cambia a "Sí" cuando aplique; los campos con valor inicial no cuentan como pendientes |
| D16 | Backend | Firebase (Authentication + Firestore). Confirmado por el docente el 18 oct 2026 |
| D17 | Feature nativa | Compartir (F06). El docente la confirmó como la más adecuada al proyecto |

## Pendientes

- [ ] Diseño visual: colores, estilo y nombre definitivo.
- [ ] Estado global (se sugiere Zustand).
- [ ] Calculadoras adicionales que se quieran subir al MVP.
