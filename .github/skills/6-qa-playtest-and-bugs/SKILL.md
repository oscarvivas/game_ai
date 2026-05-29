---
name: 6-qa-playtest-and-bugs
description: >
  Ejecuta QA rápido para hackathon: checklist de jugabilidad, smoke tests, bug triage (P0/P1/P2) y plan de fixes para demo.
  Úsalo antes de integrar features grandes y antes del deploy final.
---

# QA / Playtest / Bug Triage

## Objetivo
Asegurar que el juego se pueda demostrar sin sorpresas.

## Fuente de verdad
- Lee `HACKATHON_SPEC.md` → Acceptance Criteria + Demo Script.

## Salidas obligatorias
- Lista de bugs priorizados:
  - P0: rompe demo / crashea / bloquea input
  - P1: afecta gameplay severamente
  - P2: cosmetic
- Checklist de demo “pass/fail”.

## Procedimiento
1) Corre playtest con enfoque demo (60–90s).
2) Valida:
   - start → playing → lose/win → restart
   - inputs siempre responden
   - score/vida se actualiza
3) Identifica bugs y clasifica P0/P1/P2.
4) Propón fixes de menor riesgo (no refactors grandes al final).
5) Repite playtest tras cada fix P0.

## Guardrails
- No metas features nuevas durante ventana de estabilidad.
- Si un fix implica refactor grande, busca workaround seguro para demo.

## Checklist demo
- [ ] Demo script pasa 3 veces seguidas sin fallar
- [ ] No hay P0 pendientes