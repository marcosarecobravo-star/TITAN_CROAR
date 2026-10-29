# AGENTS.md — TITAN CROAR

## 1. Alcance y contexto

- Aplicar estas instrucciones al inicio de cada consulta y antes de modificar el proyecto.
- Responder en español. Adaptar la profundidad al pedido: breve en consultas simples, completa en cambios de comportamiento.
- Rutas vigentes (verificarlas en cada tarea; no asumir que siguen iguales):
  - Documento principal de requisitos: `Docs/TITAN_CROAR_GDD_Final.docx` (único documento; `Docs/` para documentación adicional). Reemplaza a `Docs/GDD_TC.docx` (eliminado por el usuario el 29/10/2026): es la **misma especificación, ampliada y numerada** (§1–§21: ficha, visión, historia, alcance, controles, movimiento con parámetros, lengua con estados, insectos-moneda y vidas, daño y checkpoints, enemigos, obstáculos, niveles, HUD y pantallas, persistencia, RF, criterios de aceptación, riesgos, decisiones pendientes, definición de terminado). Preservar: no descartar ni sobrescribir.
  - Código: `src/main.js`, `src/scenes/` (`Boot.js`, `Preloader.js`, `MainMenu.js`, `Game.js`), `src/entities/`, `src/domain/`, `src/levels/` (`index.js`, `level1.js`, `level2.js`, `level3.js`), `src/ui/HUD.js`.
  - Niveles registrados: `src/levels/index.js` exporta **`LEVELS = [LEVEL1, LEVEL2]`** — Pantano y Desierto (multinivel reactivo en `f73ef8a`/`0d8615b`). `level3.js` (Bosque) y `src/entities/Eagle.js` existen pero **no están registrados/uso**: no asumir jefe activo.
  - Escenas: `Preloader` → `MainMenu` (título y botón Jugar, resetea la progresión) → `Game`; la victoria de nivel avanza sola al siguiente.
  - Estado de progresión: `src/domain/Progression.js` (singleton por módulo, exporta `progression`); derrota = `resetLevel()` (hojas 3 y puntaje 0).
  - Legacy, no usar sin decisión explícita: `src/config/LevelConfig.js`, `src/entities/Health.js`, `src/entities/EnemyFactory.js`.
  - Recursos gráficos: los **5 PNG de `public/` están trackeados** (fondo `Pantano Titan Croar.png` + sprites reales `rana.png`, `cangrejo.png`, `erizo.png`, `avispa.png`, con mockup de respaldo en `Preloader.make`); `assets/` conserva los originales (incl. `Avispa gigante.png`); mockups generados en `src/scenes/Preloader.js` y `src/scenes/Boot.js`.
  - Configuración: `package.json` (scripts `dev`, `build`, `preview`; sin tests ni lint), `vite.config.js`, `index.html`.
- Si las rutas reales difieren de las anteriores, usar las reales y señalar la diferencia.
- Revisar la información vigente en cada consulta; no depender solo de resúmenes de conversaciones anteriores.
- Preservar el trabajo existente del usuario. Estado conocido (29/10/2026, rama `feature/prototipo-nivel1-gdd-nuevo` con upstream): **working tree con** `D Docs/GDD_TC.docx`, `?? Docs/TITAN_CROAR_GDD_Final.docx`, `M src/entities/Enemy.js`, `Wasp.js`, `level1.js`, `level2.js`, `Game.js`, `Preloader.js`, `?? assets/Avispa gigante.png`, `?? public/avispa.png`. La lista exacta cambia con cada tarea: verificar con `git status`. No descartar ni commitear sin consultar.

## 2. Revisar la documentación y el requisito

Antes de proponer o implementar:

