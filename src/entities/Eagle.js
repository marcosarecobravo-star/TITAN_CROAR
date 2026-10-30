import Phaser from 'phaser';
import Enemy from './Enemy.js';

// Águila jefe (GDD §10.4): "Jefe del último nivel, puede cargar contra el
// jugador, lanzar plumas afiladas y hacer ataques desde el aire. Para
// derrotarlo habrá que golpearlo varias veces". GDD final: 3 fases (picado,
// plumas, barrido aéreo), 6 HP, ventanas de vulnerabilidad, +velocidad al 50%,
// arena con enganches.
// Comportamiento ampliado según petición del usuario:
// - Al recibir daño: va al centro-arriba del mapa, lanza 5 plumas (por ráfaga)
//   cada 2 s, 5 ráfagas (10 s total), inmune durante ese estado. Tras eso
//   vuelve al patrón normal.
export default class Eagle extends Enemy {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, 'eagle', { hp: opts.hp ?? 6, speed: opts.speed ?? 50, ...opts });
    this.activateX = opts.activateX ?? x - 200;
    this.homeX = x;
    this.homeY = y;
    this.state = 'patrol';
    this.stateUntil = 0;
    this.nextAttackAt = 0;
    this.feathersLeft = 0;
    this.lastFeatherAt = 0;
    // Barrage (inmune) tras recibir daño.
    this.immune = false;
    this.barrageShot = 0;
    this.lastBarrageShot = 0;
    this.barrageCenterX = null;   // centro horizontal del mapa (arena).
    this.barrageTopY = y - 120;
    this.vulnerable = false;       // ventana de vulnerabilidad (pisotón).
    this.sweepDir = 1;
    this.setSize(48, 34);
    this.body.setAllowGravity(false);
    this.setCollideWorldBounds(true);
  }

  // Muerte del jefe: además del evento genérico, avisa a la Scene (Observer).
  stomp() {
    if (this.immune) return false; // inmune durante el barrage.
    const died = super.stomp();
    if (died) {
      this.scene.events.emit('boss-defeated');
      return true;
    }
    // Al recibir daño: sube al centro-arriba y entra en barrage (5 ráfagas
    // de 5 plumas cada 2 s).
    this.immune = true;
    this.barrageShot = 0;
    this.lastBarrageShot = 0;
    // Centro de la arena (no el centro del nivel entero).
    this.barrageCenterX = this.homeX;
    this.changeState('barrage', 10000);
    return false;
  }

  changeState(state, ms) {
    this.state = state;
    this.stateUntil = this.scene.time.now + ms;
  }

  // Multiplicador de velocidad: +40% cuando queda al 50% o menos de HP.
  speedMul() {
    return this.hp <= 3 ? 1.4 : 1.0;
  }

  updateBehaviour(time, delta, player) {
    // Sin jugador activo o aún fuera de combate: patrulla tranquila.
    if (!player || player.active === false || player.x < this.activateX) {
      this.state = 'patrol';
      this.immune = false;
      this.vulnerable = false;
      super.updateBehaviour(time, delta, player);
      this.y = this.homeY + Math.sin(time / 500) * 14;
      return;
    }

    switch (this.state) {
      case 'patrol':
        super.updateBehaviour(time, delta, player);
        this.y = this.homeY + Math.sin(time / 500) * 14;
        this.vulnerable = false;
        if (time >= this.nextAttackAt) {
          const r = Phaser.Math.Between(0, 2);
          if (r === 0) {
            this.feathersLeft = 5;
            this.changeState('feathers', 2600);
          } else if (r === 1) {
            this.changeState('charge', 1100);
          } else {
            this.changeState('charge', 1100);
          }
        }
        break;

      case 'charge': {
        this.vulnerable = true;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const d = Math.hypot(dx, dy) || 1;
        const SPEED_CHARGE = 300 * this.speedMul();
        this.setVelocity((dx / d) * SPEED_CHARGE, (dy / d) * SPEED_CHARGE);
        if (time >= this.stateUntil) {
          this.changeState('recover', 900);
          this.nextAttackAt = time + 1200;
        }
        break;
      }

      case 'feathers': {
        this.vulnerable = false;
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
        this.vulnerable = true;
        this.setVelocity(0, -40);
        if (this.y <= this.homeY + 10 || time >= this.stateUntil) {
          this.y = this.homeY;
          this.changeState('patrol', 0);
        }
        break;

      case 'barrage': {
        // Se queda quieto en el centro-superior de la arena.
        this.x = this.barrageCenterX;
        this.setVelocity(0, 0);
        if (this.y > this.barrageTopY) {
          this.y = Math.max(this.barrageTopY, this.y - 4);
        } else {
          this.y = this.barrageTopY;
        }
        // Lanza 5 ráfagas de 5 plumas cada 2 s, apuntando al jugador.
        if (this.barrageShot < 5 && (this.lastBarrageShot === 0 || time - this.lastBarrageShot > 2000)) {
          this.lastBarrageShot = time;
          this.barrageShot += 1;
          this.shootFeathers(player);
        }
        if (time >= this.stateUntil) {
          this.immune = false;
          this.y = this.homeY;
          this.changeState('patrol', 0);
          this.nextAttackAt = time + 1200;
        }
        break;
      }

      default:
        this.changeState('patrol', 0);
    }
  }

  // 5 plumas en abanico; la central apunta al jugador.
  shootFeathers(player) {
    const base = Math.atan2(player.y - this.y, player.x - this.x);
    for (const offset of [-0.6, -0.3, 0, 0.3, 0.6]) {
      this.scene.spawnFeather(this.x, this.y + 10, base + offset);
    }
  }
}
