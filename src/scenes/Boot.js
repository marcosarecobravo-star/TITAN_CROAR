import Phaser from 'phaser';

function makeTextures(scene) {
  const g = scene.add.graphics();
  const gen = (key, w, h, draw) => {
    if (scene.textures.exists(key)) return;
    g.clear();
    draw(g, w, h);
    g.generateTexture(key, w, h);
  };
  // Mockups provisionales (no son sprites finales)
  gen('player', 32, 48, (g, w, h) => {
    g.fillStyle(0x2ecc71, 1); g.fillRect(0, 0, w, h);
    g.fillStyle(0xffffff, 1); g.fillCircle(10, 12, 5); g.fillCircle(22, 12, 5);
    g.fillStyle(0x000000, 1); g.fillCircle(10, 12, 2); g.fillCircle(22, 12, 2);
  });
  gen('crab', 40, 28, (g, w, h) => {
    g.fillStyle(0xe74c3c, 1); g.fillRoundedRect(0, 4, w, h - 4, 6);
    g.fillStyle(0xc0392b, 1); g.fillCircle(4, 8, 5); g.fillCircle(w - 4, 8, 5);
  });
  gen('hedgehog', 40, 32, (g, w, h) => {
    g.fillStyle(0x5d4037, 1); g.fillEllipse(w / 2, h / 2 + 4, w, h - 8);
    g.fillStyle(0x212121, 1);
    for (let x = 4; x < w; x += 7) g.fillTriangle(x, 12, x + 3, 0, x + 6, 12);
  });
  gen('spike', 32, 24, (g, w, h) => {
    g.fillStyle(0x95a5a6, 1);
    g.fillTriangle(0, h, 8, 0, 16, h);
    g.fillTriangle(8, h, 16, 0, 24, h);
    g.fillTriangle(16, h, 24, 0, 32, h);
  });
  gen('ground', 64, 40, (g, w, h) => {
    g.fillStyle(0x8d6e63, 1); g.fillRect(0, 0, w, h);
    g.fillStyle(0x7cb342, 1); g.fillRect(0, 0, w, 10);
  });
  gen('platform', 120, 20, (g, w, h) => {
    g.fillStyle(0x795548, 1); g.fillRoundedRect(0, 0, w, h, 4);
    g.fillStyle(0x7cb342, 1); g.fillRect(0, 0, w, 6);
  });
  gen('flag', 24, 48, (g, w, h) => {
    g.fillStyle(0x8d6e63, 1); g.fillRect(4, 0, 4, h);
    g.fillStyle(0xffeb3b, 1); g.fillTriangle(8, 2, 24, 10, 8, 20);
  });
  g.destroy();
}

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    makeTextures(this);
    this.scene.start('Preloader');
  }
}
