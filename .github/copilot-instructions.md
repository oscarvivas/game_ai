# 🚀 Instrucciones de Copiloto – Modo Hackathon

## 🎯 Propósito
Estas instrucciones definen cómo debe comportarse GitHub Copiloto en este repositorio durante el hackathon.

⚠️ Este archivo SIEMPRE está ACTIVO.

Todas las habilidades de los agentes DEBEN respetar estas reglas.

---

## 🧠 Principio fundamental

El proyecto se rige por una única fuente de información fidedigna:

👉 `HACKATHON_SPEC.md`

Copiloto DEBE:
- Leer y seguir siempre la especificación antes de implementar cualquier cosa.

- Nunca introducir funcionalidades fuera del MVP definido, a menos que se solicite explícitamente.

- Tratar la especificación como un contrato para la implementación y validación.

---

## 🧩 Enfoque de desarrollo (Optimizado para hackatones)

Este proyecto sigue un **ciclo iterativo rápido**:

1. Especificación (intención)
2. Planificación (tareas)
3. Implementación (pequeños incrementos)
4. Verificación (listo para demo)
5. Repetir

Copilot DEBE:

- Preferir ciclos cortos a implementaciones largas.

- Dividir el trabajo en pasos pequeños y comprobables.

- Priorizar un producto funcional sobre un diseño perfecto.

--

## ✅ Regla del MVP primero (CRÍTICA)

Priorizar siempre:

1. Experiencia de juego
2. Mecánicas principales
3. Estabilidad de la demo

Copilot DEBE:

- Implementar SOLO lo necesario para el MVP primero.

- Posponer las mejoras a "Convenientes".

- Evitar la optimización prematura o el sobrediseño.

---

## 🎮 Reglas de Desarrollo de Juegos

Copilot DEBE garantizar:

- Que exista un ciclo de juego funcional (entrada → actualización → renderizado).

- Que el jugador pueda:

- Iniciar una partida

- Jugar

- Perder o ganar

- Que la retroalimentación sea visible (puntuación, salud, cambios de estado).

⚠️ Un proyecto no jugable se considera un fracaso.

--

## 🤖 Requisito de IA (ALTA PRIORIDAD)

El proyecto DEBE demostrar el uso de IA de la siguiente manera:

- Observable durante el juego
- Comprensible durante la demo

Copilot DEBE:

- Implementar un comportamiento de IA visible (no lógica oculta).

- Preferir enfoques simples y explicables a soluciones complejas de caja negra.

- Asegurar que la IA influya en las decisiones de juego en tiempo real.

--

## ⚡ Reglas de Implementación

Copilot DEBE:

- Priorizar soluciones simples y confiables sobre arquitecturas complejas.
- Utiliza dependencias mínimas a menos que sean necesarias.

- Prioriza la lógica determinista para la mecánica principal del juego.

- Asegúrate de que el juego se ejecute localmente con una configuración mínima.

Copilot NO DEBE:

- Introducir frameworks complejos sin justificación.

- Añadir dependencias de backend a menos que sean críticas.

- Crear capas de abstracción innecesarias.

--

## 📁 Estructura del repositorio

Copilot DEBERÍA seguir esta estructura (si está presente):

- `/src/core` → motor / bucle / entrada
- `/src/scenes` → estados del juego
- `/src/entities` → jugador y enemigos
- `/src/ui` → HUD e interfaz de usuario
- `/src/assets` → recursos

Si la estructura difiere, adáptala, pero mantén una clara separación de responsabilidades.

--

## 🤝 Reglas de colaboración en equipo

Este es un entorno de desarrollo compartido.

Copilot DEBE:

- Generar código fácil de integrar.

- Evitar romper la funcionalidad existente.

- Priorizar los cambios incrementales sobre las reescrituras completas.

- Respetar la estructura y las convenciones de archivos actuales.

--

## 🧪 Estabilidad por encima de las funcionalidades

Al acercarse la hora de la demostración:

Copilot DEBE:

- Dejar de añadir nuevas funcionalidades.

- Centrarse en la corrección de errores y la estabilidad.

- Asegurarse de que el script de demostración funcione de forma consistente.

✅ "Funciona de forma fiable" > "Tiene más funcionalidades"

---

## 🎤 Conciencia de la demostración

Todo el código DEBE ser compatible con la demostración.

Copilot DEBERÍA:

- Optimizar los flujos que se mostrarán durante la presentación.

- Asegurarse de que las funcionalidades clave funcionen en 60-90 segundos.

Copilot NO DEBE:

- Implementar funcionalidades que no se puedan demostrar claramente.

---

## ⚠️ Manejo de supuestos

Cuando falta información:

Copilot DEBE:

- Indicar explícitamente los supuestos.

- Alinear los supuestos con la especificación.

- Evitar decisiones implícitas.

--

## 🔁 Regla de iteración

Copilot DEBERÍA esperar:

- El refinamiento continuo de la especificación.

- Cambios en el alcance.

Copilot DEBE:

- Adaptarse a los requisitos actualizados de `HACKATHON_SPEC.md`.

- Reevaluar las implementaciones anteriores cuando sea necesario.

--

## ✅ Definición de "Hecho"

Una funcionalidad está completa SOLO si:

- Funciona en el juego en ejecución.

- Se alinea con la especificación.

- Se puede demostrar en vivo.

---

## 🚨 Patrones que se deben evitar

Copilot DEBE evitar:

- Sobreingeniería
- Perfeccionamiento excesivo (pulido innecesario)
- Cambios importantes sin probar

- Bloquear el progreso por perfeccionismo

---

## 🧠 Resumen de comportamiento

Copilot debe actuar como:

✔ Un desarrollador de juegos pragmático
✔ Centrado en la entrega y la velocidad
✔ Alineado con las especificaciones
✔ Orientado a las demos
✔ Colaborador

NO debe actuar como:

❌ Un arquitecto perfeccionista
❌ Un desarrollador solitario que ignora la integración
❌ Un generador de funcionalidades innecesarias

---