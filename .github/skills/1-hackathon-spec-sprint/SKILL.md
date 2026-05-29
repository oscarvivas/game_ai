---
name: 1-hackathon-spec-sprint
description: >
  Convierte un reto ambiguo de hackathon en un HACKATHON_SPEC.md claro, priorizado y demostrable (MVP + criterios de aceptación + demo script). 
  Úsalo inmediatamente al recibir el reto o cuando el alcance cambie.
---

# Hackathon Spec Sprint (Requerimiento → Spec lista para construir)

## Objetivo
Transformar el requerimiento del reto en un artefacto único (`HACKATHON_SPEC.md`) que:
- Reduzca ambigüedad.
- Permita dividir trabajo en paralelo.
- Defina MVP y “Definition of Done” de la demo.

## Fuente de verdad (obligatorio)
- `HACKATHON_SPEC.md` es el contrato. 
- Si no existe, créalo. Si existe, actualízalo sin romper estructura.

## Entradas mínimas
- Texto del reto (tal cual lo entregan).
- Restricciones del evento (tiempo, stack, reglas).

## Salidas obligatorias (en el spec)
1) Elevator pitch (1 párrafo)
2) MVP (máx 5 bullets)
3) Nice-to-have (máx 5 bullets)
4) Game rules (inputs, win/lose)
5) AI Concept visible (qué hace AI y cómo se observa)
6) Acceptance criteria (checklist demo)
7) Demo script (60–90s)
8) Assumptions (todo lo inferido)
9) Risks + mitigación (máx 5)

## Procedimiento
1) Copia el requerimiento literal bajo una sección "Original Prompt / Reto".
2) Extrae objetivos y restricciones explícitas (sin inventar).
3) Propón un MVP de 1 “vertical slice” jugable.
4) Define qué parte del juego demuestra AI de forma observable.
5) Redacta criterios de aceptación que se puedan comprobar en vivo.
6) Escribe el demo script como pasos, no como narrativa.

## Guardrails (anti-deriva)
- No diseñes features fuera de MVP si el tiempo es crítico.
- Toda ambigüedad va a `Assumptions` (nunca se “asume silenciosamente”).
- Si un cambio rompe el MVP, debes re-priorizar el MVP, no expandirlo.

## Checklist final
- [ ] MVP cabe en 60–90 minutos de implementación base.
- [ ] AI es observable durante gameplay (no solo en docs).
- [ ] Demo script puede ejecutarse en 1 minuto.