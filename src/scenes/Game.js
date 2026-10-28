import Phaser from 'phaser';
import Health from '../domain/Health.js';
import Score from '../domain/Score.js';
import Tongue, { TONGUE, POINTS } from '../entities/Tongue.js';
import TongueRope from '../entities/TongueRope.js';
import EntityFactory from '../domain/EntityFactory.js';
import HUD from '../ui/HUD.js';
import { LEVELS } from '../levels/index.js';
import { progression } from '../domain/Progression.js';

// Scene orquestadora (AGENTS.md §5): las reglas viven en Health/Enemigos/
// Factory; aquí solo se cablean física, colisiones y cámara.
// Nivel cargado por índice desde Progression (multinivel).
// Supuestos documentados (GDD no los define): 3 hojas, 1 golpe = 1 hoja,
// invencibilidad 1 s, pozo = 1 hoja + respawn, cangrejo 2 pisotones,
// erizo inmune, avispa 1 pisotón, barro/arena x0.5 velocidad, mariposa +25
// y 100 pts = 1 hoja. Lengua-captura (acordado): X/clic, alcance 90 px,
// activa 150 ms, cooldown 600 ms; avispa +50, mosca +10.
// Lengua-cuerda (decisión usuario): enganche a anclas con tecla C, péndulo.
// Progresión (decisión usuario): hojas y puntaje se conservan entre niveles;
// derrota = empezar desde 0 el nivel actual; bandera = avance automático.
const SPEED = 220;
const JUMP = -520;
const BOUNCE_AFTER_STOMP = -350;
const FEATHER_SPEED = 200;

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.won = false;
    this.over = false;
    this.invulnerableUntil = 0;

    // Nivel actual desde la progresión multinivel.
    this.levelIndex = progression.levelIndex;
    this.level = LEVELS[this.levelIndex] ?? LEVELS[0];
    this.isLastLevel = this.levelIndex >= LEVELS.length - 1;
    this.lastSafe = { ...this.level.spawn };

    this.physics.world.setBounds(0, -300, this.level.worldWidth, 900);
    // Sin colisión inferior: el pozo debe dejar caer al jugador.
    this.physics.world.setBoundsCollision(true, true, true, false);
    this.cameras.main.setBounds(0, -300, this.level.worldWidth, 900);
    if (this.level.bgColor) this.cameras.main.setBackgroundColor(this.level.bgColor);

    // Fondo del Nivel 1: PNG real (mockup de tema por nivel si no hay imagen).
    if (this.level.bgImage && this.textures.exists(this.level.bgImage)) {
      this.add.image(0, 0, this.level.bgImage)
        .setOrigin(0).setScrollFactor(0).setDepth(-10)
        .setDisplaySize(800, 600);
    }

    // Hojas y puntaje se conservan entre niveles (decisión usuario).
    // Sin tope de hojas (decisión usuario): solo se corrige un arranque a 0.
    this.health = new Health(3);
    this.health.lives = progression.lives > 0 ? progression.lives : 3;
    this.score = new Score({ threshold: 100 });
    this.score.points = Phaser.Math.Clamp(progression.points, 0, 99);
    this.score.on('extra-life', (n) => {
      for (let i = 0; i < n; i += 1) this.health.heal(1);
    });
    this.hud = new HUD(this, this.health, this.score, this.level.timeLimit ?? 300);
    this.timeLimit = this.level.timeLimit ?? 300;
    this.timeLeft = this.timeLimit;
    this.health.on('changed', (lives) => {
      progression.lives = lives;
      if (lives <= 0 && !this.over) this.lose();
    });
    this.score.on('changed', (pts) => { progression.points = pts; });

    // --- Terreno sólido ---
    this.solids = this.physics.add.staticGroup();
    for (const g of this.level.grounds) {
      EntityFactory.createStaticRect(this, this.solids, g.x + g.w / 2, g.y, 'tile', g.w, 32);
    }
    for (const p of this.level.platforms) {
      EntityFactory.createStaticRect(this, this.solids, p.x + p.w / 2, p.y, 'tile', p.w, 24);
    }
    this.cacti = this.physics.add.staticGroup();
    for (const c of this.level.cacti ?? []) {
      EntityFactory.createStaticRect(this, this.cacti, c.x, c.y, 'cactus', c.w, c.h);
    }
    // Tronco (GDD Obstáculos; sólido y saltable, sin daño — decisión usuario).
    this.logs = this.physics.add.staticGroup();
    for (const l of this.level.logs ?? []) {
      EntityFactory.createStaticRect(this, this.logs, l.x + l.w / 2, l.y, 'log', l.w, 24);
    }

    // --- Zonas y detalles ---
    this.spikes = this.physics.add.staticGroup();
    for (const s of this.level.spikes ?? []) this.spikes.create(s.x, s.y, 'spike');
    // Barro y arena movediza: ambos reducen la velocidad temporalmente
    // (GDD Obstáculos); mismo efecto, texturas distintas por tema.
    this.slowZones = this.physics.add.staticGroup();
    for (const m of this.level.muds ?? []) {
      EntityFactory.createStaticRect(this, this.slowZones, m.x + m.w / 2, m.y, 'mud', m.w, 16);
    }
    for (const s of this.level.sands ?? []) {
      EntityFactory.createStaticRect(this, this.slowZones, s.x + s.w / 2, s.y, 'sand', s.w, 16);
    }

    // Meta: solo si el nivel la define (el Nivel 3 se gana con el jefe).
    this.goal = this.level.goal
      ? this.physics.add.staticGroup().create(this.level.goal.x, this.level.goal.y, 'goal')
      : null;
    // Mariposas: al pasar sobre ellas suman puntos (GDD Mecánica).
    this.butterflies = this.physics.add.staticGroup();
    for (const b of this.level.butterflies ?? []) this.butterflies.create(b.x, b.y, 'butterfly');

    // Anclas de la lengua-cuerda (GDD Mecánica; mockups provisionales).
    this.anchors = this.level.anchors ?? [];
    for (const a of this.anchors) this.add.image(a.x, a.y, 'anchor').setDepth(4);

    // --- Jugador (sapo gigante, sprite real rana.png escalado a 48x48) ---
    this.player = this.physics.add.sprite(this.level.spawn.x, this.level.spawn.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(64, 64);
    this.player.setSize(48, 56);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    // --- Lengua-captura (mockup: rectángulo temporal, sin sprites externos) ---
    this.facing = 1;
    this.tongue = new Tongue();
    this.tongueView = this.add.rectangle(-100, -100, TONGUE.RANGE, 10, 0xff6b9d)
      .setVisible(false)
      .setDepth(5);

    // --- Lengua-cuerda de desplazamiento (péndulo sobre anclas) ---
    this.rope = new TongueRope({ maxRange: 240 });
    this.ropeView = this.add.graphics().setDepth(5);

    // --- Enemigos vía Factory (las moscas son inofensivas: sin colisión) ---
    const spawned = EntityFactory.createEnemies(this, this.level);
    this.boss = spawned.find((e) => e.texture.key === 'eagle') ?? null;
    this.enemies = spawned.filter((e) => e.texture.key !== 'fly');
    this.flies = spawned.filter((e) => e.texture.key === 'fly');
    for (const e of this.enemies) {
      // El jefe vuela: no colisiona con el terreno.
      if (e === this.boss) continue;
      this.physics.add.collider(e, this.solids);
      this.physics.add.collider(e, this.cacti);
    }

    // --- Plumas del jefe (proyectiles con gravedad) ---
    this.feathers = this.physics.add.group();
    this.physics.add.collider(this.feathers, this.solids, (f) => f.destroy());
    this.physics.add.overlap(this.player, this.feathers, (p, f) => {
      f.destroy();
      this.hurtPlayer();
    });

    // --- Colisiones ---
    this.physics.add.collider(this.player, this.solids);
    this.physics.add.collider(this.player, this.cacti, () => this.hurtPlayer());
    // Tronco: solo bloquea (sin daño), se puede saltar.
    this.physics.add.collider(this.player, this.logs);
    this.physics.add.collider(this.player, this.enemies, (p, e) => this.onPlayerEnemy(e));
    this.physics.add.overlap(this.player, this.spikes, () => this.hurtPlayer());
    if (this.goal) this.physics.add.overlap(this.player, this.goal, () => this.win());
    this.physics.add.overlap(this.player, this.butterflies, (p, b) => {
      if (!b.active) return;
      b.disableBody(true, true);
      this.score.add(25);
    });

    // Victoria final: derrotar al jefe (GDD Condición de Victoria).
    // scene.restart() no limpia scene.events: se elimina el listener previo.
    this.events.off('boss-defeated');
    this.events.on('boss-defeated', () => this.winFinal());

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,R,X,C');
    this.input.keyboard.on('keydown-R', () => this.restartByContext());
    this.input.on('pointerdown', (pointer) => {
      if (this.won || this.over) return;
      const wx = pointer.worldX ?? pointer.x;
      this.fireTongue(wx >= this.player.x ? 1 : -1);
    });
  }

  // R: contexto — derrota = reiniciar con 3 hojas y 0 pts; victoria =
  // reiniciar el juego (con un solo nivel isLastLevel siempre es true);
  // en juego = reintentar.
  restartByContext() {
    if (this.over) progression.resetLevel();
    else if (this.won) {
      if (this.isLastLevel) progression.reset();
      else progression.advance();
    }
    this.scene.restart();
  }

  spawnFeather(x, y, angle) {
    const f = this.feathers.create(x, y, 'feather');
    if (!f) return;
    f.setDepth(4);
    f.setVelocity(Math.cos(angle) * FEATHER_SPEED, Math.sin(angle) * FEATHER_SPEED);
    f.setAngularVelocity(120);
  }

  onPlayerEnemy(enemy) {
    if (this.won || this.over || enemy.dead) return;
    if (enemy.texture.key === 'fly') return; // mosca inofensiva al contacto
    const playerBody = this.player.body;
    const enemyBody = enemy.body;
    const velocityY = playerBody.velocity.y ?? 0;
    // Pisotón robusto: no depende de la velocidad en el momento de la
    // colisión (que puede haberse anulado al aterrizar). Se considera
    // pisotón si el jugador estaba por encima del enemigo el frame anterior
    // (_playerPrevBottom, registrado en update()) o si sus pies quedan por
    // encima del centro vertical del enemigo este frame.
    const wasAbove = (this._playerPrevBottom != null) &&
      this._playerPrevBottom <= enemyBody.center.y + 8;
    const fromAbove = wasAbove || (playerBody.bottom <= enemyBody.center.y + 8);

    if (fromAbove) {
      // Erizo inmune (GDD): el pisotón daña al jugador, no al enemigo.
      if (enemy.texture.key === 'hedgehog') {
        this.hurtPlayer();
        return;
      }
      // Jefe: recibe varios golpes (GDD: "golpearlo varias veces").
      enemy.stomp();
      this.player.setVelocityY(BOUNCE_AFTER_STOMP);
    } else if (velocityY >= 0) {
      // Solo daña si el jugador no está rebotando tras un pisotón
      // (velocityY < 0): evita el daño fantasma en los frames siguientes.
      this.hurtPlayer();
    }
  }
  
  hurtPlayer() {
    if (this.won || this.over) return;
    const now = this.time.now;
    if (now < this.invulnerableUntil) return;
    this.invulnerableUntil = now + 1000;
    // knockback + parpadeo de invencibilidad
    this.player.setVelocityY(-280);
    this.tweens.add({
      targets: this.player, alpha: 0.25, duration: 100, yoyo: true, repeat: 5,
      onComplete: () => this.player.setAlpha(1),
    });
    this.health.damage(1);
  }

  fireTongue(dir) {
    if (this.won || this.over) return;
    // GDD Mecánica: mientras la cuerda está enganchada no se puede atacar
    // a los insectos con la lengua (exclusión mutua).
    if (this.rope.attached) {
      this.flashMessage('Lengua ocupada', 'Soltá la cuerda (C o Espacio)');
      return;
    }
    if (!this.tongue.fire(this.time.now, dir)) return;
    const r = this.tongue.rect(this.player.x, this.player.y, this.player.displayWidth / 2);
    this.tongueView.setPosition((r.x0 + r.x1) / 2, r.y).setVisible(true);
  }

  resolveTongueCaptures(now) {
    // GDD Mecánica: exclusión mutua — con la cuerda enganchada no hay
    // captura (ni se dibuja la lengua).
    if (this.rope.attached) {
      this.tongueView.setVisible(false);
      return;
    }
    if (!this.tongue.isActive(now)) {
      this.tongueView.setVisible(false);
      return;
    }
    const px = this.player.x;
    const py = this.player.y;
    const halfW = this.player.displayWidth / 2;
    // GDD: la lengua atrapa avispas y moscas (no cangrejo/erizo/jefe).
    for (const e of this.enemies) {
      if (e.dead || e.texture.key !== 'wasp') continue;
      if (this.tongue.hits(e, px, py, halfW)) {
        e.capture();
        this.score.add(POINTS.WASP);
      }
    }
    for (const f of this.flies) {
      if (f.dead) continue;
      if (this.tongue.hits(f, px, py, halfW)) {
        f.capture();
        this.score.add(POINTS.FLY);
      }
    }
  }

  // Mensaje efímero (feedback de reglas, p. ej. exclusión mutua de la lengua).
  flashMessage(main, sub = '') {
    const { width } = this.cameras.main;
    const t = this.add.text(width / 2, 90, main, {
      fontSize: '16px', color: '#ffe66d', stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
    const subT = sub ? this.add.text(width / 2, 112, sub, {
      fontSize: '12px', color: '#dddddd', stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20) : null;
    this.time.delayedCall(900, () => { t.destroy(); if (subT) subT.destroy(); });
  }

  win() {
    if (this.won || this.over) return;
    // Un solo nivel registrado: la bandera finaliza el juego (decisión usuario).
    if (this.isLastLevel) {
      this.winFinal();
      return;
    }
    this.won = true;
    this.player.setVelocity(0, 0);
    this.player.body.setAllowGravity(false);
    this.rope.detach(this.player);
    this.hud.message('¡Nivel superado!', 'Avanzando al siguiente nivel…');
    // Transición automática (decisión usuario); R sigue como atajo.
    this.time.delayedCall(1500, () => {
      progression.advance();
      this.scene.restart();
    });
  }

  // Victoria final del juego (único nivel: bandera o jefe derrotado).
  winFinal() {
    if (this.won || this.over) return;
    this.won = true;
    this.player.setVelocity(0, 0);
    this.player.body.setAllowGravity(false);
    this.rope.detach(this.player);
    this.hud.message('¡Juego completado!', 'Presioná R para jugar de nuevo');
  }

  lose() {
    if (this.over) return;
    this.over = true;
    this.player.setVelocity(0, 0);
    this.player.setTint(0xff0000);
    this.rope.detach(this.player);
    this.hud.message('Sin hojas — derrotado', 'Presioná R para empezar desde 0');
  }

  update(time, delta) {
    // Registrar la posición previa del jugador (pies) para la detección de
    // pisotón robusta en onPlayerEnemy (el collider de Phaser puede disparar
    // con la velocidad ya anulada al aterrizar).
    if (this.player?.body) this._playerPrevBottom = this.player.body.bottom;
    // Plumas fuera de pantalla: limpieza. Phaser 4: Group.children es un Set
    // nativo (forEach), no el Structs.Set de Phaser 3 (que tenía each).
    this.feathers.children.forEach((f) => {
      if (f.active && (f.y > 640 || f.x < -40 || f.x > this.level.worldWidth + 40)) f.destroy();
    });
    if (this.won || this.over) return;
    // Temporizador de cuenta regresiva (arriba a la derecha).
    this.timeLeft -= delta / 1000;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.hud.updateTimer(0);
      this.lose();
      return;
    }
    this.hud.updateTimer(this.timeLeft);
    const p = this.player;
    const inSlow = this.physics.overlap(p, this.slowZones);
    const speed = inSlow ? SPEED * 0.5 : SPEED;

    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;

    if (left && !right) { p.setVelocityX(-speed); this.facing = -1; }
    else if (right && !left) { p.setVelocityX(speed); this.facing = 1; }
    else p.setVelocityX(0);
    // La rana mira hacia la dirección de movimiento.
    this.player.setFlipX(this.facing < 0);

    // Lengua-cuerda: mientras esté enganchada, ↑ trepa (acorta la cuerda) y
    // ↓ baja (la alarga); C o Espacio la sueltan. Fuera de la cuerda, salto
    // normal (GDD: "poder subir de arriba a abajo" + exclusión mutua).
    if (this.rope.attached) {
      if (this.cursors.up.isDown || this.keys.W.isDown) this.rope.climb(-1, delta);
      else if (this.cursors.down.isDown || this.keys.S.isDown) this.rope.climb(1, delta);
      if (Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.keys.C)) {
        this.rope.detach(this.player);
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) p.setVelocityY(JUMP);
      }
    } else {
      const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        || Phaser.Input.Keyboard.JustDown(this.keys.W)
        || Phaser.Input.Keyboard.JustDown(this.cursors.space);
      if (jumpPressed && p.body.blocked.down) p.setVelocityY(JUMP);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.X)) this.fireTongue(this.facing);
    // Enganche a un ancla (solo si no está enganchado).
    if (!this.rope.attached && Phaser.Input.Keyboard.JustDown(this.keys.C)) {
      this.rope.tryAttach(p, this.anchors);
    }
    this.rope.update(p);
    this.drawRope();

    // punto seguro para respawn tras pozo (suelo firme)
    if (p.body.blocked.down) this.lastSafe = { x: p.x, y: p.y - 4 };

    // caída al pozo: 1 hoja + respawn (supuesto; GDD solo dice que hay pozos)
    if (p.y > 660) {
      this.rope.detach(this.player);
      p.setPosition(this.lastSafe.x, this.lastSafe.y);
      p.setVelocity(0, 0);
      this.invulnerableUntil = 0;
      this.hurtPlayer();
      this.invulnerableUntil = this.time.now + 1000;
    }

    this.resolveTongueCaptures(time);
    for (const e of this.enemies) e.update(time, delta, p);
    for (const f of this.flies) f.update(time, delta, p);
  }

  // Dibujo de la cuerda (mockup: línea rosa).
  drawRope() {
    this.ropeView.clear();
    const r = this.rope.line(this.player);
    if (!r) return;
    this.ropeView.lineStyle(4, 0xff6b9d, 0.9);
    this.ropeView.beginPath();
    this.ropeView.moveTo(r.x0, r.y0);
    this.ropeView.lineTo(r.x1, r.y1);
    this.ropeView.strokePath();
  }
}
