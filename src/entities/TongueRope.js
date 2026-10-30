import Phaser from 'phaser';

// Lógica de la lengua-cuerda de desplazamiento (GDD Mecánica: "balancearse
// usando su lengua como si fuera una cuerda para llegar de un punto a otro o
// pasar sobre más enemigos"). Decisión del usuario: enganche a anclas fijas
// del escenario con balanceo físico de péndulo.
// Patrón State: estado desplegado/enganchado encapsulado en la clase;
// la Scene solo llama tryAttach/detach/update y dibuja la cuerda.
export default class TongueRope {
  constructor({ maxRange = 380, climbSpeed = 120 } = {}) {
    this.maxRange = maxRange;
    this.climbSpeed = climbSpeed;
    this.attached = false;
    this.anchor = null;
    this.length = 0;
  }

  // Engancha al ancla más cercana dentro de maxRange, solo si hay línea de
  // visión (no atraviesa paredes/sólidos). Devuelve el ancla o null.
  tryAttach(player, anchors) {
    if (this.attached || !anchors?.length) return null;
    const solids = player.scene?.solids?.getChildren?.() ?? [];
    let best = null;
    let bestDist = this.maxRange;
    for (const a of anchors) {
      const d = Phaser.Math.Distance.Between(player.x, player.y, a.x, a.y);
      if (d >= bestDist) continue;
      // Línea de visión: ningún sólido se interpone.
      if (this.blockedBySolid(player.x, player.y, a.x, a.y, solids)) continue;
      best = a;
      bestDist = d;
    }
    if (!best) return null;
    this.attached = true;
    this.anchor = best;
    this.length = bestDist;
    return best;
  }

  // Comprueba si un segmento entre (x1,y1) y (x2,y2) atraviesa algún sólido.
  blockedBySolid(x1, y1, x2, y2, solids) {
    const steps = 12;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      for (const s of solids) {
        const hw = s.displayWidth / 2;
        const hh = s.displayHeight / 2;
        if (px >= s.x - hw && px <= s.x + hw &&
            py >= s.y - hh && py <= s.y + hh) {
          return true;
        }
      }
    }
    return false;
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

  // Suelta la cuerda. Al soltar se conserva la velocidad tangencial (y se
  // amplifica con `boost`) para que el jugador salga despedido en trayectoria
  // parabólica bajo la gravedad (efecto de "tiro" al soltar el balanceo).
  detach(player = null, boost = 1.5) {
    if (!this.attached) return;
    if (player?.body) {
      const v = player.body.velocity;
      player.body.setVelocity(v.x * boost, v.y * boost);
    }
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
