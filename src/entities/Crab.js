import Enemy from './Enemy.js';

// GDD Enemigos: "Cangrejo acorazado... saltar sobre él dos veces".
// Supuesto: velocidad 60 (intermedia), 2 HP.
export default class Crab extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'crab', { hp: 2, ...opts });
    this.setSize(40, 26);
  }
}
