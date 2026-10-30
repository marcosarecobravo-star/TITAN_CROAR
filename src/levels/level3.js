// Nivel 3 — BOSQUE (GDD §12.3: barro, pozos, cactus, espinas y tronco;
// cangrejo, avispa y erizo). Jefe final: águila (GDD §10.4).
// Camino largo (~6400 px) + arena única del jefe (~6400-7600).
// Arena: piso con agujero en el medio, plataforma izq/der/superior, 2 anclajes.
export const LEVEL3 = {
  name: 'Bosque',
  spawn: { x: 60, y: 450 },
  bgColor: '#2e5d34',
  // Camino largo: 8 segmentos de suelo = 7 pozos.
  grounds: [
    { x: 0, y: 560, w: 800 },      // Z1
    { x: 920, y: 560, w: 780 },    // Z2
    { x: 1820, y: 560, w: 800 },   // Z3
    { x: 2740, y: 560, w: 780 },   // Z4
    { x: 3640, y: 560, w: 800 },   // Z5
    { x: 4560, y: 560, w: 780 },   // Z6
    { x: 5460, y: 560, w: 800 },   // Z7
    { x: 6380, y: 560, w: 400 },   // Z8 (entrada a la arena)
    // Arena: piso con agujero en el medio.
    { x: 7000, y: 560, w: 600 },   // piso derecho de la arena
  ],
  // Plataformas del camino + arena.
  platforms: [
    // Z1
    { x: 260, y: 440, w: 150 },
    { x: 520, y: 220, w: 140 },
    // Z2
    { x: 1100, y: 430, w: 150 },
    { x: 1380, y: 340, w: 140 },
    { x: 1620, y: 220, w: 130 },
    // Z3
    { x: 2000, y: 430, w: 220 },
    { x: 2320, y: 340, w: 150 },
    { x: 2560, y: 220, w: 130 },
    // Z4
    { x: 2920, y: 430, w: 150 },
    { x: 3200, y: 340, w: 200 },
    { x: 3480, y: 220, w: 130 },
    // Z5
    { x: 3820, y: 430, w: 150 },
    { x: 4100, y: 340, w: 150 },
    { x: 4340, y: 220, w: 130 },
    // Z6
    { x: 4720, y: 430, w: 220 },
    { x: 5040, y: 340, w: 150 },
    { x: 5280, y: 220, w: 130 },
    // Z7
    { x: 5620, y: 430, w: 150 },
    { x: 5900, y: 340, w: 150 },
    { x: 6140, y: 220, w: 130 },
    // Arena del jefe (4 plataformas)
    { x: 6500, y: 420, w: 180 },   // plataforma izquierda
    { x: 7200, y: 420, w: 180 },   // plataforma derecha
    { x: 6900, y: 260, w: 220 },   // plataforma superior
  ],
  crabs: [
    { x: 300, range: 90, speed: 60 },
    { x: 2000, y: 400, range: 80, speed: 65 },
    { x: 2120, y: 400, range: 80, speed: 65 },
    { x: 2320, y: 310, range: 40, speed: 70 },
    { x: 3200, range: 90, speed: 70 },
    { x: 4720, y: 400, range: 80, speed: 75 },
    { x: 4840, y: 400, range: 80, speed: 75 },
    { x: 5040, y: 310, range: 40, speed: 80 },
    { x: 5620, range: 90, speed: 80 },
  ],
  hedgehogs: [
    { x: 660, range: 70, speed: 40 },
    { x: 1250, range: 90, speed: 45 },
    { x: 3200, y: 310, range: 40, speed: 50 },
    { x: 3320, y: 310, range: 40, speed: 50 },
    { x: 3820, range: 60, speed: 55 },
    { x: 4720, y: 400, range: 40, speed: 60 },
    { x: 5620, range: 60, speed: 60 },
  ],
  wasps: [
    { x: 520, y: 240, range: 100, speed: 75 },
    { x: 800, y: 180, range: 90, speed: 80 },
    { x: 1250, y: 260, range: 80, speed: 70 },
    { x: 1700, y: 220, range: 90, speed: 75 },
    { x: 2100, y: 200, range: 100, speed: 80 },
    { x: 2500, y: 240, range: 90, speed: 85 },
    { x: 2900, y: 180, range: 100, speed: 90 },
    { x: 3300, y: 220, range: 90, speed: 95 },
    { x: 3700, y: 200, range: 100, speed: 100 },
    { x: 4100, y: 240, range: 90, speed: 105 },
    { x: 4500, y: 180, range: 100, speed: 110 },
    { x: 4900, y: 220, range: 90, speed: 115 },
    { x: 5300, y: 200, range: 100, speed: 120 },
    { x: 5700, y: 240, range: 90, speed: 125 },
    { x: 6100, y: 180, range: 100, speed: 130 },
  ],
  spikes: [
    { x: 380, y: 532 },
    { x: 840, y: 532 },
    { x: 1340, y: 532 },
    { x: 1840, y: 532 },
    { x: 2340, y: 532 },
    { x: 2840, y: 532 },
    { x: 3340, y: 532 },
    { x: 3840, y: 532 },
    { x: 4340, y: 532 },
    { x: 4840, y: 532 },
    { x: 5340, y: 532 },
    { x: 5840, y: 532 },
  ],
  cacti: [
    { x: 260, y: 512, w: 32, h: 64 },
    { x: 960, y: 512, w: 32, h: 64 },
    { x: 1460, y: 512, w: 32, h: 64 },
    { x: 1960, y: 512, w: 32, h: 64 },
    { x: 2460, y: 512, w: 32, h: 64 },
    { x: 2960, y: 512, w: 32, h: 64 },
    { x: 3460, y: 512, w: 32, h: 64 },
    { x: 3960, y: 512, w: 32, h: 64 },
    { x: 4460, y: 512, w: 32, h: 64 },
    { x: 4960, y: 512, w: 32, h: 64 },
    { x: 5460, y: 512, w: 32, h: 64 },
    { x: 5960, y: 512, w: 32, h: 64 },
  ],
  flies: [
    { x: 280, y: 380, range: 40 },
    { x: 760, y: 340, range: 40 },
    { x: 1280, y: 350, range: 40 },
    { x: 1760, y: 320, range: 40 },
    { x: 2260, y: 360, range: 40 },
    { x: 2760, y: 330, range: 40 },
    { x: 3260, y: 370, range: 40 },
    { x: 3760, y: 320, range: 40 },
    { x: 4260, y: 360, range: 40 },
    { x: 4760, y: 330, range: 40 },
    { x: 5260, y: 370, range: 40 },
    { x: 5760, y: 320, range: 40 },
    { x: 6260, y: 360, range: 40 },
    { x: 6760, y: 330, range: 40 },
  ],
  butterflies: [
    { x: 200, y: 380 },
    { x: 450, y: 330 },
    { x: 740, y: 370 },
    { x: 1000, y: 470 },
    { x: 1240, y: 350 },
    { x: 1480, y: 280 },
    { x: 1740, y: 380 },
    { x: 1980, y: 330 },
    { x: 2240, y: 370 },
    { x: 2480, y: 460 },
    { x: 2740, y: 390 },
    { x: 2980, y: 470 },
    { x: 3240, y: 380 },
    { x: 3480, y: 330 },
    { x: 3740, y: 370 },
    { x: 3980, y: 460 },
    { x: 4240, y: 390 },
    { x: 4480, y: 470 },
    { x: 4740, y: 380 },
    { x: 4980, y: 330 },
    { x: 5240, y: 370 },
    { x: 5480, y: 460 },
    { x: 5740, y: 390 },
    { x: 5980, y: 470 },
    { x: 6240, y: 380 },
    { x: 6480, y: 330 },
    { x: 6740, y: 370 },
  ],
  muds: [
    { x: 150, y: 538, w: 110 },
    { x: 1260, y: 538, w: 130 },
    { x: 1770, y: 538, w: 90 },
    { x: 2400, y: 538, w: 130 },
    { x: 3000, y: 538, w: 120 },
    { x: 3600, y: 538, w: 130 },
    { x: 4200, y: 538, w: 120 },
    { x: 4700, y: 538, w: 110 },
    { x: 5300, y: 538, w: 130 },
    { x: 5900, y: 538, w: 120 },
    { x: 6500, y: 538, w: 130 },
  ],
  logs: [
    { x: 980, y: 532, w: 72 },
    { x: 1980, y: 532, w: 72 },
    { x: 2980, y: 532, w: 72 },
    { x: 3980, y: 532, w: 72 },
    { x: 4980, y: 532, w: 72 },
    { x: 5980, y: 532, w: 72 },
  ],
  anchors: [
    { x: 570, y: 260 },
    { x: 1100, y: 260 },
    { x: 1690, y: 260 },
    { x: 2290, y: 260 },
    { x: 2900, y: 260 },
    { x: 3520, y: 260 },
    { x: 4140, y: 260 },
    { x: 4760, y: 260 },
    { x: 5380, y: 260 },
    { x: 6000, y: 260 },
    // anclajes altos (plataformas ocultas)
    { x: 400, y: 160 },
    { x: 1260, y: 160 },
    { x: 2160, y: 160 },
    { x: 3060, y: 160 },
    { x: 3960, y: 160 },
    { x: 4860, y: 160 },
    { x: 5760, y: 160 },
    // arena del jefe
    { x: 6500, y: 200 },
    { x: 7300, y: 200 },
  ],
  // Jefe águila al final (sin modificar, GDD §10.4).
  eagle: { x: 6900, y: 200, hp: 3, activateX: 6300 },
  // Sin bandera: la victoria final se logra derrotando al jefe.
  goal: null,
  worldWidth: 7600,
  timeLimit: 480,
  // Arena fija de la pelea: la cámara se centra aquí al activar el jefe.
  bossArena: { x: 6900, y: 360 },
};
