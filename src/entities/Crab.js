import Enemy from './Enemy.js';

// GDD Enemigos: "Cangrejo acorazado... saltar sobre él dos veces".
// GDD: "Se mueven de izquierda a derecha, pueden bajarse de su plataforma
// pero no caerán a un agujero". Supuesto: velocidad 60 (intermedia), 2 HP.
// Anti-pozo: comportamiento heredado de Enemy (avoidPits); bajar de la
// plataforma se permite porque el giro solo aplica a ras de suelo.
export default class Crab extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'crab', { hp: 2, avoidPits: true, ...opts });
    // Sprite real (cangrejo.png, cuadrado 192x192) escalado a 96x96; el
    // cuerpo físico (88x64) se centra para que la colisión sea fiel al sprite.
    this.setDisplaySize(96, 96);
    this.setSize(88, 64);
  }
}
