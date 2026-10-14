# Calculadora Médica

App móvil en español con calculadoras y escalas clínicas para agilizar la práctica médica en entorno hospitalario. Proyecto integral de la materia Aplicaciones Móviles (UABC, FIAD).

**Estado:** en especificación (desarrollo guiado por specs, SDD).

## Cómo está organizado el proyecto

- `specs/constitution.md`: principios no negociables del proyecto.
- `specs/00-project.md`: problema, usuario, MVP, alcance y decisiones tomadas.
- `specs/02-data-model.md`: entidades y reglas de datos.
- `specs/features/`: una spec por funcionalidad (F01, F02, ...).
- `specs/calculators/`: una spec por calculadora (C01, C02, ...), con fuente, rangos y casos de prueba.

## Stack previsto

Expo, React Native y TypeScript. Backend y estado global por decidir (ver pendientes en `specs/00-project.md`).
