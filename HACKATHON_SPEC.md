# HACKATHON_SPEC.md

## 1. Nombre del juego
Shift Axis: Overdrive

## 2. Reto y objetivo
Construir un juego web completo y funcional en 1 hora, demostrable en 90 segundos, que corra en Google Chrome y muestre:
- Mecanica principal clara.
- Sistema de puntaje.
- Condicion de cierre (ganar o perder).
- Boton de reinicio.
- Momento wow visual durante la partida.
- Jugabilidad divertida.
- Uso efectivo de IA y Devin en el proceso de desarrollo y en el producto.
- Creatividad y calidad visual/sonora.

## 3. Elevator pitch
Juego arcade de un boton donde el jugador invierte su posicion entre arriba/abajo de un eje central para sobrevivir, sumar puntos y activar Overdrive, un estado espectacular de alto impacto visual y sonoro.

## 4. MVP (obligatorio)
### 4.1 Core jugable
- Pantalla inicial con instruccion para comenzar.
- Bucle jugable funcional: input -> update -> render.
- Control unico (Space/click/touch) para alternar posicion del jugador.
- Obstaculos que causan derrota al colisionar.
- Objetos recolectables para sumar puntos y habilitar racha/multiplicador.

### 4.2 Reglas de cierre
- Victoria: alcanzar puntaje objetivo (por defecto: 1000).
- Derrota: colision fatal con obstaculo.
- Ambos estados deben detener la partida y mostrar resultado.

### 4.3 UI minima requerida
- HUD con puntaje actual.
- Indicador de multiplicador o estado de racha.
- Mensaje de victoria/derrota.
- Boton de reinicio funcional (sin recargar pagina).

### 4.4 Momento wow (obligatorio)
Cuando el jugador entra en Overdrive:
- Rotacion/transformacion del contenedor de juego.
- Cambio fuerte de paleta (filtro, glow, contrastes).
- Refuerzo sonoro (subida de energia) y feedback visual de impacto.

## 5. Mecanica principal del juego
- El jugador permanece en X fija.
- El mundo (obstaculos y orbes) se desplaza de derecha a izquierda.
- Al pulsar Space/click/touch, el jugador alterna instantaneamente entre carril superior e inferior.
- Sobrevivir suma puntaje continuo.
- Recolectar orbes aumenta puntaje y puede elevar multiplicador.

## 6. IA y uso de Devin (criterio del reto)
## 6.1 IA visible en el juego
Debe existir al menos un comportamiento observable impulsado por IA/heuristica adaptativa:
- Enemigos ajustan frecuencia o patron segun estilo del jugador (ejemplo: si cambia poco de carril, spawnea patron que lo fuerce a reaccionar).
- O director de dificultad dinamica que adapta velocidad/spawn en tiempo real.

## 6.2 IA/Devin en desarrollo
Se debe evidenciar uso efectivo de IA y Devin para acelerar produccion:
- Generacion de estructura base y loop.
- Ajuste rapido de balance y parametros.
- Creacion/mejora de efectos visuales y sonoros.
- Registro breve en README o notas de que fue co-creado con IA/Devin.

Supuesto explicito: "Devin" se interpreta como asistente de desarrollo asistido por IA durante construccion y refinamiento.

## 7. Requisitos visuales y sonoros
- Estilo visual coherente (retro-neon o equivalente), no placeholder plano sin pulido.
- Efectos minimos de game feel: glow, trail, shake o ripple.
- Sonido funcional:
- Efecto para input/salto de carril.
- Efecto para colision/recolectable.
- Efecto distintivo para Overdrive.
- Rendimiento fluido en Chrome (objetivo: percepcion estable cercana a 60 FPS).

## 8. Alcance fuera de MVP (si sobra tiempo)
- Menu de pausa.
- Mas tipos de enemigos/orbes.
- Tabla de mejores puntajes local.
- Narrativa corta de inicio/cierre.

## 9. Arquitectura sugerida
- index.html: canvas, HUD, overlays de estado.
- style.css: layout responsive, paleta, efectos y animaciones.
- script.js: estado global, entidades, colisiones, game loop, AI adaptativa.
- assets/: audio e imagenes minimas (si aplica).

## 10. Estados del juego
- START
- PLAYING
- VICTORY
- GAME_OVER

Transiciones obligatorias:
- START -> PLAYING
- PLAYING -> VICTORY o GAME_OVER
- VICTORY/GAME_OVER -> PLAYING (reinicio)

## 11. Criterios de aceptacion (Definition of Done)
- El juego abre y funciona en Google Chrome sin errores bloqueantes.
- Existe mecanica principal claramente jugable desde el segundo 1.
- El puntaje se ve y se actualiza en tiempo real.
- Hay condicion de victoria o derrota implementada y comprobable.
- El boton de reinicio reinicia completamente la sesion de juego.
- El momento wow ocurre en una partida normal y es claramente visible.
- Existe al menos un uso de IA visible dentro del gameplay.
- El juego se puede demostrar completo en 90 segundos.
- Calidad visual y sonora suficiente para una demo de hackathon.

## 12. Guion de demo (90 segundos)
- 0-15s: abrir juego en Chrome, explicar objetivo en una frase.
- 15-40s: mostrar mecanica principal (cambio de carril) y puntaje en vivo.
- 40-65s: evidenciar IA adaptativa (dificultad/patrones cambian por comportamiento).
- 65-80s: activar momento wow (Overdrive) con impacto visual y sonoro.
- 80-90s: provocar cierre (victoria o derrota) y usar boton de reinicio.

## 13. Plan de implementacion (1 hora)
- Min 0-10: estructura base + estados + loop.
- Min 10-20: input y movimiento binario del jugador.
- Min 20-35: obstaculos/orbes + colisiones + score.
- Min 35-45: cierre (win/lose) + overlays + reinicio.
- Min 45-55: IA adaptativa visible + balance minimo.
- Min 55-60: momento wow + pulido audiovisual + smoke test en Chrome.

## 14. Riesgos y mitigacion
- Riesgo: IA muy compleja para 1 hora.
- Mitigacion: usar heuristicas simples pero visibles y explicables.

- Riesgo: falta de pulido visual/sonoro.
- Mitigacion: priorizar 3 efectos de alto impacto (glow, shake, overdrive sfx).

- Riesgo: demo falla por bug de estado.
- Mitigacion: probar 3 flujos antes de cerrar (inicio, derrota, reinicio).

## 15. Entregables
- Codigo fuente del juego web.
- HACKATHON_SPEC.md actualizado.
- Demo funcional de 90 segundos en Chrome.
- Nota corta del uso de IA/Devin en el desarrollo.
