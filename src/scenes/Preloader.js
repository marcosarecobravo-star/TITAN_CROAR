import Phaser from 'phaser';

// Mockups provisionales (AGENTS.md §7): rectángulos de colores, sin assets
// externos. Alcance visual mínimo para validar funcionalidad.
function make(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  draw(g, w, h);
  g.generateTexture(key, w, h);
  g.destroy();
}

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    const { width, height } = this.cameras.main;
    const bar = this.add.graphics();
    this.load.on('progress', (p) => {
      bar.clear();
      bar.fillStyle(0xffffff, 1);
      bar.fillRect(width / 2 - 160, height / 2 - 10, 320 * p, 20);
    });
  }

  create() {
    make(this, 'player', 32, 48, (g) => {
      g.fillStyle(0x2ecc71, 1).fillRect(0, 0, 32, 48);
      g.fillStyle(0x27ae60, 1).fillRect(0, 34, 32, 14);
      g.fillStyle(0xffffff, 1).fillCircle(10, 14, 5).fillCircle(22, 14, 5);
      g.fillStyle(0x000000, 1).fillCircle(10, 14, 2).fillCircle(22, 14, 2);
    });
    make(this, 'crab', 40, 28, (g) => {
      g.fillStyle(0xe74c3c, 1).fillRect(0, 6, 40, 22);
      g.fillStyle(0x922b21, 1).fillRect(0, 6, 40, 6);
      g.fillStyle(0x922b21, 1).fillCircle(8, 4, 5).fillCircle(32, 4, 5);
    });
    make(this, 'hedgehog', 40, 28, (g) => {
      g.fillStyle(0x5d6d7e, 1).fillRect(0, 10, 40, 18);
      g.fillStyle(0xeaecee, 1);
      for (let x = 2; x < 40; x += 6) g.fillTriangle(x, 10, x + 3, 0, x + 6, 10);
    });
    make(this, 'wasp', 30, 24, (g) => {
      g.fillStyle(0xf1c40f, 1).fillEllipse(15, 14, 26, 16);
      g.fillStyle(0x000000, 1).fillRect(10, 7, 4, 14).fillRect(18, 7, 4, 14);
      g.fillStyle(0xd6dbdf, 0.9).fillEllipse(9, 6, 12, 8).fillEllipse(21, 6, 12, 8);
    });
    make(this, 'tile', 64, 32, (g) => {
      g.fillStyle(0x8d6e63, 1).fillRect(0, 0, 64, 32);
      g.fillStyle(0x6d4c41, 1).fillRect(0, 0, 64, 8);
    });
    make(this, 'spike', 32, 24, (g) => {
      g.fillStyle(0xbdc3c7, 1);
      g.fillTriangle(0, 24, 8, 0, 16, 24);
      g.fillTriangle(16, 24, 24, 0, 32, 24);
    });
    make(this, 'mud', 64, 16, (g) => {
      g.fillStyle(0x6e5100, 0.85).fillRect(0, 0, 64, 16);
      g.fillStyle(0x4e3900, 1).fillCircle(14, 8, 4).fillCircle(36, 9, 5).fillCircle(52, 7, 3);
    });
    make(this, 'cactus', 32, 64, (g) => {
      g.fillStyle(0x229954, 1).fillRect(11, 0, 10, 64);
      g.fillRect(0, 20, 12, 8).fillRect(20, 32, 12, 8);
      g.fillStyle(0x1e8449, 1).fillRect(11, 0, 4, 64);
    });
    make(this, 'goal', 24, 48, (g) => {
      g.fillStyle(0x7b7d7d, 1).fillRect(3, 0, 4, 48);
      g.fillStyle(0xf4d03f, 1).fillRect(7, 2, 17, 12);
    });
    this.scene.start('Game');
  }
}
