import Phaser from 'phaser';
import Enemy from './Enemy.js';

// Águila jefe (GDD Enemigos: "Jefe del último nivel, puede cargar contra el
// jugador, lanzar plumas afiladas y hacer ataques desde el aire. Para
// derrotarlo habrá que golpearlo varias veces").
// Patrón State: fases del combate ('patrol' | 'charge' | 'feathers' |
// 'recover') encapsuladas en esta clase; la Scene solo llama update() y
// escucha 'boss-defeated'. Movimiento sin gravedad (vuela).
export default class Eagle extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'eagle', { hp: opts.hp ?? 3, speed: opts.speed ?? 50, ...opts });
    this.activateX = opts.activateX ?? x - 200;
    this.homeX = x;
    this.homeY = y;
    this.state = 'patrol';
    this.stateUntil = 0;
    this.nextAttackAt = 0;
    this.feathersLeft = 0;
    this.lastFeatherAt = 0;
    this.setSize(48, 34);
    this.body.setAllowGravity(false);
    this.setCollideWorldBounds(true);
  }

  // Muerte del jefe: además del evento genérico, avía a la Scene (Observer).
  stomp() {
    const died = super.stomp();
    if (died) this.scene.events.emit('boss-defeated');
    return died;
  }

  changeState(state, ms) {
    this.state = state;
    this.stateUntil = this.scene.time.now + ms;
  }

  updateBehaviour(time, delta, player) {
    // Sin jugador activo o aún fuera de combate: patrulla tranquila.
    if (!player || player.active === false || player.x < this.activateX) {
      this.state = 'patrol';
      super.updateBehaviour(time, delta, player);
      return;
    }

    switch (this.state) {
      case 'patrol':
        // Sobrevuela su zona esperando; decide el próximo ataque.
        super.updateBehaviour(time, delta, player);
        this.y = this.homeY + Math.sin(time / 500) * 14;
        if (time >= this.nextAttackAt) {
          // Alterna carga (más frecuente) y plumas.
          if (Phaser.Math.Between(0, 2) === 0) {
            this.feathersLeft = 3;
            this.changeState('feathers', 2600);
          } else {
            this.changeState('charge', 1100);
          }
        }
        break;

      case 'charge': {
        // Carga contra el jugador (GDD: "puede cargar contra el jugador").
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const d = Math.hypot(dx, dy) || 1;
        const SPEED_CHARGE = 300;
        this.setVelocity((dx / d) * SPEED_CHARGE, (dy / d) * SPEED_CHARGE);
        if (time >= this.stateUntil) {
          this.changeState('recover', 900);
          this.nextAttackAt = time + 1200;
        }
        break;
      }

      case 'feathers': {
        // Eleva y lanza plumas afiladas en abanico hacia el jugador.
        this.setVelocity(0, -60);
        if (time - this.lastFeatherAt > 550 && this.feathersLeft > 0) {
          this.lastFeatherAt = time;
          this.feathersLeft -= 1;
          this.shootFeathers(player);
        }
        if (time >= this.stateUntil || this.feathersLeft <= 0) {
          this.changeState('recover', 700);
          this.nextAttackAt = time + 1400;
        }
        break;
      }

      case 'recover':
        // Vuelve a su altura de patrulla antes del próximo ataque.
        this.setVelocity(0, -40);
        if (this.y <= this.homeY + 10 || time >= this.stateUntil) {
          this.y = this.homeY;
          this.changeState('patrol', 0);
        }
        break;

      default:
        this.changeState('patrol', 0);
    }
  }

  // Tres plumas en abanico; la central apunta al jugador (GDD: "lanzar plumas
  // afiladas"). Las crea la Scene en su grupo (más control de colisiones).
  shootFeathers(player) {
    const base = Math.atan2(player.y - this.y, player.x - this.x);
    for (const offset of [-0.35, 0, 0.35]) {
      this.scene.spawnFeather(this.x, this.y + 10, base + offset);
    }
  }
}
