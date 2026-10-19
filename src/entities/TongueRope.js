import Phaser from 'phaser';

// Lógica de la lengua-cuerda de desplazamiento (GDD Mecánica: "balancearse
// usando su lengua como si fuera una cuerda para llegar de un punto a otro o
// pasar sobre más enemigos"). Decisión del usuario: enganche a anclas fijas
// del escenario con balanceo físico de péndulo.
// Patrón State: estado desplegado/enganchado encapsulado en la clase;
// la Scene solo llama tryAttach/detach/update y dibuja la cuerda.
export default class TongueRope {
  constructor({ maxRange = 220, climbSpeed = 120 } = {}) {
    this.maxRange = maxRange;
    this.climbSpeed = climbSpeed;
    this.attached = false;
    this.anchor = null;
    this.length = 0;
  }

  // Engancha al ancla más cercana dentro de maxRange. Devuelve el ancla o null.
  tryAttach(player, anchors) {
    if (this.attached || !anchors?.length) return null;
    let best = null;
    let bestDist = this.maxRange;
    for (const a of anchors) {
      const d = Phaser.Math.Distance.Between(player.x, player.y, a.x, a.y);
      if (d < bestDist) {
        best = a;
        bestDist = d;
      }
    }
    if (!best) return null;
    this.attached = true;
    this.anchor = best;
    this.length = bestDist;
    return best;
  }

  // Trepar/descender: acorta (dir < 0) o alarga (dir > 0) la cuerda.
  // GDD Mecánica: "poder subir de arriba a abajo" mientras se está
  // enganchado. El update() proyecta al jugador sobre la circunferencia.
  climb(dir, delta = 16) {
    if (!this.attached) return;
    const speed = this.climbSpeed * (delta / 1000);
    this.length = Phaser.Math.Clamp(
      this.length + dir * speed,
      40,
      this.maxRange,
    );
  }

  detach() {
    this.attached = false;
    this.anchor = null;
  }

  // Restricción de cuerda (péndulo): corrige posición y velocidad radial.
  // La gravedad arcade sigue actuando; solo se elimina el estiramiento.
  // Nota física: en Arcade el sprite es el autoritativo al inicio del paso
  // (preUpdate sincroniza el body desde el game object, como hacen Wasp/Fly),
  // por eso se proyecta player.x/y y se ajusta la velocidad del body.
  update(player) {
    const body = player.body;
    if (!this.attached || !body) return;
    const { x: ax, y: ay } = this.anchor;
    const dx = player.x - ax;
    const dy = player.y - ay;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist <= this.length) return; // cuerda floja: balanceo libre

    const nx = dx / dist;
    const ny = dy / dist;
    // Proyectar el sprite sobre la circunferencia de la cuerda.
    player.x = ax + nx * this.length;
    player.y = ay + ny * this.length;
    // Eliminar la componente radial saliente de la velocidad.
    const v = body.velocity;
    const radial = v.x * nx + v.y * ny;
    if (radial > 0) body.setVelocity(v.x - radial * nx, v.y - radial * ny);
  }

  // Rectángulo/segmento para que la Scene dibuje la cuerda.
  line(player) {
    if (!this.attached) return null;
    return { x0: this.anchor.x, y0: this.anchor.y, x1: player.x, y1: player.y };
  }
}
