// Lógica de la lengua-captura (GDD Mecánica, parcial; sin cuerda-desplazamiento).
// Supuestos acordados con el usuario: disparo corto al frente, alcance 90 px,
// ventana activa 150 ms, cooldown 600 ms. Sin render: la Scene dibuja el mockup.
// Puntos según GDD §8: avispa 15, mosca 5, mariposa 5 (100 = 1 vida extra).
export const TONGUE = { RANGE: 90, ACTIVE_MS: 150, COOLDOWN_MS: 600 };
export const POINTS = { WASP: 15, FLY: 5, BUTTERFLY: 5 };

export default class Tongue {
  constructor({ range = TONGUE.RANGE, activeMs = TONGUE.ACTIVE_MS, cooldownMs = TONGUE.COOLDOWN_MS } = {}) {
    this.range = range;
    this.activeMs = activeMs;
    this.cooldownMs = cooldownMs;
    this.dir = 1;
    this.activeUntil = -Infinity;
    this.readyAt = 0;
  }

  isActive(now) {
    return now < this.activeUntil;
  }

  canFire(now) {
    return now >= this.readyAt && !this.isActive(now);
  }

  // Dispara en la dirección dada (1 | -1). Devuelve false si está en cooldown.
  fire(now, dir) {
    if (!this.canFire(now)) return false;
    this.dir = dir >= 0 ? 1 : -1;
    this.activeUntil = now + this.activeMs;
    this.readyAt = now + this.cooldownMs;
    return true;
  }

  rect(px, py, halfW) {
    const x0 = px + this.dir * halfW;
    return { x0, x1: x0 + this.dir * this.range, y: py, halfH: 14 };
  }

  // AABB manual: la lengua es horizontal a la altura del jugador.
  hits(enemy, px, py, halfW) {
    const r = this.rect(px, py, halfW);
    const minX = Math.min(r.x0, r.x1);
    const maxX = Math.max(r.x0, r.x1);
    const hw = (enemy.body?.width ?? enemy.displayWidth ?? 20) / 2;
    return (
      enemy.x + hw >= minX &&
      enemy.x - hw <= maxX &&
      Math.abs(enemy.y - r.y) <= r.halfH + 12
    );
  }
}
