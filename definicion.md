# Especificación del Juego: Shift Axis - Overdrive

## 1. Resumen del proyecto
"Shift Axis: Overdrive" es un juego web tipo endless runner minimalista, de un solo botón, que desafía los reflejos y la percepción espacial del jugador. A través de una mecánica de inversión de gravedad y un sistema de riesgo/recompensa, el jugador debe esquivar obstáculos y recolectar orbes de poder. El juego se basa en una progresión de adrenalina visual que culmina en un estado de "Overdrive" alterando completamente la interfaz.

## 2. Objetivo del juego
El jugador debe acumular 5,000 puntos en el menor tiempo posible recolectando orbes para incrementar su multiplicador y esquivando los obstáculos mortales.

## 3. Público objetivo
Jueces de hackathons, desarrolladores y jugadores casuales que buscan experiencias rápidas, mecánicas fáciles de aprender pero difíciles de dominar, y un alto nivel de retroalimentación visual (Game Feel).

## 4. Alcance del MVP
El MVP incluirá un bucle de juego funcional (Game Loop) usando HTML5 Canvas y CSS, controles de un solo botón (teclado/mouse), generación procedimental de obstáculos y orbes, detección de colisiones 2D (AABB), sistema de puntaje con multiplicador, dos poderes básicos (Escudo y Cámara Lenta) y el efecto visual de rotación para el "Momento Wow". Quedan fuera: bases de datos, menús complejos, uso de imágenes/sprites externos y audio complejo.

## 5. Mecánica principal
El juego avanza automáticamente de derecha a izquierda. El jugador controla un cuadrado que se mueve sobre una línea central fija. La única interacción posible es invertir la gravedad: al presionar la pantalla, clic o barra espaciadora, el jugador pasa instantáneamente de estar por encima de la línea central a estar por debajo, y viceversa. 

## 6. Personaje principal
El personaje es un cubo geométrico color neón (cian por defecto) que emite un brillo sutil (box-shadow en CSS o shadowBlur en Canvas) y deja un rastro (trail) al moverse. 
- Restricciones: Solo puede existir en la coordenada Y superior (tocando la línea) o en la coordenada Y inferior (tocando la línea). No tiene movimiento en el eje X (es estático; el mundo se mueve hacia él).

## 7. Sistema de puntaje
El puntaje se genera pasivamente por sobrevivir (10 puntos por segundo) y activamente al recolectar Orbes (100 puntos por orbe). Acumular orbes consecutivos sin fallar incrementa un multiplicador (x1, x2, x4). El multiplicador se muestra en pantalla y reinicia a x1 si el jugador pasa un orbe sin recogerlo. 

## 8. Condiciones de victoria
El juego debe terminar automáticamente en estado de "Victoria" en el instante en que la variable de puntaje total alcance o supere los 5,000 puntos.

## 9. Condiciones de derrota
El juego debe terminar automáticamente en estado de "Derrota" cuando el rectángulo de colisión del jugador se superponga con el rectángulo de colisión de un obstáculo rojo, siempre y cuando el jugador no tenga el poder "Phase Smash" (escudo) activo y no esté en estado "Overdrive".

## 10. Momento wow
El "Estado Overdrive". Cuando el multiplicador del jugador alcanza x4, el contenedor principal del juego (Canvas o envoltura CSS) aplicará una animación de rotación continua de 360 grados (transform: rotate). Simultáneamente, los colores se invertirán (filter: invert(1)) y los obstáculos rojos mortales se volverán vulnerables y destruibles por 10 segundos, otorgando puntos masivos.

## 11. Estados del juego
El sistema debe manejar los siguientes estados lógicos:
- *Pantalla inicial:* Muestra el título y la instrucción "Haz clic para empezar".
- *Jugando:* El bucle de juego está activo, el puntaje incrementa, las entidades se mueven.
- *Victoria:* Pantalla de felicitación, el juego se detiene, muestra el puntaje final y botón de reinicio.
- *Derrota:* Pantalla de "Game Over", el juego se detiene temporalmente, efecto de cámara agitada (screen shake) y botón de reinicio.
- *Reinicio:* Restablece todas las variables a su valor inicial y pasa al estado "Jugando".
- (Nota: No aplica estado Pausado para el MVP de 90 minutos).

