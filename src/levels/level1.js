// Config del Nivel 1 (slice). Supuesto: layout propio porque el GDD no define niveles.
// Reglas GDD cubiertas: plataformas, cangrejo x2 golpes, erizo inmune,
// avispa en aire, espinas, cactus-pared, pozo, barro, meta de nivel.
export const LEVEL1 = {
  spawn: { x: 60, y: 450 },
  // Segmentos de suelo (el hueco entre ellos es el pozo).
  grounds: [
    { x: 0, y: 560, w: 500 },
    { x: 620, y: 560, w: 480 },
  ],
  platforms: [
    { x: 180, y: 440, w: 140 },
    { x: 420, y: 350, w: 140 },
    { x: 700, y: 430, w: 150 },
  ],
  crabs: [
    { x: 350, range: 90, speed: 60 },
  ],
  hedgehogs: [
    { x: 780, range: 70, speed: 40 },
  ],
  wasps: [
    { x: 550, y: 220, range: 90, speed: 70 },
  ],
  spikes: [
    { x: 440, y: 532 },
  ],
  cacti: [
    { x: 880, y: 512, w: 32, h: 64 },
  ],
  muds: [
    { x: 660, y: 538, w: 110 },
  ],
  goal: { x: 1020, y: 520 },
  worldWidth: 1120,
};
