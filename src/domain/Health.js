import Phaser from 'phaser';

// Lógica de dominio: vidas-hojas.
// GDD (Derrota): "vidas representadas como hojas". No define cantidad ni
// recuperación -> supuesto documentado: 3 hojas, sin recuperación en el slice.
// Emite 'changed' (Observer) para que el HUD reaccione sin acoplarse a la Scene.
export default class Health extends Phaser.Events.EventEmitter {
  constructor(lives = 3) {
    super();
    this.maxLives = lives;
    this.lives = lives;
  }

  reset() {
    this.lives = this.maxLives;
    this.emit('changed', this.lives);
  }

  // Devuelve true si el daño mató al jugador.
  damage(amount = 1) {
    if (this.lives <= 0) return true;
    this.lives = Math.max(0, this.lives - amount);
    this.emit('changed', this.lives);
    return this.lives <= 0;
  }

  isDead() {
    return this.lives <= 0;
  }
}
