# AGENTS.md — TITAN CROAR

## 1. Alcance y contexto

- Aplicar estas instrucciones al inicio de cada consulta y antes de modificar el proyecto.
- Responder en español. Adaptar la profundidad al pedido: breve en consultas simples, completa en cambios de comportamiento.
- Rutas vigentes (verificarlas en cada tarea; no asumir que siguen iguales):
  - Documento principal de requisitos: `Docs/GDD_DT2.docx` (único documento; `Docs/` para documentación adicional). Actualizado por el usuario el 18/10/2026 y modificado sin commitear: preservarlo, no descartarlo ni sobrescribirlo.
  - Código: `src/main.js`, `src/scenes/` (`Boot.js`, `Preloader.js`, `Game.js`), `src/entities/`, `src/domain/`, `src/levels/level1.js`, `src/ui/HUD.js`.
  - Legacy, no usar sin decisión explícita: `src/config/LevelConfig.js`, `src/entities/Health.js`, `src/entities/EnemyFactory.js`.
  - Recursos gráficos: `assets/` con 4 PNG sin trackear (`RANA TITAN CROAR1.png`, `PUERCO ESPÍN.png`, `Pantano Titan Croar.png`, `Cangrejo acorazado.png`) y mockups generados en `src/scenes/Preloader.js`.
  - Configuración: `package.json` (scripts `dev`, `build`, `preview`; sin tests ni lint), `vite.config.js`, `index.html`.
- Si las rutas reales difieren de las anteriores, usar las reales y señalar la diferencia.
- Revisar la información vigente en cada consulta; no depender solo de resúmenes de conversaciones anteriores.
- Preservar el trabajo existente del usuario. Estado conocido: rama `feature/prototipo-nivel1-gdd-nuevo` al día con `origin`; cambios de usuario sin commitear: `M Docs/GDD_DT2.docx` y `?? assets/` (no descartar ni commitear sin consultar).

## 2. Revisar la documentación y el requisito

Antes de proponer o implementar:

1. Identificar el requisito y su comportamiento esperado.
2. Revisar `Docs/`, como mínimo `Docs/GDD_DT2.docx`.
3. Consultar las secciones pertinentes del GDD: Descripción General, Historia, Mecánica principal (movimiento, salto, lengua-cuerda, captura con lengua, puntos/vida extra con puntaje que vuelve a 0, mariposas/moscas), Enemigos (erizo inmune, cangrejo x2, avispa, águila jefe), Obstáculos (espinas, cactus, pozos, barro o arena movediza, tronco), Condición de Derrota, Condición de Victoria, y el listado final de niveles.
4. Clasificar el requisito como:
   - **Definido:** el GDD describe suficientemente el comportamiento.
   - **Parcialmente definido:** contemplado pero faltan detalles necesarios.
   - **No definido:** no aparece en la documentación revisada.
   - **En contradicción:** difiere de una regla documentada.
   - **No aplica:** consulta técnica o documental sin regla funcional asociada.
5. Citar la fuente:
   - `.docx`: `Docs/GDD_DT2.docx, sección "<Título>"` — sin citar por página (la numeración depende del visor).
   - Listado final de niveles (párrafos sin encabezado general): citar `Docs/GDD_DT2.docx, sección "NIVEL 1: PANTANO"`, `Docs/GDD_DT2.docx, sección "NIVEL 2: DESIERTO"` o `Docs/GDD_DT2.docx, sección "NIVEL 3: BOSQUE"`.
   - PDF: página del archivo, distinguiéndola de la numeración impresa si difieren.
   - Markdown: título o número del apartado.
6. Diferenciar reglas documentadas de propuestas y supuestos.

Si la documentación no existe o no puede leerse, indicarlo y no afirmar que el requisito está definido o ausente.

Un requisito no documentado puede ser ampliación válida: identificarlo como tal y consultar las decisiones necesarias.

No modificar la documentación de requisitos para justificar una implementación sin solicitud explícita del usuario.

## 3. Analizar conflictos e impacto

Antes de modificar una funcionalidad:

