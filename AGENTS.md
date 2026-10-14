# AGENTS.md — TITAN CROAR

## 1. Alcance y contexto

- Aplicar estas instrucciones al inicio de cada consulta y antes de modificar el proyecto.
- Responder en español. Adaptar la profundidad al pedido: breve en consultas simples, completa en cambios de comportamiento.
- Rutas vigentes:
  - Documento principal de requisitos: `Docs/GDD_DT2.docx`
  - Documentación adicional: `Docs/`
  - Código: `src/config/`, `src/domain/`, `src/entities/`, `src/levels/`, `src/scenes/`, `src/ui/`, `src/main.js`
  - Escenas: `src/scenes/` (`Boot.js`, `Preloader.js`, `Game.js`) — verificar en cada tarea, no asumir.
  - Nivel canónico: `src/levels/level1.js` (`LEVEL1`, usado por `Game.js`); `src/config/LevelConfig.js` es legacy no usado.
  - Salud canónica: `src/domain/Health.js` (EventEmitter, usada por `Game.js`/`HUD.js`); `src/entities/Health.js` es legacy (usada solo por `Player.js` a migrar).
  - Recursos gráficos: no hay `assets/`; mockups provisionales generados en `src/scenes/Preloader.js`
- Si las rutas reales difieren de lo anterior, usar las reales y señalar la diferencia.
- Revisar la información vigente en cada consulta; no depender solo de resúmenes anteriores.
- Preservar el trabajo existente del usuario. Estado actual: prototipo Phaser + Vite con GDD actualizado en `Docs/GDD_DT2.docx` (modificado sin commitear).

## 2. Revisar la documentación y el requisito

Antes de proponer o implementar:

1. Identificar el requisito y su comportamiento esperado.
2. Revisar `Docs/`, como mínimo `Docs/GDD_DT2.docx`.
3. Consultar las secciones pertinentes del GDD: Descripción General, Historia, Mecánica principal (incluye lengua-cuerda, captura con lengua, puntos/vida extra, mariposas/moscas), Enemigos, Obstáculos, Condición de Derrota, Condición de Victoria (punto final por nivel + jefe final).
4. Clasificar el requisito como:
   - **Definido:** el GDD describe suficientemente el comportamiento.
   - **Parcialmente definido:** contemplado pero faltan detalles necesarios.
   - **No definido:** no aparece en la documentación revisada.
   - **En contradicción:** difiere de una regla documentada.
   - **No aplica:** consulta técnica o documental sin regla funcional asociada.
5. Citar la fuente como `Docs/GDD_DT2.docx, sección "<Título>"`. Al ser `.docx`, la paginación depende del visor: no citar por página; citar por título de sección.
6. Diferenciar reglas documentadas de propuestas y supuestos.

Si la documentación no existe o no puede leerse, indicarlo y no afirmar que el requisito está definido o ausente.

Un requisito no documentado puede ser ampliación válida: identificarlo como tal y consultar las decisiones necesarias.

No modificar el GDD para justificar una implementación sin solicitud explícita.

## 3. Analizar conflictos e impacto

Antes de modificar una funcionalidad:

- Revisar reglas del GDD y la implementación existente en `src/entities/`, `src/domain/`, `src/scenes/`, `src/levels/`.
- Identificar dependencias, restricciones compartidas, excepciones, prioridades y posibles regresiones.
- Comparar comportamiento actual vs. documentación; no asumir que el código existente es correcto.
- Detectar contradicciones internas del GDD, incluso entre texto y diagramas/imágenes si se agregan.
- Comunicar conflictos relevantes antes de modificar la parte afectada.

Adaptado a este plataformas Phaser:

- Movimiento lateral izquierda-derecha, salto, gravedad y colisiones con plataformas/piso.
- Salto como ataque vs. evasión vs. ascenso; enemigos con inmunidad (erizo gigante en patrulla con límite) o golpes múltiples (cangrejo x2 que patrulla sin caer a pozos, águila jefe "varias veces").
- Enemigos aéreos (avispa que sigue al jugador hasta matarla o salir de rango, derrotable por pisotón o lengua según GDD; águila con carga/plumas/ataques aéreos) y su temporización.
- Lengua-cuerda (desplazamiento) y lengua como captura de avispas/moscas: regla Parcialmente definida — no inventar alcance, input ni valores; preguntar en cada tarea que la toque. Implementación actual: no existe.
- Puntos y vida extra (100 puntos = 1 hoja; mariposas/moscas suman): regla Parcialmente definida con el mismo tratamiento. Implementación actual: no existe.
- Obstáculos: espinas en piso/plataformas, cactus como pared, pozos por nivel, barro que reduce velocidad temporalmente.
- Vidas-hojas, derrota con reinicio desde 0, victoria por punto final de cada nivel; el último nivel con jefe completa el juego. Implementación actual (`Game.js`): solo slice con meta única, sin progresión multinivel ni jefe.
- Escenas Phaser, transiciones de nivel, spawn/checkpoints, HUD de hojas, input teclado y táctil si aplica.
- No aplicar lógica de turnos, tablero, inventario/dinero: no existen en el GDD vigente.

