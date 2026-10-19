import Enemy from './Enemy.js';

// GDD Enemigos: "Cangrejo acorazado... saltar sobre él dos veces".
// GDD: "Se mueven de izquierda a derecha, pueden bajarse de su plataforma
// pero no caerán a un agujero". Supuesto: velocidad 60 (intermedia), 2 HP.
// Anti-pozo: comportamiento heredado de Enemy (avoidPits); bajar de la
// plataforma se permite porque el giro solo aplica a ras de suelo.
export default class Crab extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'crab', { hp: 2, avoidPits: true, ...opts });
    this.setSize(40, 26);
  }
}
