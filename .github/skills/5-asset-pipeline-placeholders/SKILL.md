---
name: 5-asset-pipeline-placeholders
description: >
  Pipeline de assets para hackathon: crear placeholders consistentes rápido, mantener paths estables,
  reemplazar solo assets críticos sin romper código, y registrar fuentes/licencias.
  Úsalo al iniciar el proyecto, al agregar entidades/UI, o antes de pulir para la demo.
compatibility: >
  Funciona offline con placeholders. Opcional: usa herramientas externas de generación de imágenes (fuera del repo)
  para crear sprites finales.
metadata:
  author: hackathon-team
  version: "2.0"
---

# Pipeline de Assets (Placeholders → Final) — v2 (Optimizado para Hackathon)

## Por qué existe este skill
En hackathons, los assets suelen bloquear el desarrollo. Este skill evita que el arte frene el gameplay,
mantiene consistencia visual y permite reemplazar archivos sin romper el código.

Este skill sigue la estructura típica de Agent Skills: un `SKILL.md` + recursos opcionales en `references/` y `assets/`. [1](https://learn.microsoft.com/en-us/agent-framework/agents/skills)[2](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-agent-skills?view=visualstudio)

---

## Fuente de verdad
- Siempre lee primero `HACKATHON_SPEC.md`.
- Los assets del MVP deben derivarse del MVP y del demo script del spec.

---

## Reglas obligatorias (NO negociables)
1) **Nunca bloquees gameplay esperando arte.** Siempre empieza con placeholders.
2) **Los paths estables son sagrados.** Una vez que el código referencia un asset, NO debes renombrarlo ni moverlo.
3) **Consistencia > calidad.** Mejor un estilo simple coherente que un mix de packs “bonitos”.
4) **Reemplaza, no refactorices.** Cambia archivos “in-place” (mismo nombre, mismo path).
5) **Registra licencias.** Todo asset no-original debe quedar en `ASSET_SOURCES.md`.

---

## Outputs (archivos que este workflow mantiene)
Este skill DEBE crear/actualizar estos archivos en la raíz del repo:

1) `ASSET_MANIFEST.md`
   - Lista assets requeridos (MVP primero), tamaños, estilo y paths esperados.

2) `ASSET_SOURCES.md`
   - Registra origen de cada asset final (no-placeholder) + licencia/fuente.

Si ya existen, actualízalos sin cambiar su estructura.

---

## Convenciones de carpetas y nombres (default)
A menos que el repo ya use otra estructura, usa:

- `src/assets/sprites/`
- `src/assets/ui/`
- `src/assets/audio/`

Naming:
- minúsculas + guion bajo: `player.png`, `enemy_basic.png`, `bg_main.png`
- variantes: `player_idle.png`, `player_hit.png`
- nunca espacios

Política de tamaño (elige UNA y respétala):
- Pixel: 32x32 o 64x64
- Flat/minimal: 128x128 (formas simples)

Si `HACKATHON_SPEC.md` define estilo/tamaño, manda el spec.

---

## Motor de decisión (según tiempo disponible)
### Si el tiempo es **crítico**
- Mantén placeholders para todo.
- Reemplaza SOLO: player + enemigo principal + fondo principal (opcional).
- Sin animaciones.

### Si el tiempo es **moderado**
- Reemplaza: player, set de enemigos, íconos UI clave, fondo principal.
- Agrega 1–2 SFX (hit, confirmación).

### Si el tiempo es **cómodo**
- Agrega polish: variaciones, partículas, fondos extra.
- Aun así, NO expandas scope fuera de MVP salvo pedido explícito.

### Si el estilo se ve inconsistente
- Detén nuevas fuentes.
- Normaliza estilo: recolor + simplificar + unificar grosor de outline.

---

## Workflow (paso a paso)
### Paso 1 — Extraer necesidades desde el spec
1) Lee `HACKATHON_SPEC.md`.
2) Genera lista priorizada:
   - Assets MVP necesarios para ejecutar el demo script
   - Nice-to-have solo si queda tiempo

### Paso 2 — Actualizar `ASSET_MANIFEST.md`
Crea o actualiza el manifest usando la plantilla:
- `./assets/ASSET_MANIFEST.template.md`

### Paso 3 — Crear placeholders de inmediato
Para cada entrada del manifest:
- Asegura que exista un placeholder en el path final exacto.
- Usa formas simples, colores claros y tamaños consistentes.

### Paso 4 — Integrar placeholders ASAP
- Confirma que el juego corre sin assets faltantes.
- Confirma que player/enemy/UI se distinguen claramente.

### Paso 5 — Reemplazar assets críticos (opcional)
Si hay tiempo:
- Usa prompts consistentes desde `./references/prompts-assets-ai.md`
  O usa UN solo pack externo cohesivo.
- Reemplaza “in-place” (mismo nombre, mismo path).

### Paso 6 — Registrar fuentes y licencias
Actualiza `ASSET_SOURCES.md` usando:
- `./assets/ASSET_SOURCES.template.md`

### Paso 7 — Chequeo de demo (listo para presentar)
- Ejecuta el demo script 3 veces.
- Verifica: no hay assets faltantes, no hay paths rotos.

---

## Quality gates (condiciones para detenerse)
- Si falta un asset y rompe el juego → corrige ya (placeholder primero).
- Si un asset “final” obliga a cambiar código → recházalo; deja placeholder.
- Si hay inconsistencia visual → congela fuentes y normaliza.

---

## Recursos (progressive disclosure)
- Guía de estilo: `./references/guia-estilo-assets.md`
- Prompts AI: `./references/prompts-assets-ai.md`
- Plantillas:
  - `./assets/ASSET_MANIFEST.template.md`
  - `./assets/ASSET_SOURCES.template.md`

---

## Antipatrones (NO hacer)
- No busques “arte perfecto” temprano.
- No mezcles 3 estilos distintos.
- No renombres archivos después de integrarlos.
- No agregues assets que no estén usados por