- Revisar reglas del GDD y la implementación existente en `src/entities/`, `src/domain/`, `src/scenes/`, `src/levels/`, `src/ui/`.
- Identificar dependencias, restricciones compartidas, excepciones, prioridades y posibles regresiones.
- Comparar comportamiento actual vs. documentación; no asumir que el código existente es correcto.
- Detectar contradicciones internas del GDD, incluso entre texto e imágenes.
- Comunicar los conflictos relevantes antes de modificar la parte afectada.

Interacciones propias de este plataformas, verificar cuando apliquen:

- Movimiento lateral, salto, gravedad, colisiones con plataformas/piso y límites del mundo (`physics.world.setBounds`, sin colisión inferior para que el pozo deje caer al jugador).
- Pisotón vs. contacto lateral: erizo inmune (el pisotón daña al jugador), cangrejo que aguanta 2 pisotones y no cae a pozos, avispa por pisotón o lengua, águila jefe futura "varias veces".
- Enemigos aéreos y su temporización (avispa que sigue al jugador hasta matarla o salir de rango).
- Lengua: captura actual (X/clic) y lengua-cuerda de desplazamiento **no implementada**.
- Puntos y vida extra (100 puntos = 1 hoja), mariposas/moscas, HUD de hojas.
- Obstáculos: espinas, cactus-pared, pozo con respawn, barro/arena movediza que ralentiza temporalmente, tronco que se interpone.
- Escenas y transiciones, spawn/checkpoints, condición de victoria por punto final de cada nivel y derrota con reinicio desde 0.
- Estructura de 3 niveles con tema y composición propios (ver brechas abiertas más abajo).
- Input de teclado (cursor, WASD, X, R) y táctil (pointer) si se extiende.

Brechas abiertas GDD (revisado 18/10/2026) vs. código, contrastar antes de cada tarea:

- Puntaje: el GDD exige que al llegar a 100 se gane 1 hoja **y el puntaje vuelva a 0**; `src/domain/Score.js` hoy acumula y sube umbrales (100, 200…) sin reiniciar.
- Obstáculos nuevos sin implementar ni textura en `Preloader.js`: **tronco** (listado en los 3 niveles) y **arena movediza** (variante del barro en Desierto/Bosque).
- Niveles: solo existe `src/levels/level1.js`; no hay nivel 2 (Desierto) ni 3 (Bosque), ni transiciones entre niveles ni composición por tema.
- Nivel 1 vs. GDD: `LEVEL1` no incluye el **tronco** (obstáculo listado para Pantano).
- Ambigüedad: "Condición de Victoria" da jefe (águila) en el último nivel, pero `sección "NIVEL 3: BOSQUE"` no lista al águila entre sus enemigos → preguntar antes de decidir.

Estas brechas son notas de revisión y pueden quedar desactualizadas: contrastar siempre contra el GDD vigente y el código real.

Lo que no aplica a este proyecto (no introducirlo): lógica de turnos, tablero, casillas, inventario, dinero ni compras; el GDD vigente no los define.

## 4. Preguntar antes de avanzar ante dudas

Cuando una duda afecte alcance, reglas, comportamiento, compatibilidad o implementación:

- Usar la herramienta de preguntas disponible (`question`).
- Formular preguntas concretas, explicar qué falta decidir y por qué importa.
- Ofrecer opciones y una recomendación fundamentada cuando ayude.
- Esperar la respuesta antes de decidir un cambio de comportamiento.
- No inventar reglas para tapar omisiones o contradicciones.
- Continuar solo con tareas independientes de alcance claro.

Si la herramienta no está disponible, preguntar en la conversación y esperar.

## 5. Utilizar POO y patrones de diseño

