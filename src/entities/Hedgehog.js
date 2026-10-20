import Enemy from './Enemy.js';

// GDD Enemigos: "Erizos gigantes: no pueden ser derrotados" y decisión del
// usuario: tampoco caerán a los pozos (mismo anti-pozo que el cangrejo).
// stomp() queda bloqueado: el pisotón NO le hace daño (la Scene daña al
// jugador en su lugar).
export default class Hedgehog extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'hedgehog', { hp: Infinity, avoidPits: true, ...opts });
    // Sprite real (erizo.png, cuadrado 192x192) escalado a 48x48; cuerpo
    // físico 40x32 centrado.
    this.setDisplaySize(64, 64);
    this.setSize(56, 44);
  }

  stomp() {
    return false;
  }
}
