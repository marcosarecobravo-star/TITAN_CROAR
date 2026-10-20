import Enemy from './Enemy.js';

// Mosca inofensiva (GDD Mecánica: la lengua puede atraparla, da puntos).
// Al contacto NO daña: la Scene no la registra como colisión del jugador,
// solo la lengua la captura. Vuelo: deriva senoidal sin gravedad.
export default class Fly extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'fly', { hp: 1, ...opts });
    this.baseX = x;
    this.baseY = y;
    this.amplitude = Math.max(10, ((this.patrolMax - this.patrolMin) / 2) || 30);
    this.phase = Math.random() * Math.PI * 2;
    this.setSize(18, 14);
    this.body.setAllowGravity(false);
  }

  updateBehaviour(time) {
    const t = time / 1000;
    this.x = this.baseX + Math.sin(t * 0.7 + this.phase) * this.amplitude;
    this.y = this.baseY + Math.sin(t * 1.7 + this.phase) * 12;
    this.setVelocity(0, 0);
  }
}
