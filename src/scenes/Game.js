import Phaser from 'phaser';
import Health from '../domain/Health.js';
import Score from '../domain/Score.js';
import Tongue, { TONGUE, POINTS } from '../entities/Tongue.js';
import EntityFactory from '../domain/EntityFactory.js';
import HUD from '../ui/HUD.js';
import { LEVEL1 } from '../levels/level1.js';

// Scene orquestadora (AGENTS.md §5): las reglas viven en Health/Enemigos/
// Factory; aquí solo se cablean física, colisiones y cámara.
// Supuestos documentados (GDD no los define): 3 hojas, 1 golpe = 1 hoja,
// invencibilidad 1 s, pozo = 1 hoja + respawn, cangrejo 2 pisotones,
// erizo inmune, avispa 1 pisotón, barro x0.5 velocidad, mariposa +25 y
// 100 pts = 1 hoja (tope max). Lengua-captura (acordado): X/clic, alcance
// 90 px, activa 150 ms, cooldown 600 ms; avispa +50, mosca +10.
const SPEED = 220;
const JUMP = -520;
const BOUNCE_AFTER_STOMP = -350;

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.won = false;
    this.over = false;
    this.invulnerableUntil = 0;
    this.lastSafe = { ...LEVEL1.spawn };

    this.physics.world.setBounds(0, 0, LEVEL1.worldWidth, 600);
    // Sin colisión inferior: el pozo debe dejar caer al jugador.
    this.physics.world.setBoundsCollision(true, true, true, false);
    this.cameras.main.setBounds(0, 0, LEVEL1.worldWidth, 600);

    this.health = new Health(3);
    this.score = new Score({ threshold: 100 });
    this.score.on('extra-life', (n) => {
      for (let i = 0; i < n; i += 1) this.health.heal(1);
    });
    this.hud = new HUD(this, this.health, this.score);
    this.add.text(12, 34, 'Nivel 1 — llega a la bandera | X/clic: lengua', {
      fontSize: '13px', color: '#aaaaaa',
    }).setScrollFactor(0).setDepth(10);
    this.health.on('changed', (lives) => {
      if (lives <= 0 && !this.over) this.lose();
    });

    // --- Terreno sólido ---
    this.solids = this.physics.add.staticGroup();
    for (const g of LEVEL1.grounds) {
      EntityFactory.createStaticRect(this, this.solids, g.x + g.w / 2, g.y, 'tile', g.w, 32);
    }
    for (const p of LEVEL1.platforms) {
      EntityFactory.createStaticRect(this, this.solids, p.x + p.w / 2, p.y, 'tile', p.w, 24);
    }
    this.cacti = this.physics.add.staticGroup();
    for (const c of LEVEL1.cacti) {
      EntityFactory.createStaticRect(this, this.cacti, c.x, c.y, 'cactus', c.w, c.h);
    }

    // --- Zonas y detalles ---
    this.spikes = this.physics.add.staticGroup();
    for (const s of LEVEL1.spikes) this.spikes.create(s.x, s.y, 'spike');
    this.muds = this.physics.add.staticGroup();
    for (const m of LEVEL1.muds) {
      EntityFactory.createStaticRect(this, this.muds, m.x + m.w / 2, m.y, 'mud', m.w, 16);
    }
    this.goal = this.physics.add.staticGroup().create(LEVEL1.goal.x, LEVEL1.goal.y, 'goal');
    // Mariposas: al pasar sobre ellas suman puntos (GDD Mecánica).
    this.butterflies = this.physics.add.staticGroup();
    for (const b of LEVEL1.butterflies ?? []) this.butterflies.create(b.x, b.y, 'butterfly');

    // --- Jugador (sapo gigante, mockup) ---
    this.player = this.physics.add.sprite(LEVEL1.spawn.x, LEVEL1.spawn.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(30, 46);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    // --- Lengua-captura (mockup: rectángulo temporal, sin sprites externos) ---
    this.facing = 1;
    this.tongue = new Tongue();
    this.tongueView = this.add.rectangle(-100, -100, TONGUE.RANGE, 10, 0xff6b9d)
      .setVisible(false)
      .setDepth(5);

    // --- Enemigos vía Factory (las moscas son inofensivas: sin colisión) ---
    const spawned = EntityFactory.createEnemies(this, LEVEL1);
    this.enemies = spawned.filter((e) => e.texture.key !== 'fly');
    this.flies = spawned.filter((e) => e.texture.key === 'fly');
    for (const e of this.enemies) {
      this.physics.add.collider(e, this.solids);
      this.physics.add.collider(e, this.cacti);
    }

    // --- Colisiones ---
    this.physics.add.collider(this.player, this.solids);
    this.physics.add.collider(this.player, this.cacti, () => this.hurtPlayer());
    this.physics.add.collider(this.player, this.enemies, (p, e) => this.onPlayerEnemy(e));
    this.physics.add.overlap(this.player, this.spikes, () => this.hurtPlayer());
    this.physics.add.overlap(this.player, this.goal, () => this.win());
    this.physics.add.overlap(this.player, this.butterflies, (p, b) => {
      if (!b.active) return;
      b.disableBody(true, true);
      this.score.add(25);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,R,X');
    this.input.keyboard.on('keydown-R', () => this.scene.restart());
    this.input.on('pointerdown', (pointer) => {
      if (this.won || this.over) return;
      const wx = pointer.worldX ?? pointer.x;
      this.fireTongue(wx >= this.player.x ? 1 : -1);
    });
  }

  onPlayerEnemy(enemy) {
    if (this.won || this.over || enemy.dead) return;
    if (enemy.texture.key === 'fly') return; // mosca inofensiva al contacto
    const falling = (this.player.body.velocity.y ?? 0) > 60;
    const playerBottom = this.player.body.bottom;
    const enemyTop = enemy.body.top;
    const fromAbove = falling && playerBottom - enemyTop < 22;

    if (fromAbove) {
      // Erizo inmune (GDD): el pisotón daña al jugador, no al enemigo.
      if (enemy.texture.key === 'hedgehog') {
        this.hurtPlayer();
        return;
      }
      enemy.stomp();
      this.player.setVelocityY(BOUNCE_AFTER_STOMP);
    } else {
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
    if (!this.tongue.fire(this.time.now, dir)) return;
    const r = this.tongue.rect(this.player.x, this.player.y, this.player.displayWidth / 2);
    this.tongueView.setPosition((r.x0 + r.x1) / 2, r.y).setVisible(true);
  }

  resolveTongueCaptures(now) {
    if (!this.tongue.isActive(now)) {
      this.tongueView.setVisible(false);
      return;
    }
    const px = this.player.x;
    const py = this.player.y;
    const halfW = this.player.displayWidth / 2;
    // GDD: la lengua atrapa avispas y moscas (no cangrejo/erizo).
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

  win() {
    if (this.won || this.over) return;
    this.won = true;
    this.player.setVelocity(0, 0);
    this.player.body.setAllowGravity(false);
    this.hud.message('¡Nivel superado!', 'Presioná R para reintentar');
  }

  lose() {
    if (this.over) return;
    this.over = true;
    this.player.setVelocity(0, 0);
    this.player.setTint(0xff0000);
    this.hud.message('Sin hojas — derrotado', 'Presioná R para empezar desde 0');
  }

  update(time, delta) {
    if (this.won || this.over) return;
    const p = this.player;
    const inMud = this.physics.overlap(p, this.muds);
    const speed = inMud ? SPEED * 0.5 : SPEED;

    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const jump = this.cursors.up.isDown || this.keys.W.isDown || this.cursors.space?.isDown;

    if (left && !right) { p.setVelocityX(-speed); this.facing = -1; }
    else if (right && !left) { p.setVelocityX(speed); this.facing = 1; }
    else p.setVelocityX(0);

    if (jump && p.body.blocked.down) p.setVelocityY(JUMP);
    if (Phaser.Input.Keyboard.JustDown(this.keys.X)) this.fireTongue(this.facing);

    // punto seguro para respawn tras pozo (suelo firme)
    if (p.body.blocked.down) this.lastSafe = { x: p.x, y: p.y - 4 };

    // caída al pozo: 1 hoja + respawn (supuesto; GDD solo dice que hay pozos)
    if (p.y > 660) {
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
}