- Stack: JavaScript ESM, Phaser 4 + Vite 6. Respetar la arquitectura Phaser (Scene, preload/create/update, física arcade, GameObjects) y las convenciones del proyecto.
- Modelar el dominio con POO: `Player`, `Enemy` y variantes (`Crab`, `Hedgehog`, `Wasp`, `Fly`), `Tongue`, `Health`, `Score`, `HUD`, `EntityFactory`. Entidades GDD aún no implementadas: águila jefe, lengua-cuerda de desplazamiento, tronco, progresión multinivel — no inventar su API sin consultar.
- Encapsular estado y reglas; alta cohesión, bajo acoplamiento; preferir composición sobre herencia profunda.
- Separar lógica de dominio de `Scene`, render e input: la Scene orquesta; las reglas viven en clases de `src/domain/` y `src/entities/`.
- Usar patrones solo con necesidad concreta y explicar brevemente la elección:
  - **State** para estados del jugador y fases del jefe.
  - **Strategy** para comportamientos de enemigos y efectos (patrulla, abalanzarse, carga, plumas; barro/arena que ralentiza).
  - **Factory** para creación de entidades y obstáculos (`src/domain/EntityFactory.js`, ya existente).
  - **Observer** vía `EventEmitter` para HUD/vida/puntos (`src/domain/Health.js`, `src/domain/Score.js`, ya existentes).
- Evitar abstracciones y refactorizaciones fuera del alcance.

## 6. Reutilizar código existente

En cada tarea, antes de crear clases, componentes o utilidades:

1. Buscar en `src/entities/`, `src/domain/`, `src/scenes/`, `src/levels/` y `src/ui/` implementaciones relacionadas.
2. Revisar contratos, comportamiento y consumidores.
3. Priorizar reutilizar o extender lo compatible; no duplicar lógica de negocio.
4. Extraer lógica común solo ante necesidad real, preservando el comportamiento de sus consumidores.
5. Respetar estructura, nombres y estilo del proyecto.

Códigos canónicos frente a legacy:

- Usar `src/domain/Health.js` (EventEmitter) — `src/entities/Health.js` está en desuso.
- Usar `src/domain/EntityFactory.js` — `src/entities/EnemyFactory.js` no se importa en ningún lado.
- Usar `src/levels/level1.js` (`LEVEL1`) — `src/config/LevelConfig.js` es legacy no usado.
- No crear un segundo `Health`, factory ni config de nivel.

Si no existe código reutilizable (tronco, arena movediza, lengua-cuerda, transición de nivel, pickups), indicarlo y diseñar una solución coherente con el proyecto.

## 7. Consultar sobre sprites y recursos gráficos

Cuando se necesiten sprites u otros recursos:

1. Revisar los recursos disponibles:
   - `assets/`: 4 PNG sin trackear (`RANA TITAN CROAR1.png`, `PUERCO ESPÍN.png`, `Pantano Titan Croar.png`, `Cangrejo acorazado.png`); **hoy no se cargan en el juego**. `Pantano Titan Croar.png` coincide con el tema del Nivel 1: si la tarea lo toca, considerarlo candidato dentro de la consulta.
   - `src/scenes/Preloader.js`: mockups por `generateTexture` (`player`, `crab`, `hedgehog`, `wasp`, `fly`, `butterfly`, `tile`, `spike`, `mud`, `cactus`, `goal`).
2. Antes de implementar lo visual, usar la herramienta de preguntas para confirmar:
   - **Generar un mockup:** representación provisional para validar la funcionalidad.
   - **Utilizar un recurso existente:** pedir el nombre exacto (por ejemplo uno de los PNG de `assets/`).
3. Si el recurso indicado no se localiza, pedir su ruta o el archivo.

Además:

- No asumir sprite ni inventar nombres o rutas.
- Si se elige un mockup, aclarar que es provisional y confirmar el alcance visual mínimo.
- Si se elige un recurso existente, comprobar disponibilidad y compatibilidad (tamaño, fotogramas, animación, formato Phaser) antes de depender de él.
- Consultar spritesheet, frames o animaciones cuando falten y sean necesarios.
- Si falta el archivo, pedirlo antes de avanzar en la parte que depende de él; mientras tanto, avanzar con la lógica independiente de gráficos.
- Lengua, tronco, arena movediza, águila jefe y elementos multinivel no tienen ni textura ni mockup: consulta de recurso pendiente.

## 8. Definir y preparar el flujo Git

Estado conocido: repositorio con remoto `origin` (GitHub `marcosarecobravo-star/TITAN_CROAR`); convención de commits usada: Conventional Commits en español (`feat(alcance):`, `fix(...)`, `docs:`, `refactor(...)`). Verificar el estado real en cada tarea (`git status`, `git branch -vv`, `git remote -v`).