1. Identificar el requisito y su comportamiento esperado.
2. Revisar `Docs/`, como mínimo `Docs/TITAN_CROAR_GDD_Final.docx`.
3. Consultar las secciones pertinentes del GDD: §1 Ficha del proyecto, §2 Visión y pilares, §3 Historia y mundo, §4 Alcance (incluido/fuera), §5 Controles y reglas de entrada, §6 Movimiento del protagonista (parámetros, salto y aterrizaje), §7 Lengua (estados LIBRE/BUSCANDO/ENGANCHADA/SUBIENDO/BAJANDO/CAPTURANDO, enganche, captura), §8 Sistema de insectos-moneda y vidas, §9 Daño, muerte y puntos de control, §10 Enemigos (10.1 cangrejo, 10.2 avispa, 10.3 erizo, 10.4 águila jefe), §11 Obstáculos y reglas de colisión, §12 Diseño de los tres niveles (12.1 Pantano, 12.2 Desierto, 12.3 Bosque), §14 HUD y pantallas, §15 Reglas de reinicio y persistencia, §16 Requisitos funcionales (RF-01..RF-15), §18 Criterios de aceptación y pruebas, §20 Decisiones pendientes, §21 Definición de terminado, y el listado final de niveles (§12.1/12.2/12.3).
4. Clasificar el requisito como:
   - **Definido:** el GDD describe suficientemente el comportamiento.
   - **Parcialmente definido:** contemplado pero faltan detalles necesarios.
   - **No definido:** no aparece en la documentación revisada.
   - **En contradicción:** difiere de una regla documentada.
   - **No aplica:** consulta técnica o documental sin regla funcional asociada.
5. Citar la fuente:
   - `.docx`: `Docs/TITAN_CROAR_GDD_Final.docx, sección "<Título>"` — sin citar por página (la numeración depende del visor).
   - Listado final de niveles (párrafos sin encabezado general): citar `Docs/TITAN_CROAR_GDD_Final.docx, sección "NIVEL 1: PANTANO"`, `Docs/TITAN_CROAR_GDD_Final.docx, sección "NIVEL 2: DESIERTO"` o `Docs/TITAN_CROAR_GDD_Final.docx, sección "NIVEL 3: BOSQUE"`.
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
- Pisotón vs. contacto lateral: erizo inmune (el pisotón daña al jugador), cangrejo que aguanta 2 pisotones y no cae a pozos, avispa por pisotón o lengua (GDD §10.2: embestida **en arco** con recuperación y ventana vulnerable; el código implementa el arco en U+W con seguimiento horizontal, pero sin recuperación ni ventana de captura — ver brechas), águila jefe que recibe varios golpes (`Eagle.stomp()` emite `boss-defeated`).
- Enemigos aéreos y su temporización (avispa que sigue al jugador hasta matarla o salir de rango; abandona la persecución al salir del rango durante un tiempo configurable).
- Lengua: captura con **X/clic** (`src/entities/Tongue.js`) y lengua-cuerda con **C** a anclas fijas (`src/entities/TongueRope.js`, péndulo con `climb(dir, delta)`). Reglas del GDD **ya implementadas**: **exclusión mutua** (con la cuerda enganchada no se ataca: `Game.js` bloquea `X`/clic y las capturas) e **izar/bajar** con **↑/↓** (C/Espacio sueltan la cuerda).
- Coyote time (0,10 s) y buffer de salto (0,12 s) — §6.1 del GDD; **no implementados** (el jugador salta solo si `body.blocked.down`).
- Puntos y vida extra (GDD §8: mosca 5, avispa 15, mariposa 5; 100 = 1 vida extra y **se resta 100 conservando el excedente**; vidas máx. sugeridas 5), mariposas/moscas, HUD de hojas.
- Obstáculos: espinas, cactus-pared, pozo con respawn, barro/arena movediza que ralentiza temporalmente, tronco, **rocas que caen**, **plataformas móviles**, **ráfagas de viento** (§11, §12).
- Escenas y transiciones, spawn/checkpoints (≥2 por nivel, señalizados, activación por contacto), condición de victoria por punto final de cada nivel, derrota con reinicio desde 0, pausa (Esc) y pantallas de derrota/victoria.
- Niveles: el GDD define 3 (Pantano, Desierto, Bosque con águila) y hoy `LEVELS = [LEVEL1, LEVEL2]` (ver brechas); verificar `src/levels/index.js` antes de asumir cuál está activo.
- Input de teclado (cursor, WASD, X, R) y táctil (pointer) si se extiende.

