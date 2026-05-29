---
name: 8-team-integration-git-hygiene
description: >
  Acelera trabajo en equipo: estrategia de ramas ligera, commits y PRs pequeños, integración frecuente, resolución de conflictos y checklist de merge.
  Úsalo desde el inicio y cada vez que haya conflictos o integración riesgosa.
---

# Team Integration & Git Hygiene (Hackathon Mode)

## Objetivo
Reducir fricción de equipo y evitar que la integración mate el tiempo.

## Fuente de verdad
- Lee `HACKATHON_SPEC.md` → MVP para priorizar qué se integra primero.

## Estrategia recomendada (ligera)
- Rama principal estable (main)
- Features en ramas cortas por tarea
- PRs pequeños y frecuentes

## Procedimiento
1) Divide trabajo en tareas “mergeables” en < 30–45 min.
2) Define convenciones rápidas:
   - nombres de rama: `feat/core-loop`, `feat/hud`, `fix/collision`
   - commits: verbos + área (`Add HUD`, `Fix enemy spawn`)
3) Integra temprano:
   - primero core loop
   - luego UI mínima
   - luego AI feature
4) Antes de merge:
   - corre el juego
   - ejecuta demo script rápido

## Guardrails
- PR gigante = riesgo de conflicto. Divide.
- Evita refactors amplios durante integración final.
- Si hay conflicto, prioriza mantener demo estable sobre perfección.

## Checklist de merge
- [ ] El juego corre después del merge
- [ ] No se rompió el demo script