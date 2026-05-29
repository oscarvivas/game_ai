---
name: 4-ui-ux-hud-flow
description: >
  Diseña y construye el flujo de UI: menú, HUD, pausa, game over, tutorial mínimo y accesibilidad básica.
  Úsalo cuando el juego ya corre pero no "se siente producto".
---

# UI/UX + HUD + Flow

## Objetivo
Convertir un prototipo en un producto demo-presentable:
- Flujo claro
- HUD útil
- Mensajes de estado (win/lose)
- Controles entendibles

## Fuente de verdad
- Lee `HACKATHON_SPEC.md`: UI mínima requerida + demo script.

## Salidas obligatorias
- Pantalla de inicio (Start)
- HUD (vida/score/tiempo)
- Pausa (opcional si MVP lo pide)
- Game Over + Restart

## Procedimiento
1) Alinea UI con el demo script: la UI debe soportar el guion.
2) Define jerarquía visual mínima:
   - Elementos críticos (vida) visibles siempre
   - Score/tiempo legibles
3) Agrega instrucciones de controles (texto corto).
4) Asegura accesibilidad básica:
   - Contraste aceptable
   - Tamaños legibles
5) Evita menús largos; 1–2 acciones máximo.

## Guardrails
- UI no debe bloquear performance.
- Evita “feature creep” (settings avanzados, perfiles, etc.).
- Si falta tiempo: texto + layout limpio > estilos complejos.

## Checklist demo
- [ ] Se entiende cómo jugar en 5 segundos
- [ ] Restart funciona siempre
