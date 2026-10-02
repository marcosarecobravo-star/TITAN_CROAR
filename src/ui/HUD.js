// HUD de hojas. Patrón Observer: se suscribe a Health ('changed').
export default class HUD {
  constructor(scene, health) {
    this.scene = scene;
    this.text = scene.add.text(12, 10, '', {
      fontSize: '20px',
      color: '#b6ff7a',
    }).setScrollFactor(0).setDepth(10);
    this.update(health.lives);
    health.on('changed', (lives) => this.update(lives));
  }

  update(lives) {
    this.text.setText(`Hojas: ${'🍃'.repeat(Math.max(0, lives)) || '—'}`);
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
