import Phaser from 'phaser';

// Dominio: puntos y vida extra.
// GDD Mecánica (parcial): "puntos que al llegar a 100 le dará una vida más"
// + "mariposas que al pasar sobre ellas sumarán puntos". Sin valores por
// pickup -> supuesto documentado: mariposa = +25, umbral 100 = 1 hoja.
// Emite 'changed' (Observer) y 'extra-life' al cruzar cada umbral.
export default class Score extends Phaser.Events.EventEmitter {
  constructor({ threshold = 100 } = {}) {
    super();
    this.points = 0;
    this.threshold = threshold;
    this.nextAt = threshold;
  }

  add(n) {
    this.points += n;
    this.emit('changed', this.points);
    let extraLives = 0;
    while (this.points >= this.nextAt) {
      extraLives += 1;
      this.nextAt += this.threshold;
    }
    if (extraLives > 0) this.emit('extra-life', extraLives);
    return this.points;
  }
}
