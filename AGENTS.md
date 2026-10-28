# AGENTS.md — TITAN CROAR

## 1. Alcance y contexto

- Aplicar estas instrucciones al inicio de cada consulta y antes de modificar el proyecto.
- Responder en español. Adaptar la profundidad al pedido: breve en consultas simples, completa en cambios de comportamiento.
- Rutas vigentes (verificarlas en cada tarea; no asumir que siguen iguales):
  - Documento principal de requisitos: `Docs/GDD_TC.docx` (único documento; `Docs/` para documentación adicional). Renombrado desde `Docs/GDD_DT2.docx`; última edición **sin commitear** (28/10/2026: *Mecánica principal* pasa a viñetas rotuladas Movilidad/Lengua/Insecto Moneda y la avispa gana "arcos en forma de U"): preservarla, no descartarla ni sobrescribirla.
  - Código: `src/main.js`, `src/scenes/` (`Boot.js`, `Preloader.js`, `MainMenu.js`, `Game.js`), `src/entities/`, `src/domain/`, `src/levels/` (`index.js`, `level1.js`, `level2.js`, `level3.js`), `src/ui/HUD.js`.
  - Niveles registrados: `src/levels/index.js` exporta **`LEVELS = [LEVEL1, LEVEL2]`** — Pantano y Desierto (multinivel reactivo en `f73ef8a`/`0d8615b`). `level3.js` (Bosque) y `src/entities/Eagle.js` existen pero **no están registrados/uso**: no asumir jefe activo.
  - Escenas: `Preloader` → `MainMenu` (título y botón Jugar, resetea la progresión) → `Game`; la victoria de nivel avanza sola al siguiente.
  - Estado de progresión: `src/domain/Progression.js` (singleton por módulo, exporta `progression`); derrota = `resetLevel()` (hojas 3 y puntaje 0).
  - Legacy, no usar sin decisión explícita: `src/config/LevelConfig.js`, `src/entities/Health.js`, `src/entities/EnemyFactory.js`.
  - Recursos gráficos: los **4 PNG de `public/` están trackeados** (fondo `Pantano Titan Croar.png` + sprites reales `rana.png`, `cangrejo.png`, `erizo.png`, con mockup de respaldo en `Preloader.make`); `assets/` conserva los 4 PNG originales; mockups generados en `src/scenes/Preloader.js` y `src/scenes/Boot.js`.
  - Configuración: `package.json` (scripts `dev`, `build`, `preview`; sin tests ni lint), `vite.config.js`, `index.html`.
- Si las rutas reales difieren de las anteriores, usar las reales y señalar la diferencia.
- Revisar la información vigente en cada consulta; no depender solo de resúmenes de conversaciones anteriores.
- Preservar el trabajo existente del usuario. Estado conocido (28/10/2026, rama `feature/prototipo-nivel1-gdd-nuevo` con upstream): **working tree limpio salvo `M Docs/GDD_TC.docx`** (la edición sin commitear descrita arriba). La lista exacta cambia con cada tarea: verificar con `git status`. No descartar ni commitear sin consultar.

## 2. Revisar la documentación y el requisito

Antes de proponer o implementar:

1. Identificar el requisito y su comportamiento esperado.
2. Revisar `Docs/`, como mínimo `Docs/GDD_TC.docx`.
3. Consultar las secciones pertinentes del GDD: Descripción General, Historia, Mecánica principal — hoy en **viñetas rotuladas**: **Movilidad** (moverse, saltar, pisotón), **Lengua** (cuerda para balancearse y "subir de arriba a abajo", con **exclusión mutua**: mientras se balancea o sube no puede atacar a los insectos; captura avispas y moscas inofensivas) e **Insecto Moneda** (100 puntos = vida extra y el puntaje vuelve a 0; los puntos salen de atrapar moscas/avispas con la lengua o **pasar sobre mariposas**) —, Enemigos (erizo inmune, cangrejo x2 pisotones, avispa que se abalanza **haciendo arcos en forma de U**, águila jefe), Obstáculos (espinas, cactus-pared, pozos, barro o arena movediza, tronco), Condición de Derrota, Condición de Victoria, y el listado final de niveles.
4. Clasificar el requisito como:
   - **Definido:** el GDD describe suficientemente el comportamiento.
   - **Parcialmente definido:** contemplado pero faltan detalles necesarios.
   - **No definido:** no aparece en la documentación revisada.
   - **En contradicción:** difiere de una regla documentada.
   - **No aplica:** consulta técnica o documental sin regla funcional asociada.
