// HUD de hojas, puntos y temporizador. Patrón Observer: se suscribe a
// Health ('changed') y a Score ('changed'). Supuesto: mariposa +25, 100 pts = 1 hoja.
export default class HUD {
  constructor(scene, health, score = null, timeLimit = 180) {
    this.scene = scene;
    const { width } = scene.cameras.main;
    // Hojas: una sola hoja + cantidad al lado (Hoja xN).
    this.livesText = scene.add.text(12, 10, '', {
      fontSize: '20px', color: '#b6ff7a',
    }).setScrollFactor(0).setDepth(10);
    // Puntos.
    this.scoreText = scene.add.text(12, 36, '', {
      fontSize: '16px', color: '#ffe66d',
    }).setScrollFactor(0).setDepth(10);
    // Temporizador arriba a la derecha.
    this.timerText = scene.add.text(width - 12, 10, '', {
      fontSize: '20px', color: '#ffffff',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(10);
    this.score = score;
    this.update(health.lives);
    this.updateScore(score?.points ?? 0);
    this.updateTimer(timeLimit);
    health.on('changed', (lives) => this.update(lives));
    score?.on('changed', (pts) => this.updateScore(pts));
  }

  update(lives) {
    this.livesText.setText(`🍃 x${Math.max(0, lives)}`);
  }

  updateScore(pts) {
    this.scoreText.setText(`Puntos: ${pts}`);
  }

  updateTimer(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    this.timerText.setText(`⏱ ${m}:${r.toString().padStart(2, '0')}`);
    // Aviso visual cuando queda poco tiempo.
    this.timerText.setColor(s <= 30 ? '#e74c3c' : '#ffffff');
  }

  message(main, sub = '') {
    const { width } = this.scene.cameras.main;
    this.scene.add.text(width / 2, 180, main, {
      fontSize: '34px', color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
    if (sub) {
      this.scene.add.text(width / 2, 220, sub, {
        fontSize: '16px', color: '#dddddd',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
    }
  }
}
