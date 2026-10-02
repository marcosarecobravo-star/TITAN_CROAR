export const LEVEL_1 = {
  name: 'Nivel 1 (prototipo)',
  worldWidth: 2400,
  worldHeight: 600,
  spawn: { x: 100, y: 420 },
  pitRespawn: { x: 620, y: 300 },
  killY: 640,
  // Tramos de piso con un pozo entre 700-800 (GDD: pozos en cada nivel)
  floors: [
    { x: 350, y: 580, w: 700, h: 40 },
    { x: 1600, y: 580, w: 1600, h: 40 },
  ],
  platforms: [
    { x: 400, y: 450 },
    { x: 620, y: 350 },
    { x: 1100, y: 450 },
    { x: 1400, y: 350 },
    { x: 1700, y: 450 },
  ],
  enemies: [
    { type: 'crab', x: 1000, y: 500, minX: 880, maxX: 1120 },
    { type: 'hedgehog', x: 1250, y: 500, minX: 1150, maxX: 1350 },
    { type: 'crab', x: 1580, y: 500, minX: 1480, maxX: 1700 },
  ],
  spikes: [
    { x: 920, y: 548 },
    { x: 1470, y: 548 },
  ],
  goal: { x: 2250, y: 500 },
};
