import Phaser from 'phaser';
import Enemy from './Enemy.js';

// GDD Enemigos: "Avispa gigante: se abalanza contra el jugador, siempre
// está en el aire... esta seguirá al jugador hasta que este acabe con ella
// o salga de su rango". Muerte por pisotón implementada (Game.onPlayerEnemy);
// captura con lengua: SOLO DISEÑO (GDD parcial: sin alcance/input/valores).
// Diseño futuro (no codificar): Tongue { alcance?, input?, capturaEnPicada? },
// Score { puntos }, Pickup { mosca/mariposa }. Supuesto: flota con seno y
// se abalanza en picada cuando el jugador pasa por debajo/en rango. 1 HP.
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
      // En picada: sigue al jugador en X mientras esté en rango; si sale de
      // rango aborta y recupera altura (GDD: sigue hasta matar o salir).
      if (player) {
        const dx = player.x - this.x;
        if (Math.abs(dx) > 240 || Math.abs(player.x - this.x) > (this.patrolMax - this.patrolMin) + 160) {
          this.diving = false;
          this.setVelocity(0, -160);
          this.scene.time.delayedCall(450, () => {
            if (!this.dead) this.setVelocity(0, 0);
          });
          return;
        }
        this.setVelocity(Phaser.Math.Clamp(dx * 2, -180, 180), 260);
      }
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
