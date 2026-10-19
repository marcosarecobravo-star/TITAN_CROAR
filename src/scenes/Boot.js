import Phaser from 'phaser';

function makeTextures(scene) {
  const g = scene.add.graphics();
  const gen = (key, w, h, draw) => {
    if (scene.textures.exists(key)) return;
    g.clear();
    draw(g, w, h);
    g.generateTexture(key, w, h);
  };
  // Mockups provisionales (no son sprites finales). El jugador, el cangrejo
  // y el erizo se cargan como imagen real en Preloader (rana.png,
  // cangrejo.png, erizo.png) con mockups de respaldo en Preloader.make.
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