Brechas GDD vs. código (revisado 29/10/2026, tras `c766c27`, `a2ce544`, `f73ef8a`, `0d8615b` y `3639f34`). **Cerradas**, verificar que sigan así antes de cada tarea:

- Puntaje: al llegar a 100 se gana 1 hoja y el puntaje vuelve a 0 — `src/domain/Score.js` (la lógica de excedente coincide con §8: resta 100 conservando el resto).
- Tronco y arena movediza — `log`, `sand` en `Preloader.js`; colisión y ralentizado en `Game.js`.
- Cactus fuera del Nivel 1 — `LEVEL1` sin cactus (GDD §11 no lo lista en Pantano); el Nivel 2 sí los tiene.
- Carga en Phaser 4 — `Group.children.forEach` (el `Set` nativo no tiene `each`).
- **Exclusión mutua de la lengua** (GDD §7) — `Game.js` bloquea `X`/clic y las capturas mientras `rope.attached`.
- **"Subir de arriba a abajo" con la cuerda** — `TongueRope.climb` con **↑/↓** (C/Espacio sueltan).
- Sprites reales de rana, cangrejo, erizo y avispa — `public/*.png` trackeados, cargados en `Preloader` con mockup de respaldo.
- `physics.debug` en `false` (`main.js`).
- Menú principal (`MainMenu.js`) con reinicio de progresión al jugar; victoria de nivel avanza sola al siguiente.
- Nivel 1 largo (~5500 px, 8 pozos) con dificultad creciente por posición; derrota reinicia hojas/puntaje (`Progression.resetLevel`); hojas sin tope; erizo anti-pozo.
- Avispa con embestida en **arco en U** (reimplementada por el usuario: arco con seno, seguimiento horizontal, arco doble U+W, aborto si el jugador se aleja) — cierra parcialmente la brecha "arcos en forma de U" (§10.2).
- Erizo inmune y cangrejo de 2 pisotones sin señal visual tras el 1.º — coinciden con §10.1/§10.3.

Abiertas (decisiones pendientes, no inventar solución sin consultar):