## 4. Preguntar antes de avanzar ante dudas

Cuando una duda afecte alcance, reglas, comportamiento, compatibilidad o implementación:

- Usar la herramienta de preguntas disponible (por ejemplo `question`).
- Formular preguntas concretas, explicar qué falta decidir y por qué importa.
- Ofrecer opciones y una recomendación fundamentada cuando ayude.
- Esperar la respuesta antes de decidir un cambio de comportamiento.
- No inventar reglas para tapar omisiones o contradicciones.
- Continuar solo con tareas independientes de alcance claro.

Si la herramienta no está disponible, preguntar en la conversación y esperar.

## 5. Utilizar POO y patrones de diseño

- Stack: Phaser + Vite. Respetar el lenguaje configurado en Vite (JavaScript/TypeScript) y la arquitectura Phaser (Game, Scene, GameObjects, física, preload/create/update).
- Modelar entidades del dominio con POO: `Player`, `Enemy`, variantes (`Hedgehog`, `Crab`, `Wasp`, futuro `EagleBoss`), `src/domain/Health.js` canónica (Observer con `changed`), `HUD`, `EntityFactory`, `src/levels/level1.js` canónico. Futuras entidades GDD no implementadas: `Tongue`, `Score`, `Pickup` (mosca/mariposa) — no inventar su API, preguntar antes.
- No duplicar `Health` ni configs de nivel: migrar `Player.js` desde `src/entities/Health.js` (legacy) hacia `src/domain/Health.js`, y no revivir `src/config/LevelConfig.js` salvo decisión explícita.
- Encapsular estado y reglas; alta cohesión, bajo acoplamiento; preferir composición sobre herencia profunda.
- Separar lógica de dominio de `Scene`, render e input. La Scene orquesta; las reglas viven en clases testeables.
- Usar patrones solo con necesidad concreta y explicar brevemente la elección:
  - State para estados del jugador (idle/run/jump/hurt) y fases del jefe.
  - Strategy para comportamientos de enemigos y efectos (patrulla, abalanzarse, carga, disparo de plumas; barro que ralentiza).
  - Factory para creación/spawn de enemigos y obstáculos por nivel.
  - Observer vía `EventEmitter`/eventos de Scene para HUD ante daño, pérdida de hoja, derrota/victoria.
- Evitar abstracciones y refactors fuera del alcance.

## 6. Reutilizar código existente

Estado actual: sí hay código reutilizable (prototipo en `src/`). Por eso:

1. En cada tarea, buscar en `src/entities/`, `src/domain/`, `src/scenes/`, `src/levels/` y `src/ui/` implementaciones relacionadas (`Player`, `Enemy`/`Crab`/`Hedgehog`/`Wasp`, `EntityFactory`, `domain/Health`, `HUD`, `Game`).
2. Revisar contratos, comportamiento y consumidores antes de crear algo nuevo.
3. Priorizar reutilizar o extender lo compatible; no duplicar lógica de negocio.
4. Extraer lógica común solo ante necesidad real, sin romper consumidores.
5. Respetar estructura, nombres y estilo del proyecto y la config Vite/Phaser.
6. No crear un segundo `Health`, `EnemyFactory` ni config de nivel: reutilizar los canónicos; si no hay código reutilizable para lengua/puntos/pickups, indicarlo y diseñar coherente con el proyecto.

Repetir esta revisión en cada consulta; no asumir que la estructura sigue igual.

## 7. Consultar sobre sprites y recursos gráficos

Cuando se necesiten sprites u otros recursos:

1. Revisar `src/scenes/Preloader.js` y sus convenciones (mockups por `generateTexture`: `player`, `crab`, `hedgehog`, `wasp`, `tile`, `spike`, `mud`, `cactus`, `goal`). No hay `assets/` ni sprites externos.
2. Antes de implementar lo visual, usar la herramienta de preguntas para confirmar:
   - **Generar un mockup:** provisional para validar funcionalidad.
   - **Utilizar un recurso existente:** pedir el nombre exacto del recurso.