5. Citar la fuente:
   - `.docx`: `Docs/GDD_TC.docx, sección "<Título>"` — sin citar por página (la numeración depende del visor).
   - Listado final de niveles (párrafos sin encabezado general): citar `Docs/GDD_TC.docx, sección "NIVEL 1: PANTANO"`, `Docs/GDD_TC.docx, sección "NIVEL 2: DESIERTO"` o `Docs/GDD_TC.docx, sección "NIVEL 3: BOSQUE"`.
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
- Pisotón vs. contacto lateral: erizo inmune (el pisotón daña al jugador), cangrejo que aguanta 2 pisotones y no cae a pozos, avispa por pisotón o lengua (GDD: se abalanza **haciendo arcos en forma de U**; en el código es flote + picada que recupera altura — ver brechas), águila jefe que recibe varios golpes (`Eagle.stomp()` emite `boss-defeated`).
- Enemigos aéreos y su temporización (avispa que sigue al jugador hasta matarla o salir de rango).
- Lengua: captura con **X/clic** (`src/entities/Tongue.js`) y lengua-cuerda con **C** a anclas fijas (`src/entities/TongueRope.js`, péndulo con `climb(dir, delta)`). Reglas del GDD **ya implementadas**: **exclusión mutua** (con la cuerda enganchada no se ataca: `Game.js` bloquea `X`/clic y las capturas) e **izar/bajar** con **↑/↓** (C/Espacio sueltan la cuerda).
- Puntos y vida extra (100 puntos = 1 hoja), mariposas/moscas, HUD de hojas.
- Obstáculos: espinas, cactus-pared, pozo con respawn, barro/arena movediza que ralentiza temporalmente, tronco que se interpone.
- Escenas y transiciones, spawn/checkpoints, condición de victoria por punto final de cada nivel y derrota con reinicio desde 0.
- Niveles: el GDD define 3 (Pantano, Desierto, Bosque con águila) y hoy `LEVELS = [LEVEL1, LEVEL2]` (ver brechas); verificar `src/levels/index.js` antes de asumir cuál está activo.
- Input de teclado (cursor, WASD, X, R) y táctil (pointer) si se extiende.

Brechas GDD vs. código (revisado 28/10/2026, tras `c766c27`, `a2ce544`, `f73ef8a` y `0d8615b`). **Cerradas**, verificar que sigan así antes de cada tarea:

- Puntaje: al llegar a 100 se gana 1 hoja y el puntaje vuelve a 0 — `src/domain/Score.js`.
- Tronco y arena movediza — `log`, `sand` en `Preloader.js`; colisión y ralentizado en `Game.js`.
- Cactus fuera del Nivel 1 — `LEVEL1` sin cactus (GDD no lo lista en Pantano); el Nivel 2 sí los tiene.
- Carga en Phaser 4 — `Group.children.forEach` (el `Set` nativo no tiene `each`).
- **Exclusión mutua de la lengua** (GDD *Lengua*) — `Game.js` bloquea `X`/clic y las capturas mientras `rope.attached`.
- **"Subir de arriba a abajo" con la cuerda** — `TongueRope.climb` con **↑/↓** (C/Espacio sueltan).
- Sprites reales de rana, cangrejo y erizo — `public/*.png` trackeados, cargados en `Preloader` con mockup de respaldo.
- `physics.debug` en `false` (`main.js`).
- Menú principal (`MainMenu.js`) con reinicio de progresión al jugar; victoria de nivel avanza sola al siguiente.
- Nivel 1 largo (~5500 px, 8 pozos) con dificultad creciente por posición; derrota reinicia hojas/puntaje (`Progression.resetLevel`); hojas sin tope; erizo anti-pozo.

Abiertas (decisiones pendientes, no inventar solución sin consultar):

- **Cobertura de niveles:** el GDD lista `sección "NIVEL 1: PANTANO"`, `"NIVEL 2: DESIERTO"` y `"NIVEL 3: BOSQUE"` con águila en el último; hoy `LEVELS = [LEVEL1, LEVEL2]` y `level3.js`/`Eagle.js` siguen **sin registrar** → falta Bosque + jefe final.
- **Avispa "arcos en forma de U"** (viñeta *Enemigos*, edición del GDD del 28/10): `Wasp.js` hace flote con seno + picada que sigue al jugador en X y recupera altura — semeja una U pero **no está modelada como arco**. Clasificar como Parcialmente definido y consultar el comportamiento esperado antes de tocarla.
- **Temporizador por nivel** (`level.timeLimit`, por defecto 300 s en `Game`; el `HUD` usa 180 si no se lo pasa): **no aparece en el GDD** — es una ampliación, clasificarla como tal y no presentarla como regla documentada.
- `src/levels/level1.js` dice en su comentario "Nivel único" (desactualizado desde que se registró `LEVEL2`) — detalle menor del código del usuario.
- El HUD no muestra la vida del jefe águila (GDD no lo exige; procederá cuando el águila se registre).
- Legacy sin eliminar: `src/config/LevelConfig.js`, `src/entities/Health.js`, `src/entities/EnemyFactory.js`; además `level3.js` y `Eagle.js` conservados sin registrar.

