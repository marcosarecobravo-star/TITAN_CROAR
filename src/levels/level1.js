// Config del Nivel 1 — PANTANO (GDD sección "NIVEL 1: PANTANO":
// barro, pozos, espinas y tronco; cangrejo, avispa y erizo).
// Supuesto: layout propio porque el GDD no define posiciones.
export const LEVEL1 = {
  name: 'Pantano',
  spawn: { x: 60, y: 450 },
  bgImage: 'bgPantano', // PNG real en public/ (decisión del usuario).
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
  // Moscas inofensivas (GDD: capturables con lengua). Supuesto: layout propio.
  flies: [
    { x: 300, y: 400, range: 40 },
    { x: 520, y: 300, range: 40 },
    { x: 830, y: 380, range: 40 },
  ],
  // Mariposas (GDD: suman puntos al pasar). Supuesto: +25 c/u, 5 en Nivel 1.
  butterflies: [
    { x: 250, y: 390 },
    { x: 480, y: 300 },
    { x: 760, y: 380 },
    { x: 950, y: 470 },
    { x: 150, y: 500 },
  ],
  // Sin cactus: sección "NIVEL 1: PANTANO" solo lista barro, pozos, espinas
  // y tronco (decisión usuario: se retira el cactus que había aquí).
  // Barro (GDD: reduce la velocidad temporalmente).
  muds: [
    { x: 660, y: 538, w: 110 },
  ],
  // Tronco (GDD Obstáculos: "Se interpone en el camino"; decisión usuario:
  // sólido y saltable, sin daño al contacto). x = esquina izquierda.
  logs: [
    { x: 100, y: 532, w: 72 },
    { x: 940, y: 532, w: 72 },
  ],
  // Anclas de la lengua-cuerda (GDD Mecánica: balancearse como una cuerda;
  // decisión usuario: enganche a anclas fijas con balanceo).
  anchors: [
    { x: 560, y: 300 }, // sobre el pozo: balancear para cruzar
    { x: 900, y: 250 }, // sobre tronco/erizo: pasar por encima
  ],
  goal: { x: 1020, y: 520 },
  worldWidth: 1120,
};
