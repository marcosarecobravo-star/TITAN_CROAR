import Phaser from 'phaser';

// Base enemigo. Patrón Strategy: cada subclase implementa updateBehaviour()
// (patrulla, flotar+abalanzarse). Patrón Template Method: update() fija el
// esqueleto (si está muerto no actúa) y delega el movimiento.
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, opts = {}) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.hp = opts.hp ?? 1;
    this.patrolMin = opts.patrolMin ?? x;
    this.patrolMax = opts.patrolMax ?? x;
    this.patrolSpeed = opts.speed ?? 50;
    this.dir = 1;
    this.dead = false;
    this.setCollideWorldBounds(false);

    // Anti-pozo (GDD Enemigos: el cangrejo "no caerán a un agujero donde
    // podrían morir"; decisión usuario: también el erizo). El umbral de suelo
    // se deriva del nivel (top del primer tramo de suelo) en vez de un
    // número mágico del layout.
    this.avoidPits = opts.avoidPits ?? false;
    this.groundY = opts.groundY ?? (scene.level?.grounds?.[0]?.y ?? 560);
  }

  update(...args) {
    if (this.dead || !this.body) return;
    this.updateBehaviour(...args);
    // Voltear sprite según la dirección real de movimiento (equivalente al
    // flip de la rana): patrulla (dir) o velocidad horizontal (picada).
    const vx = this.body.velocity.x;
    if (vx !== 0) this.setFlipX(vx < 0);
    else this.setFlipX(this.dir < 0);
  }

  // eslint-disable-next-line no-unused-vars
  updateBehaviour(time, delta, player) {
    // Anti-pozo: a ras de cualquier sólido (suelo o plataforma), si justo por
    // delante no hay sólido, gira. Se aplica a cangrejo y erizo (avoidPits).
    // Se quitó la restricción de altura (groundY) para que los enemigos que
    // patrullan plataformas también eviten caerse de ellas.
    if (
      this.avoidPits && this.body?.blocked.down && this.pitAhead()
    ) {
      this.dir *= -1;
    }
    // patrulla horizontal por defecto
    this.setVelocityX(this.patrolSpeed * this.dir);
    if (this.x <= this.patrolMin) this.dir = 1;
    if (this.x >= this.patrolMax) this.dir = -1;
  }

  // ¿Hay un hueco (pozo) justo delante del enemigo? Comprueba si algún
  // sólido del nivel cubre la columna situada a 'probe' px en su dirección.
  pitAhead(probe = 26) {
    const solids = this.scene.solids?.getChildren?.() ?? [];
    if (solids.length === 0) return false;
    const aheadX = this.x + this.dir * probe;
    // Solo cuenta un sólido si está a la altura del enemigo (evita que el
    // suelo lejano "tape" el hueco al borde de una plataforma).
    return !solids.some((s) =>
      Math.abs(s.x - aheadX) < s.displayWidth / 2 &&
      Math.abs(s.y - this.y) < 40
    );
  }

  // Devuelve true si el enemigo murió con este pisotón.
  stomp() {    if (this.dead) return false;
    this.hp -= 1;
    if (this.hp <= 0) {
      this.dead = true;
      this.disableBody(true, true);
      this.scene.events.emit('enemy-killed', this);
      return true;
    }
    // feedback del primer golpe (cangrejo): parpadeo corto
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 90,
      yoyo: true,
      repeat: 3,
      onComplete: () => this.setAlpha(1),
    });
    return false;
  }

  // Captura con lengua (GDD Mecánica: avispas y moscas). Mata sin importar
  // el hp; no aplica a cangrejo/erizo (la Scene no la usa con ellos).
  capture() {
    if (this.dead) return false;
    this.dead = true;
    this.disableBody(true, true);
    this.scene.events.emit('enemy-killed', this);
    return true;
  }
}
