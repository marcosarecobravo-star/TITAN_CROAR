import Phaser from 'phaser';
import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import MainMenu from './scenes/MainMenu.js';
import Game from './scenes/Game.js';

// Superficie de errores en pantalla (diagnóstico): si algo falla en runtime,
// se muestra el mensaje en el canvas en lugar de solo la consola del navegador.
function showError(msg) {
  try {
    const el = document.getElementById('game-container') || document.body;
    let box = document.getElementById('err-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'err-box';
      box.style.cssText = 'position:fixed;left:8px;top:8px;right:8px;padding:10px;background:#900;color:#fff;font-family:monospace;font-size:12px;z-index:9999;white-space:pre-wrap;max-height:60vh;overflow:auto;';
      el.appendChild(box);
    }
    box.textContent = String(msg);
  } catch (_) { /* noop */ }
  // eslint-disable-next-line no-console
  console.error(msg);
}
window.showError = showError;
window.addEventListener('error', (e) => showError(e?.error?.stack || e?.message || e));
window.addEventListener('unhandledrejection', (e) => showError(e?.reason?.stack || e?.reason || e));

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: [Boot, Preloader, MainMenu, Game]
};

new Phaser.Game(config);
