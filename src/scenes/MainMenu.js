import Phaser from 'phaser';
import { progression } from '../domain/Progression.js';
import { EN, ES } from '../enums/languages.js';
import { FETCHED, FETCHING, READY, TODO } from '../enums/status.js';
import { KEYS } from '../enums/keys.js';
import { getLanguageConfig, getPhrase, getTranslations } from '../services/translations.js';

// Menú principal: título + botón "Jugar". Al iniciar se resetea la
// progresión (3 hojas, 0 puntos, nivel 0) y se lanza la escena Game.
export default class MainMenu extends Phaser.Scene {
  #levelText = null;
  #playText = null;
  #hintText = null;
  #wasChangedLanguage = TODO;
  #language = ES;

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

    this.#levelText = this.add.text(width / 2, height * 0.42, getPhrase(KEYS.NIVEL_1_PANTANO), {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ecf0f1',
    }).setOrigin(0.5);

    // Botón "Jugar".
    const btn = this.add.text(width / 2, height * 0.60, '▶  ' + getPhrase(KEYS.JUGAR), {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#27ae60',
      padding: { x: 28, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.#playText = btn;

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
    this.#hintText = this.add.text(width / 2, height * 0.82,
      getPhrase(KEYS.FLECHAS_WASD_MOVER_Y_SALTAR) + '   ' +
      getPhrase(KEYS.X_CLIC_LENGUA) + '   ' +
      getPhrase(KEYS.C_CUERDA) + '   ' +
      getPhrase(KEYS.R_REINICIAR),
      { fontFamily: 'monospace', fontSize: '13px', color: '#bdc3c7', align: 'center' }
    ).setOrigin(0.5);

    // Selector de idioma (Traducila): ES/EN, actualiza textos en vivo.
    this.#language = getLanguageConfig();
    const makeLangButton = (x, label, lang) => {
      const b = this.add.rectangle(x, height * 0.12, 110, 34, 0x2c3e50)
        .setStrokeStyle(2, 0x2ecc71)
        .setInteractive({ useHandCursor: true });
      this.add.text(b.x, b.y, label, {
        fontFamily: 'monospace', fontSize: '14px', color: '#ffffff',
      }).setOrigin(0.5);
      b.on('pointerdown', () => this.changeLanguage(lang));
      return b;
    };
    makeLangButton(width * 0.12, 'Español', ES);
    makeLangButton(width * 0.30, 'English', EN);

    // Enter / Espacio también inician.
    this.input.keyboard.on('keydown-ENTER', () => this.startGame());
    this.input.keyboard.on('keydown-SPACE', () => this.startGame());
  }

  async changeLanguage(lang) {
    this.#language = lang;
    this.#wasChangedLanguage = FETCHING;
    await getTranslations(lang, () => { this.#wasChangedLanguage = FETCHED; });
  }

  update() {
    if (this.#wasChangedLanguage === FETCHED) {
      this.#wasChangedLanguage = READY;
      if (this.#levelText) this.#levelText.setText(getPhrase(KEYS.NIVEL_1_PANTANO));
      if (this.#playText) this.#playText.setText('▶  ' + getPhrase(KEYS.JUGAR));
      if (this.#hintText) {
        this.#hintText.setText(
          getPhrase(KEYS.FLECHAS_WASD_MOVER_Y_SALTAR) + '   ' +
          getPhrase(KEYS.X_CLIC_LENGUA) + '   ' +
          getPhrase(KEYS.C_CUERDA) + '   ' +
          getPhrase(KEYS.R_REINICIAR)
        );
      }
    }
  }

  startGame() {
    progression.reset();
    this.scene.start('Game');
  }
}
