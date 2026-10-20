// Config del Nivel 3 — BOSQUE (GDD sección "NIVEL 3: BOSQUE": barro, pozos,
// cactus, espinas y tronco; cangrejo, avispa y erizo).
// Jefe final: águila (GDD Enemigos: "Jefe del último nivel... Para derrotarlo
// habrá que golpearlo varias veces"; decisión del usuario: se incluye pese a
// no listarse en la sección del nivel).
// Supuesto: layout propio porque el GDD no define posiciones.
export const LEVEL3 = {
  name: 'Bosque',
  spawn: { x: 60, y: 450 },
  bgColor: '#2e5d34', // mockup de tema (sin sprite de fondo).
  grounds: [
    { x: 0, y: 560, w: 460 },
    { x: 580, y: 560, w: 400 },
    { x: 1100, y: 560, w: 600 },
  ],
  platforms: [
    { x: 220, y: 430, w: 140 },
    { x: 700, y: 420, w: 150 },
    { x: 1200, y: 400, w: 160 },
    { x: 1450, y: 330, w: 160 },
  ],
  crabs: [
    { x: 300, range: 90, speed: 60 },
    { x: 780, range: 80, speed: 65 },
  ],
  hedgehogs: [
    { x: 660, range: 70, speed: 40 },
    { x: 1250, range: 90, speed: 45 },
  ],
  wasps: [
    { x: 520, y: 240, range: 100, speed: 75 },
    { x: 1180, y: 220, range: 90, speed: 70 },
  ],
  // Jefe águila: zona de combate al final del nivel.
  eagle: { x: 1480, y: 160, hp: 3, activateX: 1300 },
  spikes: [
    { x: 380, y: 532 },
    { x: 840, y: 532 },
  ],
  muds: [
    { x: 620, y: 538, w: 120 },
    { x: 1300, y: 538, w: 110 },
  ],
  cacti: [
    { x: 260, y: 512, w: 32, h: 64 },
    { x: 960, y: 512, w: 32, h: 64 },
  ],
  logs: [
    { x: 120, y: 532, w: 72 },
    { x: 880, y: 532, w: 72 },
  ],
  anchors: [
    { x: 520, y: 300 },
    { x: 1050, y: 280 },
  ],
  flies: [
    { x: 280, y: 380, range: 40 },
    { x: 760, y: 340, range: 40 },
    { x: 1280, y: 350, range: 40 },
  ],
  butterflies: [
    { x: 200, y: 380 },
    { x: 450, y: 330 },
    { x: 740, y: 370 },
    { x: 1000, y: 470 },
    { x: 1240, y: 350 },
    { x: 1480, y: 280 },
  ],
  // Sin bandera de meta: la victoria final se logra derrotando al jefe
  // (GDD Condición de Victoria).
  goal: null,
  worldWidth: 1700,
};