- **Cobertura de niveles:** el GDD lista §12.1 Pantano, §12.2 Desierto y §12.3 Bosque con águila; hoy `LEVELS = [LEVEL1, LEVEL2]` y `level3.js`/`Eagle.js` siguen **sin registrar** → falta Bosque + jefe final.
- **Valores de insectos-moneda** (§8: mosca 5, avispa 15, mariposa 5) vs. código (10/50/25) — decidir si se ajustan a los del GDD.
- **Tope de vidas** (§8/§9: sugerencia 5 máx.) vs. `Health.heal` sin tope — decidir límite.
- **Coyote time (0,10 s) y buffer de salto (0,12 s)** (§6.1) — no implementados.
- **Parámetros de movimiento** (§6.1: 260/1200/1500/−480/1200) vs. código (220/−520/900) — valores iniciales ajustables, decidir si se adoptan.
- **Estados de la lengua** (§7: LIBRE/BUSCANDO/ENGANCHADA/SUBIENDO/BAJANDO/CAPTURANDO) — el código usa `Tongue`/`TongueRope` separados y booleanos en `Game`; refactor a máquina de estados pendiente.
- **Enganche** (§7.1: solo puntos "Enganchable", distancia máx. por ancla, no atraviesa paredes, conservar impulso al soltar, soltar seguro si el anclaje se destruye) — `tryAttach` no verifica línea de visión; `detach` amplifica ×1,5.
- **Avispa** (§10.2: embestida en arco con recuperación, rango máximo, abandono por tiempo configurable, capturable con lengua en **ventana vulnerable**, sin cambio instantáneo de dirección) — el código tiene arco, seguimiento y aborto por distancia, pero `recoverTimer` no se usa y no hay ventana de captura ni retorno a la zona inicial.
- **Águila** (§10.4: 3 fases — picado, plumas, barrido aéreo —, 6 HP, ventanas de vulnerabilidad, +velocidad al 50%, arena con enganches) — `Eagle` tiene `patrol/charge/feathers/recover` con 3 HP por defecto, sin barrido aéreo ni umbral del 50%; además sigue sin registrar.
- **Nuevos obstáculos** (§11: rocas que caen, plataformas móviles, ráfagas de viento) — no existen en el código.
- **Checkpoints** (§9: ≥2 por nivel, señalizados, activación por contacto; respawn seguro; si no hay checkpoint, inicio del nivel) — no existen; solo `lastSafe`.
- **Pausa (Esc) y menús** (§5/§14: Continuar, Reiniciar desde checkpoint, Controles, Salir; derrota con Reiniciar nivel/Volver al menú; victoria con tiempo e insectos) — no implementados; solo `R` para reiniciar.
- **Pantallas de derrota/victoria** (§14) — solo texto efímero en HUD.
- **Mariposa** (§8/§10: recompensa por contacto desde arriba) — el código suma puntos por cualquier contacto.
- **HUD** (§14: vidas, insectos X/100, indicador de checkpoint, barra del jefe solo en nivel 3) — falta indicador de checkpoint y barra del jefe.
- **Controles unificados** (§5: un botón prioriza enganche sobre captura) vs. `X`/`C`/clic separados — decidir si se unifica.
- `src/levels/level1.js` dice en su comentario "Nivel único" (posible reversión del multinivel; verificar intención del usuario).
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
- Modelar el dominio con POO: `Player`, `Enemy` y variantes (`Crab`, `Hedgehog`, `Wasp`, `Fly`, y `Eagle` — clase existente pero **sin registrar** hoy), `Tongue`, `TongueRope`, `Health`, `Score`, `Progression`, `HUD`, `EntityFactory`; escenas `Boot`, `Preloader`, `MainMenu`, `Game`. Aún no implementadas según el GDD (§7 estados de la lengua, §10.4 águila con 3 fases, §11 nuevos obstáculos, §14 HUD/pantallas, etc.): máquina de estados de la lengua, águila (picado/plumas/barrido, 6 HP, ventanas de vulnerabilidad, umbral 50%), rocas que caen, plataformas móviles, ráfagas de viento, checkpoints señalizados, pausa y menús, pickups con sprite propio (mosca/mariposa usan mockups) — no inventar su API sin consultar.
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
   - `public/` (todo trackeado): fondo `Pantano Titan Croar.png` (clave `bgPantano`) y sprites reales `rana.png`, `cangrejo.png`, `erizo.png`, `avispa.png` (claves `player`, `crab`, `hedgehog`, `wasp`, cargados en `Preloader` con mockup de respaldo).
   - `assets/` (trackeado): originales `RANA TITAN CROAR1.png`, `PUERCO ESPÍN.png`, `Pantano Titan Croar.png`, `Cangrejo acorazado.png`, `Avispa gigante.png` — de donde salen los próximos recursos (copiarlos a `public/` con nombre ASCII).
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
- Preservar cambios previos del usuario (hoy: `D Docs/GDD_TC.docx`, `?? Docs/TITAN_CROAR_GDD_Final.docx`, `M src/entities/Enemy.js`, `Wasp.js`, `level1.js`, `level2.js`, `Game.js`, `Preloader.js`, `?? assets/Avispa gigante.png`, `?? public/avispa.png`); si interfieren, consultar antes de moverlos, descartarlos o mezclarlos.
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
- **Documentación:** estado y referencia `Docs/TITAN_CROAR_GDD_Final.docx, sección "..."`, con clasificación Definido/Parcialmente definido/No definido/En contradicción/No aplica.
- **Conflictos e impacto:** reglas y funcionalidades afectadas.
- **Reutilización:** código aprovechable o constancia de que no existe.
- **Diseño:** enfoque POO y patrones pertinentes en Phaser + Vite.
- **Recursos gráficos:** recursos confirmados o consulta pendiente.
- **Git:** rama base y rama de trabajo, y cambios ajenos pendientes.
- **Dudas:** decisiones que requieren respuesta del usuario.

En consultas simples, reducir el formato a los puntos aplicables.

Al finalizar, resumir: cambios y archivos afectados, decisiones relevantes, verificaciones ejecutadas, pendientes reales, confirmación solicitada y —solo si se autorizó y ejecutó— resultado de commit y push. No presentar propuestas como funcionalidades implementadas.
