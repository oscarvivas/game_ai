---
name: 2-game-loop-core
description: >
  Diseña e implementa el core jugable: game loop, estados, reglas win/lose, scoring y timing.
  Úsalo cuando el proyecto aún no es "jugable" o cuando el loop se rompe.
---

# Game Loop & Core Mechanics

## Objetivo
Asegurar que existe un "vertical slice" jugable:
- Input → Update → Render
- Win/Lose
- Feedback inmediato
- Progresión básica (score/tiempo/oleadas)

## Fuente de verdad
- Lee `HACKATHON_SPEC.md` y respeta MVP + Game Rules + Acceptance Criteria.

## Salidas
- Un loop principal definido.
- Un estado de juego mínimo: `menu`, `playing`, `paused`, `gameover`.
- Reglas explícitas de colisión/daño/score.

## Procedimiento
1) Identifica el "core verb" del juego (correr, esquivar, disparar, resolver, etc.).
2) Define estados mínimos (no más de 4).
3) Define win/lose con condiciones medibles.
4) Define scoring simple (puntos o tiempo o ambos).
5) Define feedback mínimo (visual y/o sonoro).
6) Asegura que el loop funciona incluso con assets placeholder.

## Guardrails
- Evita arquitectura compleja al inicio (no ECS completo si no es necesario).
- Primero jugable, luego “juice”.
- Si una mecánica toma >15 min y no es MVP, se degrada a placeholder.

## Verificación rápida (demo-ready)
- [ ] Se puede iniciar una partida
- [ ] Se puede perder
- [ ] Se puede ganar o alcanzar objetivo
- [ ] Score/tiempo cambia durante el juego