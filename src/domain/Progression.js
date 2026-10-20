// Progresión entre niveles (GDD Condición de Victoria: "Llegar al punto
// final de cada nivel. En el último nivel se enfrentará al jefe que al
// derrotarlo completa el juego").
// Decisión del usuario: conservar hojas y puntaje al pasar de nivel;
// derrota = empezar desde 0 el nivel ACTUAL (3 hojas, 0 pts, sin tope).
// Patrón Singleton por módulo: una única instancia compartida entre escenas.
export default class Progression {
  constructor() {
    this.levelIndex = 0;
    this.lives = 3;
    this.points = 0;
  }

  // GDD Derrota: "tendrá que empezar desde 0". Decisión del usuario:
  // reinicia el nivel actual, no el juego entero.
  resetLevel() {
    this.lives = 3;
    this.points = 0;
  }

  // Reinicio total del juego (victoria final o inicio de partida).
  reset() {
    this.levelIndex = 0;
    this.lives = 3;
    this.points = 0;
  }

  advance() {
    this.levelIndex += 1;
  }

  isLast(levelCount) {
    return this.levelIndex >= levelCount - 1;
  }
}

export const progression = new Progression();
