import Phaser from 'phaser';
import Enemy from './Enemy.js';

// GDD Enemigos: "Avispa gigante: se abalanza contra el jugador, siempre
// está en el aire". Supuesto: flota con seno y se abalanza en picada cuando
// el jugador pasa por debajo/en rango; luego regresa. 1 HP.
export default class Wasp extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'wasp', { hp: 1, ...opts });
    this.baseY = y;
    this.phase = Math.random() * Math.PI * 2;
    this.diving = false;
    this.setSize(28, 22);
    this.body.setAllowGravity(false);
  }

  updateBehaviour(time, delta, player) {
    const t = time / 1000;
    if (!this.diving) {
      // flotar: patrulla suave + seno
      this.x += Math.sin(t * 0.9 + this.phase) * (this.patrolSpeed * delta) / 1000;
      this.x = Phaser.Math.Clamp(this.x, this.patrolMin, this.patrolMax);
      this.y = this.baseY + Math.sin(t * 2 + this.phase) * 18;
      this.setVelocity(0, 0);
      if (player && Math.abs(player.x - this.x) < 130 && player.y > this.y) {
        this.diving = true;
        const dx = Phaser.Math.Clamp(player.x - this.x, -180, 180);
        this.setVelocity(dx * 1.6, 260);
      }
    } else {
      // en picada: si baja demasiado o pasa al jugador, recupera altura
      if (this.y > this.baseY + 190) {
        this.diving = false;
        this.setVelocity(0, -160);
        this.scene.time.delayedCall(450, () => {
          if (!this.dead) this.setVelocity(0, 0);
        });
      }
    }
  }
}
