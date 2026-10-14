# Calculadora Médica

Proyecto de Aplicaciones Móviles (Expo + React Native + TypeScript). Se desarrolla con SDD: la spec va primero.

## Antes de escribir código
1. Lee `specs/constitution.md` (principios no negociables).
2. Lee `specs/00-project.md` (alcance y decisiones D1 a D15) y `specs/02-data-model.md`.
3. Para una funcionalidad, lee su spec en `specs/features/`; para una calculadora, la suya en `specs/calculators/`.
4. Lee también `AGENTS.md` (guías de Expo).

## Reglas de trabajo
- Implementa **una tarea a la vez** de la sección Tasks de la spec, sin agregar funcionalidades nuevas.
- Si un requisito cambia, **actualiza primero la spec** y luego el código.
- La capa de dominio (cálculos) son funciones puras en TypeScript, sin dependencias de React, Expo ni Firebase.
- Las fórmulas se implementan solo desde la fuente citada en su spec. Los valores marcados "por validar" no se cambian sin consultarlo.
- Cada commit referencia el ID de la feature o calculadora (por ejemplo `feat(C01): calcula PAM`).
- Responde y documenta en español.
