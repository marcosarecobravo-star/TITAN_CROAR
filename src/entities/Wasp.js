import Phaser from 'phaser';
import Enemy from './Enemy.js';

// GDD Enemigos: "Avispa gigante: se abalanza contra el jugador, siempre está
// en el aire... esta seguirá al jugador hasta que este acabe con ella o salga
// de su rango". Edición del GDD (28/10/2026): "se abalanza haciendo arcos
// en forma de U". Versión endurecida: arco rápido, seguimiento horizontal,
// arco doble (U+W) y ataques más frecuentes. La avispa nunca toca el piso.
export default class Wasp extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'wasp', { hp: 1, ...opts });
    this.baseY = y;
    this.phase = Math.random() * Math.PI * 2;
    this.setDisplaySize(48, 48);
    this.setSize(32, 26);
    this.body.setAllowGravity(false);
    // Parámetros del arco (ajustables).
    this.arcSpeed = 3.2;        // rad/s → arco ~1.0s (más rápido).
    this.arcDepth = 150;        // profundidad máxima del arco (px).
    this.arcHSpeed = 170;      // velocidad horizontal base (px/s).
    this.hTrack = 0.6;         // seguimiento horizontal hacia el jugador (0..1).
    this.minY = (scene.level?.grounds?.[0]?.y ?? 560) - 70; // no tocar el piso.
    // Estado del arco.
    this.attacking = false;
    this.arcPhase = 0;         // 0..PI por arco.
    this.arcCount = 0;         // arcos encadenados (0,1) → U luego W.
    this.arcDir = 1;           // dirección horizontal del arco actual.
    this.recoverTimer = 0;     // recuperación tras el arco.
  }

  updateBehaviour(time, delta, player) {
    const dt = delta / 1000;
    const t = time / 1000;

    if (this.attacking) {
      // Seguimiento horizontal hacia el jugador (acotado).
      if (player) {
        const dx = player.x - this.x;
        const desired = Math.sign(dx) || this.arcDir;
        this.arcDir += (desired - this.arcDir) * this.hTrack;
        if (Math.abs(this.arcDir) < 0.3) this.arcDir = Math.sign(this.arcDir) || 1;
      }
      this.arcPhase += this.arcSpeed * dt;
      this.attackTimer += dt;
      this.x += this.arcDir * this.arcHSpeed * dt;
      // Durante el ataque no se limita al rango de patrulla: la avispa sigue
      // a la rana libremente en X (solo se evita salir del mundo).
      const worldW = this.scene.level?.worldWidth ?? 99999;
      this.x = Phaser.Math.Clamp(this.x, 20, worldW - 20);
      // y sigue el arco; no baja del piso mínimo.
      const arcY = this.baseY + this.arcDepth * Math.sin(this.arcPhase);
      this.y = Math.min(arcY, this.minY);
      this.setVelocity(0, 0);

      // Abortar si el jugador se aleja mucho.
      if (player && (Math.abs(player.x - this.x) > 320 || this.attackTimer > 3.0)) {
        this.attacking = false;
        this.arcCount = 0;
        this.setVelocity(0, -140);
        this.scene.time.delayedCall(300, () => { if (!this.dead) this.setVelocity(0, 0); });
        return;
      }
      // Fin de un arco: encadenar segundo (W) o terminar.
      if (this.arcPhase >= Math.PI) {
        if (this.arcCount === 0 && player && Math.abs(player.x - this.x) < 260) {
          // Segundo arco en sentido contrario (W).
          this.arcCount = 1;
          this.arcPhase = 0;
          this.arcDir = -this.arcDir;
        } else {
          this.attacking = false;
          this.arcCount = 0;
          this.y = this.baseY;
          this.recoverTimer = 0.5;
        }
      }
      // Ventana vulnerable: al fondo del arco (capturable con lengua).
      const vulnerable = this.arcPhase > Math.PI / 3 && this.arcPhase < 2 * Math.PI / 3;
      this.setTint(vulnerable ? 0xffe66d : 0xffffff);
      return;
    }

    // Recuperación breve tras el arco.
    if (this.recoverTimer > 0) {
      this.recoverTimer -= dt;
      // Volver a la zona inicial durante la recuperación.
      const center = (this.patrolMin + this.patrolMax) / 2;
      this.x += (center - this.x) * Math.min(1, dt * 2);
      this.x = Phaser.Math.Clamp(this.x, this.patrolMin, this.patrolMax);
      this.y = this.baseY + Math.sin(t * 2 + this.phase) * 12;
      this.setVelocity(0, 0);
      this.setTint(0xffffff);
      return;
    }

    // Flote: patrulla suave + seno.
    this.x += Math.sin(t * 0.9 + this.phase) * (this.patrolSpeed * dt);
    this.x = Phaser.Math.Clamp(this.x, this.patrolMin, this.patrolMax);
    this.y = this.baseY + Math.sin(t * 2 + this.phase) * 18;
    this.setVelocity(0, 0);
    this.setTint(0xffffff);

    // Disparar arco si el jugador está por debajo/en rango (más frecuente).
    if (player && Math.abs(player.x - this.x) < 170 && player.y > this.y - 40) {
      this.attacking = true;
      this.arcPhase = 0;
      this.arcCount = 0;
      this.arcDir = Math.sign(player.x - this.x) || 1;
      this.attackTimer = 0;
    }
  }
}