Estas brechas son notas de revisión con fecha y pueden quedar desactualizadas: contrastar siempre contra el GDD vigente y el código real.

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
- Modelar el dominio con POO: `Player`, `Enemy` y variantes (`Crab`, `Hedgehog`, `Wasp`, `Fly`, y `Eagle` — clase existente pero **sin registrar** hoy), `Tongue`, `TongueRope`, `Health`, `Score`, `Progression`, `HUD`, `EntityFactory`; escenas `Boot`, `Preloader`, `MainMenu`, `Game`. Aún no implementadas según el GDD: el nivel Bosque con el jefe, los arcos en U de la avispa y los pickups con sprite propio (mosca/mariposa usan mockups) — no inventar su API sin consultar.
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
- Usar `src/levels/index.js` (`LEVELS`, hoy `[LEVEL1, LEVEL2]`) y `src/levels/level1.js|level2.js` — `level3.js` existe sin registrar; `src/config/LevelConfig.js` es legacy no usado.
- Usar `src/domain/Progression.js` (singleton por módulo) para hojas, puntaje e índice de nivel entre escenas; no crear otra instancia de estado global.
- No crear un segundo `Health`, factory, registro de niveles ni config de nivel.

Si no existe código reutilizable (nuevos pickups, plataformas móviles, transiciones con pantalla), indicarlo y diseñar una solución coherente con el proyecto.

## 7. Consultar sobre sprites y recursos gráficos

Cuando se necesiten sprites u otros recursos:

1. Revisar los recursos disponibles:
   - `public/` (todo trackeado): fondo `Pantano Titan Croar.png` (clave `bgPantano`) y sprites reales `rana.png`, `cangrejo.png`, `erizo.png` (claves `player`, `crab`, `hedgehog`, cargados en `Preloader` con mockup de respaldo).
   - `assets/` (trackeado): originales `RANA TITAN CROAR1.png`, `PUERCO ESPÍN.png`, `Pantano Titan Croar.png`, `Cangrejo acorazado.png` — de donde salen los próximos recursos (copiarlos a `public/` con nombre ASCII).
   - `src/scenes/Preloader.js`: mockups por `generateTexture` como respaldo (`textures.exists`) — `player`, `crab`, `hedgehog` solo si falla la imagen real, y siempre `fly`, `butterfly`, `tile`, `spike`, `mud`, `cactus`, `goal`, `log`, `anchor`, `sand`, `eagle`, `feather`.
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
- Sin recurso real (solo mockups o color de fondo): captura/lengua, tronco, arena, águila y plumas usan mockups; el Nivel 2 solo tiene `bgColor` y el 3 ni está registrado. Pedir el recurso antes de depender de él.

## 8. Definir y preparar el flujo Git

Estado conocido: repositorio con remoto `origin` (GitHub `marcosarecobravo-star/TITAN_CROAR`); convención de commits usada: Conventional Commits en español (`feat(alcance):`, `fix(...)`, `docs:`, `refactor(...)`). Verificar el estado real en cada tarea (`git status`, `git branch -vv`, `git remote -v`).

- No imponer GitFlow: flujo simple salvo acuerdo contrario.
  - `feature/<descripcion>`, `fix/<descripcion>`, `docs/<descripcion>`, `refactor/<descripcion>`
  - No trabajar directamente sobre `main`, `master` o `develop`.
- Si ya existe una rama apropiada, verificar si corresponde continuar en ella.
- Si no hay estrategia definida para la tarea, consultar rama base, convención de nombres y remoto.
- Preservar cambios previos del usuario (hoy: **`M Docs/GDD_TC.docx`** — la edición sin commitear del GDD descrita en §1); si interfieren, consultar antes de moverlos, descartarlos o mezclarlos.
- Si no hubiera repositorio o remoto, informarlo y consultar antes de inicializarlo o configurarlo.

## 9. Implementar y verificar

- Definir criterios de aceptación desde el requisito, el GDD y las aclaraciones del usuario.
- Cambios enfocados al alcance acordado.
- Comprobaciones disponibles: `npm run build` (compila con Vite), `npm run dev` + prueba manual en navegador (no hay tests ni lint). En PowerShell, usar `npm.cmd run ...`: `npm.ps1` está bloqueado por la política de ejecución del sistema.
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
- **Documentación:** estado y referencia `Docs/GDD_TC.docx, sección "..."`, con clasificación Definido/Parcialmente definido/No definido/En contradicción/No aplica.
- **Conflictos e impacto:** reglas y funcionalidades afectadas.
- **Reutilización:** código aprovechable o constancia de que no existe.
- **Diseño:** enfoque POO y patrones pertinentes en Phaser + Vite.
- **Recursos gráficos:** recursos confirmados o consulta pendiente.
- **Git:** rama base y rama de trabajo, y cambios ajenos pendientes.
- **Dudas:** decisiones que requieren respuesta del usuario.

En consultas simples, reducir el formato a los puntos aplicables.

Al finalizar, resumir: cambios y archivos afectados, decisiones relevantes, verificaciones ejecutadas, pendientes reales, confirmación solicitada y —solo si se autorizó y ejecutó— resultado de commit y push. No presentar propuestas como funcionalidades implementadas.
