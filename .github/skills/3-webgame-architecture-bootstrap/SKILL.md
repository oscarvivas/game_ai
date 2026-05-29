---
name: 3-webgame-architecture-bootstrap
description: >
  Inicializa la arquitectura mínima del juego web: estructura de carpetas, escena/estado, convenciones, configuración de dev server y baseline de rendimiento.
  Úsalo al empezar el repo o cuando el equipo está desordenado.
---

# Web Game Architecture Bootstrap

## Objetivo
Crear una base estable y simple para que el equipo trabaje en paralelo sin chocarse:
- Estructura clara
- Convenciones de nombres
- Separación de: core / scenes / entities / assets / ui

## Fuente de verdad
- Lee `HACKATHON_SPEC.md` y elige la ruta más corta para cumplir MVP.

## Salidas esperadas
- Estructura de carpetas y archivos “ancla”.
- Definición del sistema de escenas/estados.
- Puntos de extensión (dónde agregar features sin romper todo).

## Procedimiento
1) Selecciona enfoque de render (Canvas / librería 2D / WebGL) acorde al tiempo.
2) Define estructura mínima:
   - `src/core` (loop, time, input)
   - `src/scenes` (menu, game, gameover)
   - `src/entities` (player, enemy)
   - `src/ui` (hud)
   - `src/assets` (placeholders y finales)
3) Establece convenciones:
   - Nombres consistentes (kebab-case para assets, PascalCase para clases/objetos si aplica).
   - Un “single source of truth” para constantes del juego (tamaño, velocidad, etc.).
4) Asegura que el proyecto corre con 1 comando (dev).

## Guardrails
- No agregues capas por “elegancia”; agrega capas solo si reducen tiempo total.
- Evita dependencias pesadas que aumenten fricción de instalación.
- Prefiere soluciones deterministas y fáciles de depurar.

## Verificación
- [ ] Cualquier persona del equipo puede correr el proyecto localmente
- [ ] Las escenas se pueden alternar sin errores