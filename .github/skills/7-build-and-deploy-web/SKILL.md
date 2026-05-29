---
name: 7-build-and-deploy-web
description: >
  Prepara build y deploy del juego web: scripts, configuración, optimización mínima y checklist de release.
  Úsalo cuando el MVP ya está jugable para asegurar demo pública estable.
---

# Build & Deploy (Web)

## Objetivo
Tener una URL deployada estable y reproducible para demo.

## Fuente de verdad
- Lee `HACKATHON_SPEC.md` → Deliverables + Constraints.

## Salidas
- Build reproducible
- Deploy listo (GitHub Pages / Vercel / Netlify, según el repo)
- Checklist de release

## Procedimiento
1) Define comandos estándar:
   - `dev`, `build`, `preview` (o equivalente)
2) Asegura que el build no depende de rutas locales.
3) Optimiza lo mínimo:
   - comprimir imágenes si aplica
   - evitar assets enormes
4) Verifica en ambiente similar a producción:
   - abrir URL
   - correr demo script
5) Documenta:
   - cómo correr local
   - cómo desplegar

## Guardrails
- No dependas de secretos/API keys si no son indispensables.
- Si AI runtime requiere API externa, define fallback local para demo.

## Checklist final
- [ ] URL pública funciona
- [ ] Demo script funciona en la URL pública
- [ ] README mínimo existe