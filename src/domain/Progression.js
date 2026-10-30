// Progresion entre niveles (GDD Condicion de Victoria).
// Decision del usuario: conservar hojas y puntaje al pasar de nivel;
// derrota = empezar desde 0 el nivel ACTUAL (3 hojas, 0 pts, sin tope).
// Patron Singleton por modulo: una unica instancia compartida entre escenas.
export default class Progression {
  constructor() {
    this.levelIndex = 0;
    this.lives = 3;
    this.points = 0;
  }

  resetLevel() {
    this.lives = 3;
    this.points = 0;
  }

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
