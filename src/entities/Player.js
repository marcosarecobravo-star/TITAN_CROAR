import Phaser from 'phaser';
import Health from './Health.js';

const STATE = { IDLE: 'idle', RUN: 'run', JUMP: 'jump', HURT: 'hurt' };

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.health = new Health(3);
    this.state = STATE.IDLE;
    this.invulnUntil = 0;
    this.speed = 220;
    this.jumpVelocity = -520;

    this.setCollideWorldBounds(false);
    this.body.setSize(28, 44);
  }

  update(time, cursors) {
    if (!this.active) return;
    const body = this.body;
    const left = cursors.left.isDown;
    const right = cursors.right.isDown;
    const jump = Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(cursors.space);

    if (time < this.invulnUntil && this.state !== STATE.HURT) {
      // parpadeo durante invulnerabilidad (mockup)
      this.setAlpha(Math.floor(time / 100) % 2 === 0 ? 0.4 : 1);
    } else if (this.state !== STATE.HURT) {
      this.setAlpha(1);
    }

    if (this.state === STATE.HURT && body.blocked.down && time >= this.invulnUntil - 700) {
      this.state = body.velocity.x !== 0 ? STATE.RUN : STATE.IDLE;
    }

    if (this.state !== STATE.HURT) {
      if (left && !right) body.setVelocityX(-this.speed);
      else if (right && !left) body.setVelocityX(this.speed);
      else body.setVelocityX(0);

      if (jump && body.blocked.down) {
        body.setVelocityY(this.jumpVelocity);
      }
      this.setFlipX(body.velocity.x < 0);
    }

    if (!body.blocked.down) this.state = this.state === STATE.HURT ? STATE.HURT : STATE.JUMP;
    else if (this.state !== STATE.HURT) this.state = body.velocity.x !== 0 ? STATE.RUN : STATE.IDLE;
  }

  isStomping(enemy) {
    return (
      this.body.velocity.y > 80 &&
      this.y + this.displayHeight / 2 < enemy.y + enemy.displayHeight * 0.35
    );
  }

  stompBounce() {
    this.body.setVelocityY(this.jumpVelocity * 0.65);
  }

  takeDamage(scene, time) {
    if (time < this.invulnUntil || !this.health.alive) return false;
    this.health.damage(1);
    this.invulnUntil = time + 1000;
    this.state = STATE.HURT;
    scene.events.emit('health-changed', this.health.current);
    if (!this.health.alive) scene.events.emit('player-died');
    return true;
  }
}
