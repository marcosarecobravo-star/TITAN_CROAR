# AGENTS.md — TITAN CROAR

## 1. Alcance y contexto

- Aplicar estas instrucciones al inicio de cada consulta y antes de modificar el proyecto.
- Responder en español. Adaptar la profundidad al pedido: breve en consultas simples, completa en cambios de comportamiento.
- Rutas vigentes:
  - Documento principal de requisitos: `Docs/GDD_DT2.docx`
  - Documentación adicional: `Docs/`
  - Código futuro: `src/`
  - Escenas: `scenes/` o `src/scenes/` según se cree — verificar en cada tarea, no asumir.
  - Recursos gráficos: `assets/`
- Si las rutas reales difieren de lo anterior, usar las reales y señalar la diferencia.
- Revisar la información vigente en cada consulta; no depender solo de resúmenes anteriores.
- Preservar el trabajo existente del usuario. Estado actual: proyecto sin código ni assets; solo existe el GDD.

## 2. Revisar la documentación y el requisito

Antes de proponer o implementar:

1. Identificar el requisito y su comportamiento esperado.
2. Revisar `Docs/`, como mínimo `Docs/GDD_DT2.docx`.
3. Consultar las secciones pertinentes del GDD: Descripción General, Historia, Mecánica principal, Enemigos, Obstáculos, Condición de Derrota, Condición de Victoria.
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

- Revisar reglas del GDD y la implementación existente en `src/` / `scenes/`.
- Identificar dependencias, restricciones compartidas, excepciones, prioridades y posibles regresiones.
- Comparar comportamiento actual vs. documentación; no asumir que el código existente es correcto.
- Detectar contradicciones internas del GDD, incluso entre texto y diagramas/imágenes si se agregan.
- Comunicar conflictos relevantes antes de modificar la parte afectada.

Adaptado a este plataformas Phaser:

- Movimiento lateral izquierda-derecha, salto, gravedad y colisiones con plataformas/piso.
- Salto como ataque vs. evasión vs. ascenso; enemigos con inmunidad (erizo gigante) o golpes múltiples (cangrejo x2, águila jefe "varias veces").
- Enemigos aéreos (avispa que se abalanza, águila con carga/plumas/ataques aéreos) y su temporización.
- Obstáculos: espinas en piso/plataformas, cactus como pared, pozos por nivel, barro que reduce velocidad temporalmente.
- Vidas-hojas, derrota con reinicio desde 0, victoria al derrotar al jefe del último nivel.
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
- Modelar entidades del dominio con POO: `Player`, `Enemy`, variantes (`Hedgehog`, `Crab`, `Wasp`, `EagleBoss`), `Obstacle`, `Level/LevelConfig`, `Health/Hojas`, `HUD`.
- Encapsular estado y reglas; alta cohesión, bajo acoplamiento; preferir composición sobre herencia profunda.
- Separar lógica de dominio de `Scene`, render e input. La Scene orquesta; las reglas viven en clases testeables.
- Usar patrones solo con necesidad concreta y explicar brevemente la elección:
  - State para estados del jugador (idle/run/jump/hurt) y fases del jefe.
  - Strategy para comportamientos de enemigos y efectos (patrulla, abalanzarse, carga, disparo de plumas; barro que ralentiza).
  - Factory para creación/spawn de enemigos y obstáculos por nivel.
  - Observer vía `EventEmitter`/eventos de Scene para HUD ante daño, pérdida de hoja, derrota/victoria.
- Evitar abstracciones y refactors fuera del alcance.

## 6. Reutilizar código existente

Estado actual: no hay código reutilizable (solo existe `Docs/`). Por eso:

1. En cada tarea, buscar en `src/` y `scenes/` implementaciones relacionadas.
2. Revisar contratos, comportamiento y consumidores antes de crear algo nuevo.
3. Priorizar reutilizar o extender lo compatible; no duplicar lógica de negocio.
4. Extraer lógica común solo ante necesidad real, sin romper consumidores.
5. Respetar estructura, nombres y estilo del proyecto y la config Vite/Phaser.
6. Si no hay código reutilizable, indicarlo y diseñar coherente con el proyecto.

Repetir esta revisión en cada consulta; no asumir que la estructura sigue igual.

## 7. Consultar sobre sprites y recursos gráficos

Cuando se necesiten sprites u otros recursos:

1. Revisar `assets/` y sus convenciones (nombres, spritesheet, atlas, audio).
2. Antes de implementar lo visual, usar la herramienta de preguntas para confirmar:
   - **Generar un mockup:** provisional para validar funcionalidad.
   - **Utilizar un recurso existente:** pedir el nombre exacto del recurso.
3. Si el recurso no se localiza, pedir ruta o archivo.

Además:

- No asumir sprite ni inventar nombres/rutas.
- Si es mockup, aclarar que es provisional y confirmar alcance visual mínimo.
- Si es existente, comprobar disponibilidad y compatibilidad (tamaño, fotogramas, animación, formato Phaser).
- Consultar spritesheet, frames o animaciones si faltan y son necesarios.
- Si falta el archivo, pedirlo antes de avanzar en lo dependiente.
- Continuar con la lógica independiente de gráficos mientras se resuelve.

## 8. Definir y preparar el flujo Git

Estado actual: sin repositorio Git ni remoto. Reglas:

- Antes de implementar, comprobar con `git status`, rama actual y remotos si existieran.
- No inicializar repo, ni configurar remoto, ni imponer GitFlow sin autorización explícita.
- Si en el futuro se adopta Git y no hay estrategia definida, consultar rama base, convención de nombres y remoto.
- Si se adopta un flujo simple, usar por defecto salvo acuerdo contrario:
  - `feature/<descripcion>`, `fix/<descripcion>`, `docs/<descripcion>`, `refactor/<descripcion>`
  - No trabajar directo sobre `main`/`master`/`develop`.
- Si ya existe una rama apropiada, verificar si corresponde continuar en ella.
- Preservar cambios previos del usuario; si interfieren, consultar antes de moverlos, descartarlos o mezclarlos.

## 9. Implementar y verificar

- Definir criterios de aceptación desde el requisito, el GDD y las aclaraciones.
- Cambios enfocados al alcance acordado.
- Ejecutar comprobaciones disponibles y pertinentes: scripts Vite/npm del proyecto (`dev`, `build`, `preview`, tests/lint si existen) y prueba jugable del nivel afectado.
- Verificar interacciones del análisis de impacto (salto/daño, inmunidades, barro, pozos, HUD de hojas, derrota/victoria).
- Agregar pruebas solo si aportan valor contra regresiones; evitar tests que solo repliquen la implementación.
- Informar qué se verificó y qué quedó pendiente. No afirmar resultados no comprobados.

## 10. Solicitar confirmación y realizar commit y push

Sin Git configurado, esta sección es condicional y solo aplica si el usuario autoriza e inicializa un repo:

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
- **Git:** estado actual (sin repo) y rama propuesta si se autoriza Git.
- **Dudas:** decisiones pendientes del usuario.

En consultas simples, reducir a los puntos aplicables.

Al finalizar, resumir: cambios y archivos, decisiones, verificaciones, pendientes reales, confirmación solicitada y —solo si se autorizó y ejecutó— resultado de commit/push. No presentar propuestas como implementadas.
