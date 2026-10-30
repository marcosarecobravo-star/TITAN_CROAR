// HUD de hojas, puntos e insectos-moneda. Patron Observer: se suscribe a
// Health ('changed') y a Score ('changed'). GDD §8/§14: mosca 5, avispa 15,
// mariposa 5; 100 = 1 vida extra.
export default class HUD {
  constructor(scene, health, score = null, timeLimit = 180) {
    this.scene = scene;
    const { width, height } = scene.cameras.main;
    this.livesText = scene.add.text(12, 10, '', {
      fontSize: '20px', color: '#b6ff7a',
    }).setScrollFactor(0).setDepth(10);
    this.scoreText = scene.add.text(12, 36, '', {
      fontSize: '16px', color: '#ffe66d',
    }).setScrollFactor(0).setDepth(10);
    this.timerText = scene.add.text(width - 12, 10, '', {
      fontSize: '20px', color: '#ffffff',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(10);
    // Barra del jefe (solo nivel 3, GDD §14).
    this.bossBarBg = scene.add.rectangle(width / 2, height - 24, 240, 14, 0x333333)
      .setScrollFactor(0).setDepth(10).setVisible(false);
    this.bossBar = scene.add.rectangle(width / 2 - 120, height - 24, 240, 14, 0xe74c3c)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(11).setVisible(false);
    this.bossLabel = scene.add.text(width / 2, height - 42, 'JEFE', {
      fontSize: '12px', color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10).setVisible(false);
    this.score = score;
    this.update(health.lives);
    this.updateScore(score?.points ?? 0);
    this.updateTimer(timeLimit);
    health.on('changed', (lives) => this.update(lives));
    score?.on('changed', (pts) => this.updateScore(pts));
  }

  update(lives) {
    this.livesText.setText(`\u{1F343} x${Math.max(0, lives)}`);
  }

  updateScore(pts) {
    this.scoreText.setText(`Insectos: ${pts}/100`);
  }

  updateTimer(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    this.timerText.setText(`\u23F1 ${m}:${r.toString().padStart(2, '0')}`);
    this.timerText.setColor(s <= 30 ? '#e74c3c' : '#ffffff');
  }

  updateBossHp(hp, maxHp) {
    if (hp == null) {
      this.bossBarBg.setVisible(false);
      this.bossBar.setVisible(false);
      this.bossLabel.setVisible(false);
      return;
    }
    const ratio = Math.max(0, hp / (maxHp || 1));
    this.bossBarBg.setVisible(true);
    this.bossBar.setVisible(true);
    this.bossLabel.setVisible(true);
    this.bossBar.width = 240 * ratio;
    this.bossBar.fillColor = ratio > 0.5 ? 0xe74c3c : (ratio > 0.25 ? 0xe67e22 : 0xc0392b);
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