## 12. Reglas del juego
- El sistema debe generar obstáculos a intervalos variables calculados en el Game Loop.
- El sistema debe generar orbes de manera aleatoria, ubicados cerca de los obstáculos para forzar una decisión de riesgo.
- El jugador debe poder invertir su posición Y al detectar el evento keydown (Barra espaciadora), mousedown o touchstart.
- El sistema debe calcular colisiones utilizando el método Axis-Aligned Bounding Box (AABB) a 60 FPS.
- La partida debe terminar en derrota si se detecta colisión con un obstáculo rojo sin protección.
- La partida debe terminar en victoria si score >= 5000.
- El puntaje debe actualizarse y renderizarse en el DOM o Canvas cada fotograma.
- El sistema debe activar "Bullet Time" (velocidad al 50%, puntos al 200%) al colisionar con un Orbe Azul.
- El sistema debe activar "Phase Smash" (ignorar la próxima colisión fatal y destruir el obstáculo) al colisionar con un Orbe Amarillo.

## 13. Controles
- *Teclado:* Barra espaciadora (Space).
- *Mouse:* Clic izquierdo en cualquier parte del documento (window).
- *Pantalla Táctil:* Toque (touchstart) en cualquier parte de la pantalla.
Ningún control debe tener retraso (debounce); la respuesta debe ser inmediata (milisegundos).

## 14. Interfaz de usuario
Los elementos visuales superpuestos al lienzo (HUD) deben ser:
- *Puntaje:* Texto centrado en la parte superior, tipografía monospace grande.
- *Multiplicador:* Texto al lado del puntaje (ej. "x2", "x4" con colores intensos).
- *Indicadores visuales (Poderes):* Una barra de progreso en la parte inferior que muestre el tiempo restante de un poder activo.
- *Mensajes de estado:* Textos modales para "Ganaste" o "Perdiste".
- *Botón de reinicio:* Visible solo en victoria/derrota.

