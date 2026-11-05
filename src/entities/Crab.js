import Enemy from './Enemy.js';

// GDD Enemigos: "Cangrejo acorazado... saltar sobre él dos veces".
// GDD: "Se mueven de izquierda a derecha, pueden bajarse de su plataforma
// pero no caerán a un agujero". Supuesto: velocidad 60 (intermedia), 2 HP.
// Anti-pozo: comportamiento heredado de Enemy (avoidPits); bajar de la
// plataforma se permite porque el giro solo aplica a ras de suelo.
export default class Crab extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'crab', { hp: 2, avoidPits: true, ...opts });
    // Sprite real (cangrejo.png, 192x192) escalado a 96x96; cuerpo 88x64 centrado
    // horizontalmente y apoyado abajo: offset = ((96-88)/2, 96-64) = (4, 32).
    this.setDisplaySize(96, 96);
    this.setSize(88, 64);
    this.body.setOffset(50, 75);
  }
}
