// Config del Nivel 2 — DESIERTO (GDD sección "NIVEL 2: DESIERTO":
// cactus, pozos y arenas movedizas; cangrejo, avispa y erizo).
// Supuesto: layout propio porque el GDD no define posiciones.
export const LEVEL2 = {
  name: 'Desierto',
  spawn: { x: 60, y: 450 },
  bgColor: '#e8b86d', // mockup de tema (sin sprite de fondo).
  grounds: [
    { x: 0, y: 560, w: 420 },
    { x: 540, y: 560, w: 380 },
    { x: 1040, y: 560, w: 460 },
  ],
  platforms: [
    { x: 260, y: 430, w: 130 },
    { x: 640, y: 420, w: 140 },
    { x: 1120, y: 440, w: 150 },
  ],
  crabs: [
    { x: 300, range: 80, speed: 60 },
    { x: 1180, range: 90, speed: 65 },
  ],
  hedgehogs: [
    { x: 700, range: 70, speed: 40 },
  ],
  wasps: [
    { x: 480, y: 230, range: 100, speed: 75 },
    { x: 1250, y: 260, range: 80, speed: 70 },
  ],
  // Arenas movedizas (GDD: reducen la velocidad temporalmente).
  sands: [
    { x: 600, y: 538, w: 130 },
    { x: 1120, y: 538, w: 120 },
  ],
  cacti: [
    { x: 360, y: 512, w: 32, h: 64 },
    { x: 880, y: 512, w: 32, h: 64 },
    { x: 940, y: 512, w: 32, h: 64 },
    { x: 1380, y: 512, w: 32, h: 64 },
  ],
  spikes: [],
  muds: [],
  logs: [],
  // Anclas de la lengua-cuerda sobre los pozos (mecánica global).
  anchors: [
    { x: 480, y: 290 },
    { x: 990, y: 300 },
  ],
  flies: [
    { x: 320, y: 380, range: 40 },
    { x: 700, y: 330, range: 40 },
    { x: 1200, y: 380, range: 40 },
  ],
  butterflies: [
    { x: 220, y: 380 },
    { x: 400, y: 330 },
    { x: 680, y: 370 },
    { x: 900, y: 460 },
    { x: 1150, y: 390 },
    { x: 1420, y: 470 },
  ],
  goal: { x: 1460, y: 520 },
  worldWidth: 1560,
};
