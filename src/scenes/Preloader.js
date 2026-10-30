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
    // Fondo del Nivel 1: PNG existente (decisión del usuario). Copiado a
    // public/ para que Vite lo sirva también en build (assets/ no se copia).
    this.load.image('bgPantano', 'Pantano%20Titan%20Croar.png');
    // Sprites reales del jugador y enemigos (decisión del usuario):
    // rana.png (assets/RANA TITAN CROAR1.png), cangrejo.png
    // (assets/Cangrejo acorazado.png), erizo.png (assets/PUERCO ESPÍN.png).
    // Copiados a public/ con nombre ASCII. Si la carga falla, los mockups de
    // create() (que verifican textures.exists) siguen como respaldo.
    this.load.image('player', 'rana.png');
    this.load.image('crab', 'cangrejo.png');
    this.load.image('hedgehog', 'erizo.png');
    this.load.image('wasp', 'avispa.png');
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
    // Mockup provisional mariposa (GDD: suman puntos al pasar). Sin sprite
    // externo: mockup mínimo pendiente de recurso real.
    make(this, 'butterfly', 24, 18, (g) => {
      g.fillStyle(0xf368e0, 1).fillEllipse(7, 9, 12, 14).fillEllipse(17, 9, 12, 14);
      g.fillStyle(0x222222, 1).fillRect(11, 2, 2, 14);
    });
    // Mockup provisional mosca inofensiva (GDD Mecánica, captura con lengua).
    make(this, 'fly', 20, 16, (g) => {
      g.fillStyle(0xdfe6e9, 0.95).fillEllipse(6, 5, 10, 7).fillEllipse(14, 5, 10, 7);
      g.fillStyle(0x2d3436, 1).fillEllipse(10, 10, 12, 9);
    });
    // Mockup provisional tronco (GDD Obstáculos: "Se interpone en el camino";
    // sólido y saltable, sin daño — decisión del usuario).
    make(this, 'log', 72, 24, (g) => {
      g.fillStyle(0x6d4c41, 1).fillRoundedRect(0, 2, 72, 20, 10);
      g.fillStyle(0x8d6e63, 1).fillCircle(8, 12, 7).fillCircle(64, 12, 7);
      g.fillStyle(0x5d4037, 1).fillCircle(8, 12, 3).fillCircle(64, 12, 3);
    });
    // Mockup provisional ancla de la lengua-cuerda (GDD Mecánica: balancearse
    // con la lengua como cuerda; enganche a anclas fijas — decisión usuario).
    make(this, 'anchor', 16, 16, (g) => {
      g.fillStyle(0xffe66d, 1).fillCircle(8, 8, 7);
      g.fillStyle(0x2d3436, 1).fillCircle(8, 8, 3);
    });
    // Mockup provisional arena movediza (GDD Obstáculos: "Barro o Arena
    // movediza: Reduce la velocidad temporalmente"; Nivel 2 Desierto).
    make(this, 'sand', 64, 16, (g) => {
      g.fillStyle(0xe0c083, 0.9).fillRect(0, 0, 64, 16);
      g.fillStyle(0xc9a86a, 1).fillCircle(12, 8, 3).fillCircle(34, 9, 4).fillCircle(52, 6, 3);
    });
    // Mockup provisional águila jefe (GDD Enemigos: jefe del último nivel;
    // carga, plumas y ataques aéreos; varios golpes para derrotarla).
    make(this, 'eagle', 56, 40, (g) => {
      g.fillStyle(0x5d4037, 1).fillEllipse(28, 22, 34, 22);
      g.fillStyle(0x795548, 1).fillTriangle(2, 14, 24, 20, 20, 6).fillTriangle(54, 14, 32, 20, 36, 6);
      g.fillStyle(0xf5f0e1, 1).fillCircle(44, 12, 7);
      g.fillStyle(0xf39c12, 1).fillTriangle(50, 12, 56, 14, 50, 16);
      g.fillStyle(0x000000, 1).fillCircle(45, 11, 2);
    });
    // Mockup provisional pluma afilada (GDD Enemigos: águila "lanzar plumas
    // afiladas").
    make(this, 'feather', 8, 18, (g) => {
      g.fillStyle(0xf5f0e1, 1).fillEllipse(4, 9, 7, 16);
      g.fillStyle(0xb0a890, 1).fillRect(3, 2, 2, 14);
    });
    // Fondo del Nivel 1 (bgPantano): se carga en preload() desde public/.
    this.scene.start('MainMenu');
  }
}