## 15. Estilo visual
Minimalista retro-neón sobre fondo oscuro (#0F0F13).
- *Línea central:* Blanca, brillante (#FFFFFF).
- *Jugador:* Cuadrado cian (#00FFFF).
- *Obstáculos:* Rectángulos alargados rojos (#FF0055).
- *Orbes (Collectibles):* Círculos pequeños (Amarillos #FFDD00 y Azules #0088FF).
- *Animaciones:* Trazos de luz tras el personaje, temblor de pantalla en colisiones.

## 16. Sonido y feedback
Todo el feedback del MVP será visual:
- *Colisión no letal (destruir bloque):* Temblor rápido de pantalla (translateX/Y aleatorio) y destello blanco.
- *Recolectar Orbe:* Círculo expansivo rápido (efecto ripple) en la posición del orbe.
- *Bullet Time:* Desaturación parcial del fondo y oscurecimiento.

## 17. Requisitos técnicos
- Lenguajes: HTML5, CSS3, JavaScript (ES6+).
- Entorno de ejecución: Navegador web Google Chrome (última versión).
- Dependencias: Cero. Prohibido usar motores como Phaser, Unity o librerías pesadas. Todo debe ser código nativo (Vanilla JS) y Canvas API / DOM.
- Rendimiento: Uso estricto de requestAnimationFrame para mantener 60 FPS fluidos.

## 18. Arquitectura sugerida
La estructura de archivos debe ser plana y sencilla:
- index.html: Estructura del DOM, Canvas y pantallas de estado.
- style.css: Variables CSS, estilos del layout, efectos visuales globales y clases de estado (ej. .overdrive-active).
- script.js: Lógica del juego, Game Loop, clases o funciones para las entidades.

## 19. Modelo de datos
El estado global se manejará con el siguiente modelo base:
- score (Number): Puntaje actual, inicia en 0.
- gameState (String): 'START', 'PLAYING', 'GAME_OVER', 'VICTORY'.
- player (Object): { y: Number, isTop: Boolean, width: Number, height: Number, color: String }.
- enemies (Array de Objetos): Obstáculos en pantalla. Cada uno con { x, y, width, height, isDestroyed }.
- collectibles (Array de Objetos): Orbes en pantalla. { x, y, radius, type: 'SHIELD' | 'SLOW' }.
- timer (Object): Para manejar duración de poderes { slowMoDuration: Number, overdriveDuration: Number }.
- lives (Number): Inicia en 1. (El "Phase Smash" temporalmente la aumenta a 2).
- multiplier (Number): Inicia en 1. Tope máximo en 4.

## 20. Lógica del juego
1. *Inicialización:* Configurar dimensiones de Canvas igual a window.innerWidth/innerHeight. Añadir event listeners globales.
2. *Game Loop:* Función iterativa mediante requestAnimationFrame.
3. *Actualización (Update):* 
   - Mover coordenadas x de enemies y collectibles hacia la izquierda multiplicadas por la variable de velocidad global.
   - Eliminar entidades que salgan del borde izquierdo.
   - Generar nuevas entidades según probabilidades (ej. Math.random() < 0.02).
   - Evaluar temporizadores (timer) y restaurar velocidades si expiran.
   - Evaluar colisiones AABB entre player y todo objeto cercano.
4. *Renderizado (Draw):*
   - Limpiar el canvas (clearRect).
   - Dibujar la línea central.
   - Dibujar jugador, obstáculos, orbes.
   - Actualizar elementos del DOM (HUD).

## 21. Criterios de aceptación
- [ ] El juego se renderiza a pantalla completa sin barras de desplazamiento (scroll).
- [ ] Un solo clic/toque cambia al jugador de arriba abajo de la línea y viceversa instantáneamente.
- [ ] Tocar un obstáculo rojo sin escudo muestra la pantalla de "Game Over" y detiene el loop.
- [ ] Tocar un orbe amarillo otorga invulnerabilidad para el próximo choque.
- [ ] Tocar un orbe azul ralentiza el avance de los obstáculos visualmente.
- [ ] Alcanzar el multiplicador x4 gira el contenedor completo usando CSS.
- [ ] Llegar a 5,000 puntos muestra la pantalla de "Victoria".
- [ ] El botón de reiniciar limpia la partida completamente sin requerir recargar la página (F5).

## 22. Casos de prueba manuales
- *Inicio del juego:* Cargar el index.html. Debe mostrar el título. Hacer clic debe iniciar la cuenta de puntos y el movimiento de objetos.
- *Movimiento del personaje:* Presionar Espacio repetidamente. El jugador debe alternar su posición entre +Y y -Y de la línea central.
- *Incremento del puntaje:* Observar el contador. Debe subir lentamente de forma pasiva y saltar rápidamente al tocar orbes.
- *Condición de victoria:* Modificar manualmente el código (score = 4990), esquivar por un segundo y verificar que aparezca la pantalla de "Ganaste".
- *Condición de derrota:* Chocar intencionalmente con un rectángulo rojo. El juego debe detenerse de inmediato y mostrar "Game Over".
- *Reinicio del juego:* Tras perder, hacer clic en "Reiniciar". La pantalla debe quedar limpia, score en 0 y volver a empezar.
- *Funcionamiento en Google Chrome:* Abrir las DevTools (F12) en Chrome, jugar 1 minuto y verificar que no haya errores de consola ni caídas severas de cuadros.

## 23. Restricciones
- No utilizar la etiqueta <img src="..."> ni cargar texturas externas.
- No importar tipografías que requieran descargas (usar 'Courier New' o fuentes de sistema sans-serif).
- No intentar crear físicas realistas de salto o gravedad parabólica (el movimiento debe ser un teletransporte binario instantáneo arriba/abajo).
- No perder tiempo creando menús complejos; botones HTML estándar sobrepuestos con position: absolute son suficientes.

## 24. Plan de implementación en 90 minutos
- *0-15 min (Estructura base):* Setup de HTML, enlazado de JS/CSS. Creación del <canvas>, Game Loop básico estático.
- *15-35 min (Personaje y movimiento):* Dibujar línea, dibujar cubo, implementar evento de clic/espacio para invertir estado binario (isTop = !isTop).
- *35-55 min (Generación y colisiones):* Función para crear arrays de obstáculos, función para moverlos en X, lógica de colisión AABB, condición básica de Game Over.
- *55-75 min (Reglas y poderes):* Agregar recolección de orbes, actualizar UI de puntaje, lógicas específicas de "Phase Smash" y "Bullet Time".
- *75-90 min (Momento wow, pulido y pruebas):* Lógica del multiplicador x4, agregar la clase CSS .overdrive-active (que incluye el transform: rotate(360deg)), screen shake, probar condiciones de ganar/perder y resolver bugs visuales.

## 25. Entregables finales
1. Archivo index.html con la semántica básica y contenedores de UI.
2. Archivo style.css con estilos responsivos (100vh/100vw), clases de UI y clases de animación (Overdrive).
3. Archivo script.js con toda la lógica central orientada a eventos, lista para ejecutarse en el navegador de manera local sin necesidad de un servidor (file://).