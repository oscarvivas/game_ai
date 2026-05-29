# 🎮 HACKATHON SPEC – "NeuroRogue: Adaptive AI Dungeon"

## 1. 🎯 Elevator Pitch
"NeuroRogue" es un dungeon crawler web donde el comportamiento de los enemigos evoluciona dinámicamente en función del estilo de juego del usuario usando AI. Cada partida es distinta, ya que los enemigos aprenden y se adaptan.

---

## 2. 🧠 AI Concept (MANDATORY for evaluation)
El juego utiliza AI para:
- Analizar el comportamiento del jugador (movimientos, ataques, decisiones).
- Generar estrategias adaptativas de enemigos.
- Ajustar dificultad en tiempo real (Dynamic Difficulty Adjustment).
- Opcional: generar descripciones narrativas dinámicas del dungeon.

👉 El objetivo NO es solo usar AI, sino que sea visible en gameplay.

---

## 3. ✅ MVP (Must Have)
Estas funcionalidades deben estar COMPLETAS para la demo:

### Gameplay Core
- Movimiento del jugador en grid o libre.
- Al menos 1 tipo de enemigo.
- Sistema de combate (ataque y daño).
- Condición de victoria (sobrevivir X tiempo o eliminar enemigos).
- Condición de derrota (vida = 0).

### AI Adaptativa (CORE DIFERENCIADOR)
- El enemigo cambia comportamiento según el estilo del jugador:
  - Ej: si el jugador evade → enemigo persigue más agresivamente
  - Ej: si el jugador ataca constantemente → enemigo esquiva o contraataca

### UI mínima
- Pantalla de juego
- HUD (vida + score o tiempo)
- Pantalla de Game Over

---

## 4. ✨ Nice to Have (si hay tiempo)
- Múltiples tipos de enemigos con comportamientos distintos
- Generación procedural simple del dungeon
- Narrativa dinámica generada por AI
- Power-ups
- Animaciones / efectos visuales (juice)

---

## 5. 🎮 Game Rules

### Player
- Input: teclado (WASD o flechas)
- Acciones:
  - Mover
  - Atacar

### Enemigo
- Tiene al menos 2 estados:
  - Perseguir
  - Esquivar / táctico (dependiendo del jugador)

### Combate
- Ataque reduce vida
- Feedback visual (mínimo cambio de color)

### Loop principal
1. Input jugador
2. Update estado jugador
3. AI evalúa comportamiento del jugador
4. Enemy decide acción
5. Render

---

## 6. 🏗️ Technical Constraints

### Stack
- Web (Canvas/WebGL/Framework 2D: Phaser sugerido)
- Frontend-only (idealmente sin backend complejo)
- Deploy en entorno público (GitHub Pages, Vercel, etc.)

### AI Constraints
- Puede ser:
  - Reglas heurísticas (simulando "inteligencia")
  - Uso real de modelo AI (si hay tiempo)
- Debe ser:
  - Visible
  - Explicable en demo

---

## 7. 📊 Player Behavior Model (Base para AI)

Se monitorean estas métricas:

- Frecuencia de ataque
- Frecuencia de movimiento
- Tiempo sin atacar
- Distancia promedio a enemigos

### Clasificación de jugador (ejemplo):
- AGRESIVO → ataca constantemente
- DEFENSIVO → evade más que ataca
- EXPLORADOR → se mueve constantemente

👉 Esto alimenta la lógica adaptativa del enemigo.

---

## 8. 🤖 Enemy Adaptation Rules

| Player Type | Enemy Behavior |
|------------|--------------|
| Agresivo   | Retirada + contraataques |
| Defensivo  | Persecución agresiva |
| Explorador | Emboscadas / interceptación |

✅ Debe haber al menos 1 cambio observable en runtime.

---

## 9. 🧪 Acceptance Criteria (CRÍTICO)

Para considerar el proyecto terminado:

- ✅ El juego inicia sin errores
- ✅ El jugador puede morir o ganar
- ✅ Hay al menos 1 comportamiento adaptativo observable
- ✅ La AI responde diferente a distintos estilos de juego
- ✅ El juego es demostrable en 60–90 segundos

---

## 10. 🧪 Demo Script (OBLIGATORIO)

### Escenario 1
- Jugar agresivo (solo atacar)
→ Mostrar que el enemigo cambia comportamiento

### Escenario 2
- Jugar evasivo (solo moverse)
→ Ver comportamiento distinto del enemigo

### Explicación (30s)
- “Nuestro juego usa AI para adaptarse al jugador...”

---

## 11. ⚠️ Assumptions (para alinear equipo)

- Solo 1 nivel (no mapa gigante)
- No hay persistencia entre partidas
- Assets pueden ser placeholders
- Animaciones no son obligatorias

---

## 12. 🚧 Risks

| Riesgo | Mitigación |
|-------|-----------|
| AI muy compleja | Usar reglas simples pero visibles |
| Falta de tiempo | Priorizar loop jugable + adaptación |
| Bugs de integración | PRs pequeños + pruebas rápidas |

---

## 13. 📦 Deliverables

- Repo público
- Juego deployado (URL)
- HACKATHON_SPEC.md actualizado
- Demo funcional

---

## 14. 🎤 Pitch (para cerrar la hackathon)

"NeuroRogue no es solo un juego… es un juego que aprende de ti.  
Cada decisión cambia cómo el mundo responde."

---

``