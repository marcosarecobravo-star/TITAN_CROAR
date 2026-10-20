import Phaser from 'phaser';
import { progression } from '../domain/Progression.js';

// Menú principal: título + botón "Jugar". Al iniciar se resetea la
// progresión (3 hojas, 0 puntos, nivel 0) y se lanza la escena Game.
export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fondo del pantano (mismo recurso que el Nivel 1).
    if (this.textures.exists('bgPantano')) {
      this.add.image(width / 2, height / 2, 'bgPantano')
        .setDisplaySize(width, height);
    } else {
      this.cameras.main.setBackgroundColor('#1a3a2e');
    }

    // Oscurecer un poco para legibilidad del texto.
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.35);

    // Título.
    const title = this.add.text(width / 2, height * 0.30, 'TITAN CROAR', {
      fontFamily: 'monospace',
      fontSize: '56px',
      color: '#2ecc71',
      stroke: '#0b3d1f',
      strokeThickness: 6,
    }).setOrigin(0.5);
    this.tweens.add({
      targets: title, y: height * 0.30 - 6,
      duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this.add.text(width / 2, height * 0.42, 'NIVEL 1: PANTANO', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ecf0f1',
    }).setOrigin(0.5);

    // Botón "Jugar".
    const btn = this.add.text(width / 2, height * 0.60, '▶  JUGAR', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#27ae60',
      padding: { x: 28, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      btn.setStyle({ color: '#f1c40f' });
      this.tweens.add({ targets: btn, scale: 1.08, duration: 120, yoyo: false });
    });
    btn.on('pointerout', () => {
      btn.setStyle({ color: '#ffffff' });
      this.tweens.add({ targets: btn, scale: 1.0, duration: 120, yoyo: false });
    });
    btn.on('pointerdown', () => this.startGame());

    // Hint de controles.
    this.add.text(width / 2, height * 0.82,
      'Flechas/WASD: mover y saltar   X/Clic: lengua   C: cuerda   R: reiniciar',
      { fontFamily: 'monospace', fontSize: '13px', color: '#bdc3c7', align: 'center' }
    ).setOrigin(0.5);

    // Enter / Espacio también inician.
    this.input.keyboard.on('keydown-ENTER', () => this.startGame());
    this.input.keyboard.on('keydown-SPACE', () => this.startGame());
  }

  startGame() {
    progression.reset();
    this.scene.start('Game');
  }
}
