import Enemy from './Enemy.js';

// GDD Enemigos: "Erizos gigantes: no pueden ser derrotados".
// stomp() queda bloqueado: el pisotón NO le hace daño (la Scene debe
// dañar al jugador en ese caso).
export default class Hedgehog extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'hedgehog', { hp: Infinity, ...opts });
    this.setSize(40, 26);
  }

  stomp() {
    return false;
  }
}
