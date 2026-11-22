# Bitácora de IA

**Herramienta:** Claude.
**Metodología:** SDD: primero specs, luego codigo con pruebas.
**Regla:** la IA proponia diversas formas de hacer las cosas con ventajas y desventajas, luego yo decidia y comprobaba en el celular. Todo cambio pasaba por `npm test`, `tsc` y prueba manual.

## Cosas que la IA propuso y yo rechacé

1. **Compartir el resultado como imagen (tarjeta).**
   Yo buscaba que se viera como una tarjeta con los datos de la calculadora utilizada y como una presentacion de la app, no solo como una imagen, ademas tambien que se pudiera mandar simplemente como textos si el usuario lo desea. Quedo como texto + enlace con vista previa.

2. **Cambiar el año de las referencias.**
    En algunas calculadoras la IA puso años de referencia que requerian de actualizacion, entonces lo cambiamos por referencias recientes aquellas que tenian una actualizacion.

3. **Aceptar coma como separador decimal.**
   La IA lo intentó, pero rompía la spec y su prueba, entonces le pedi cambiarlo.

4. **Calculadora CHA₂DS₂-VASc.**
   Incluyo una calculadora que es obseleta al dia de hoy y la cambiamos por su version actual.

## Dónde se equivocó la IA y cómo lo noté

En realidad la IA casi no tuvo detalles con eso, fueron cosas puntuales como:

1. **Cálculos hechos sin internet se perdían:** al tener conexion de nuevo, la nube sobrescribía lo local, Lo detecté probando los casos limite en modo avion. Se corrigio con una mezcla (`importarDeNube`) y una prueba nueva.
2. **Cálculos repetidos en el historial:** haciendo pruebas me di cuenta que al repetir un cálculo con los mismos valores no se reflejaba bien en el historial, entonces se corrigio para que ahora no crea un registro duplicado, pero el existente sube al primer lugar con la fecha nueva.

## Cómo verifiqué

- 365 pruebas automaticas unitarias y de integracion.
- Lista propia de casos limite en el celular: sin internet, formulario vacio, texto en campo numerico, numero negativo, texto largo, doble toque, salir y volver, historial vacío.