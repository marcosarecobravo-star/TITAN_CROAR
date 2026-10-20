import Phaser from 'phaser';

// Dominio: puntos y vida extra.
// GDD Mecánica: "puntos que al llegar a 100 le dará una vida más y el
// puntaje vuelve a 0". Emite 'changed' (Observer) y 'extra-life' al cruzar
// cada umbral. Supuestos documentados: mariposa +25, avispa +50, mosca +10,
// umbral 100 = 1 hoja.
export default class Score extends Phaser.Events.EventEmitter {
  constructor({ threshold = 100 } = {}) {
    super();
    this.points = 0;
    this.threshold = threshold;
  }

  add(n) {
    this.points += n;
    let extraLives = 0;
    // GDD: al llegar a 100 gana 1 hoja y el puntaje vuelve a 0.
    while (this.points >= this.threshold) {
      this.points -= this.threshold;
      extraLives += 1;
    }
    this.emit('changed', this.points);
    if (extraLives > 0) this.emit('extra-life', extraLives);
    return this.points;
  }
}
