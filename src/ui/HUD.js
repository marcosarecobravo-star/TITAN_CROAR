// HUD de hojas y puntos. Patrón Observer: se suscribe a Health ('changed')
// y a Score ('changed'). Supuesto: mariposa +25, 100 pts = 1 hoja.
export default class HUD {
  constructor(scene, health, score = null) {
    this.scene = scene;
    this.text = scene.add.text(12, 10, '', {
      fontSize: '20px',
      color: '#b6ff7a',
    }).setScrollFactor(0).setDepth(10);
    this.scoreText = scene.add.text(12, 36, '', {
      fontSize: '16px',
      color: '#ffe66d',
    }).setScrollFactor(0).setDepth(10);
    this.score = score;
    this.update(health.lives);
    this.updateScore(score?.points ?? 0);
    health.on('changed', (lives) => this.update(lives));
    score?.on('changed', (pts) => this.updateScore(pts));
  }

  update(lives) {
    this.text.setText(`Hojas: ${'🍃'.repeat(Math.max(0, lives)) || '—'}`);
  }

  updateScore(pts) {
    this.scoreText.setText(`Puntos: ${pts} (100 = 🍃)`);
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
