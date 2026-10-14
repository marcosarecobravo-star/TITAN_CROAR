import Enemy from './Enemy.js';

// GDD Enemigos: "Cangrejo acorazado... saltar sobre él dos veces".
// GDD: "Se mueven de izquierda a derecha, pueden bajarse de su plataforma
// pero no caerán a un agujero". Supuesto: velocidad 60 (intermedia), 2 HP.
// Anti-pozo: si a nivel de suelo el próximo paso cae en una columna sin
// ningún sólido (pozo), invierte dirección; bajar de plataforma se permite.
export default class Crab extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'crab', { hp: 2, ...opts });
    this.setSize(40, 26);
  }

  updateBehaviour(...args) {
    const aheadX = this.x + this.dir * 26;
    const solids = this.scene.solids?.getChildren?.() ?? [];
    const overAnyGroundColumn = solids.some(
      (s) => Math.abs(s.x - aheadX) < s.displayWidth / 2,
    );
    // Solo bloquea a nivel bajo (suelo); en plataformas altas permite bajar.
    if (this.body?.blocked.down && this.y > 470 && solids.length > 0 && !overAnyGroundColumn) {
      this.dir *= -1;
    }
    super.updateBehaviour(...args);
  }
}
