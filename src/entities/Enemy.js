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
  }

  update(...args) {
    if (this.dead || !this.body) return;
    this.updateBehaviour(...args);
  }

  // eslint-disable-next-line no-unused-vars
  updateBehaviour(time, delta, player) {
    // patrulla horizontal por defecto
    this.setVelocityX(this.patrolSpeed * this.dir);
    if (this.x <= this.patrolMin) this.dir = 1;
    if (this.x >= this.patrolMax) this.dir = -1;
  }

  // Devuelve true si el enemigo murió con este pisotón.
  stomp() {
    if (this.dead) return false;
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
}