- No imponer GitFlow: flujo simple salvo acuerdo contrario.
  - `feature/<descripcion>`, `fix/<descripcion>`, `docs/<descripcion>`, `refactor/<descripcion>`
  - No trabajar directamente sobre `main`, `master` o `develop`.
- Si ya existe una rama apropiada, verificar si corresponde continuar en ella.
- Si no hay estrategia definida para la tarea, consultar rama base, convención de nombres y remoto.
- Preservar cambios previos del usuario (hoy: `M Docs/GDD_DT2.docx` y `?? assets/`); si interfieren, consultar antes de moverlos, descartarlos o mezclarlos.
- Si no hubiera repositorio o remoto, informarlo y consultar antes de inicializarlo o configurarlo.

## 9. Implementar y verificar

- Definir criterios de aceptación desde el requisito, el GDD y las aclaraciones del usuario.
- Cambios enfocados al alcance acordado.
- Comprobaciones disponibles: `npm run build` (compila con Vite), `npm run dev` + prueba manual en navegador (no hay tests ni lint).
- Verificar las interacciones del análisis de impacto jugando o revisando el flujo afectado (movimiento/salto, pisotón, daño/invencibilidad, barro, pozo, lengua, puntos/HUD, victoria/derrota, reinicio con R).
- Agregar pruebas solo si aportan valor contra regresiones; no existen hoy, consultar antes de incorporar un framework de tests.
- Informar qué se verificó y qué quedó pendiente; no afirmar resultados no comprobados.

## 10. Solicitar confirmación y realizar commit y push

Al terminar la implementación:

1. Presentar: resumen del comportamiento implementado, archivos afectados, verificaciones y resultados, pendientes o limitaciones reales, rama de trabajo utilizada.
2. Usar la herramienta de preguntas para solicitar la confirmación de aceptación y la autorización explícita de commit y push.
3. Esperar la respuesta. Si hay ajustes, realizarlos, re-verificar las comprobaciones afectadas y volver a solicitar confirmación.

Tras recibir autorización:

1. Revisar `git status`, `git diff` y `git log --oneline -10`.
2. Revisar los archivos nuevos que se incluirán.
3. Preparar únicamente los cambios de la tarea, sin cambios ajenos ni secretos.
4. Crear un commit descriptivo según las convenciones del repositorio (Conventional Commits en español).
5. Hacer push de la rama al remoto acordado, configurando su seguimiento cuando corresponda.
6. Informar rama, identificador y mensaje del commit, y resultado del push.

No hacer commit ni push sin autorización explícita.

No hacer force push, omitir hooks, modificar la configuración de Git ni fusionar ramas sin solicitud expresa. Si un hook o comprobación falla, resolverlo antes de continuar; si commit o push falla, informarlo sin afirmar que se completó. La creación de un pull request y la integración en la rama base requieren autorización adicional.

## 11. Comunicar el análisis y los resultados

Antes de implementar, análisis breve con los puntos pertinentes:

- **Requisito:** comportamiento solicitado.
- **Documentación:** estado y referencia `Docs/GDD_DT2.docx, sección "..."`, con clasificación Definido/Parcialmente definido/No definido/En contradicción/No aplica.
- **Conflictos e impacto:** reglas y funcionalidades afectadas.
- **Reutilización:** código aprovechable o constancia de que no existe.
- **Diseño:** enfoque POO y patrones pertinentes en Phaser + Vite.
- **Recursos gráficos:** recursos confirmados o consulta pendiente.
- **Git:** rama base y rama de trabajo, y cambios ajenos pendientes.
- **Dudas:** decisiones que requieren respuesta del usuario.

En consultas simples, reducir el formato a los puntos aplicables.

Al finalizar, resumir: cambios y archivos afectados, decisiones relevantes, verificaciones ejecutadas, pendientes reales, confirmación solicitada y —solo si se autorizó y ejecutó— resultado de commit y push. No presentar propuestas como funcionalidades implementadas.
