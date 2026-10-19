import Enemy from './Enemy.js';

// GDD Enemigos: "Erizos gigantes: no pueden ser derrotados" y decisión del
// usuario: tampoco caerán a los pozos (mismo anti-pozo que el cangrejo).
// stomp() queda bloqueado: el pisotón NO le hace daño (la Scene daña al
// jugador en su lugar).
export default class Hedgehog extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'hedgehog', { hp: Infinity, avoidPits: true, ...opts });
    this.setSize(40, 26);
  }

  stomp() {
    return false;
  }
}