3. Si el recurso no se localiza, pedir ruta o archivo.

Además:

- No asumir sprite ni inventar nombres/rutas.
- Si es mockup, aclarar que es provisional y confirmar alcance visual mínimo.
- Si es existente, comprobar disponibilidad y compatibilidad (tamaño, fotogramas, animación, formato Phaser).
- Consultar spritesheet, frames o animaciones si faltan y son necesarios.
- Si falta el archivo, pedirlo antes de avanzar en lo dependiente. Lengua, mariposas y moscas no tienen sprite: consulta pendiente.
- Continuar con la lógica independiente de gráficos mientras se resuelve.

## 8. Definir y preparar el flujo Git

Estado actual: repo Git en `main` con remoto `origin` (`TITAN_CROAR`). Hay un cambio del usuario sin commitear (`M Docs/GDD_DT2.docx`). Reglas:

- Antes de implementar, comprobar `git status`, rama actual y remotos.
- No imponer GitFlow sin acordarlo; usar flujo simple salvo acuerdo contrario:
  - `feature/<descripcion>`, `fix/<descripcion>`, `docs/<descripcion>`, `refactor/<descripcion>`
  - No trabajar directo sobre `main`/`master`/`develop`.
- Si ya existe una rama apropiada, verificar si corresponde continuar en ella.
- Preservar cambios previos del usuario; si interfieren, consultar antes de moverlos, descartarlos o mezclarlos.

## 9. Implementar y verificar

- Definir criterios de aceptación desde el requisito, el GDD y las aclaraciones.
- Cambios enfocados al alcance acordado.
- Ejecutar comprobaciones disponibles y pertinentes: scripts Vite/npm del proyecto (`dev`, `build`, `preview`, tests/lint si existen) y prueba jugable del nivel afectado.
- Verificar interacciones del análisis de impacto (salto/daño, inmunidades, barro, pozos, HUD de hojas, derrota/victoria por nivel, avispa por pisotón; lengua/puntos/pickups solo si la tarea los implementa).
- Agregar pruebas solo si aportan valor contra regresiones; evitar tests que solo repliquen la implementación.
- Informar qué se verificó y qué quedó pendiente. No afirmar resultados no comprobados.

## 10. Solicitar confirmación y realizar commit y push

Repo existente en `main` + `origin`. Solo tras autorización explícita vía preguntas:

1. Al terminar, presentar: resumen del comportamiento, archivos afectados, verificaciones y resultados, pendientes reales, rama usada.
2. Pedir por herramienta de preguntas: confirmación de aceptación y autorización explícita para commit y push. Esperar respuesta. Si hay ajustes, hacerlos, re-verificar y volver a pedir confirmación.
3. Solo tras autorización: revisar `git status`, `git diff`, `git log --oneline -10`; preparar solo cambios de la tarea, sin ajenos ni secretos; commit descriptivo según convenciones; push al remoto acordado con seguimiento si corresponde; informar rama, commit y resultado del push.
4. No hacer commit/push sin autorización; no hacer force push, omitir hooks, cambiar config de Git ni fusionar ramas sin pedido expreso. Si falla un hook, commit o push, informar sin afirmar éxito. PR e integración requieren autorización adicional.

## 11. Comunicar el análisis y los resultados

Antes de implementar, análisis breve con lo pertinente:

- **Requisito:** comportamiento solicitado.
- **Documentación:** estado y referencia `Docs/GDD_DT2.docx, sección "..."`, con clasificación Definido/Parcial/No definido/En contradicción/No aplica.
- **Conflictos e impacto:** reglas y funcionalidades afectadas.
- **Reutilización:** código aprovechable o constancia de que no existe.
- **Diseño:** enfoque POO y patrones pertinentes en Phaser + Vite.
- **Recursos gráficos:** confirmados o consulta pendiente.
- **Git:** estado actual (rama base `main`, rama de trabajo) y si hay cambios ajenos pendientes (ej. `M Docs/GDD_DT2.docx`).
- **Dudas:** decisiones pendientes del usuario.

En consultas simples, reducir a los puntos aplicables.

Al finalizar, resumir: cambios y archivos, decisiones, verificaciones, pendientes reales, confirmación solicitada y —solo si se autorizó y ejecutó— resultado de commit/push. No presentar propuestas como implementadas.
