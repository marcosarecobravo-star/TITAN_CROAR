// Nivel 1 — PANTANO. Primer nivel registrado (LEVELS = [LEVEL1, LEVEL2]).
// Muy largo (~5500 px), decisión del usuario: 8 pozos, caminos alternativos
// (plataformas bajas y muy altas) y anclajes separados para balancearse.
// Enemigos también patrullan plataformas (evitan caerse por el borde).
// Obstáculos según Docs/GDD_TC.docx, sección "NIVEL 1: PANTANO": barro, pozos,
// espinas y tronco. Sin cactus.
// Enemigos: cangrejo, avispa y erizo. Sin águila jefe (acaba en la bandera).
export const LEVEL1 = {
  name: 'Pantano',
  spawn: { x: 60, y: 450 },
  bgImage: 'bgPantano',
  // 9 segmentos de suelo = 8 pozos.
  // Pozos: A 540–600 | B 1060–1140 | C 1640–1740 | D 2240–2340 |
  //        E 2840–2960 | F 3460–3580 | G 4080–4200 | H 4700–4820
  grounds: [
    { x: 0, y: 560, w: 540 },      // Z1 (tutorial)
    { x: 600, y: 560, w: 460 },    // Z2
    { x: 1140, y: 560, w: 500 },   // Z3
    { x: 1740, y: 560, w: 500 },   // Z4
    { x: 2340, y: 560, w: 500 },   // Z5
    { x: 2960, y: 560, w: 500 },   // Z6
    { x: 3580, y: 560, w: 500 },   // Z7
    { x: 4200, y: 560, w: 500 },   // Z8
    { x: 4820, y: 560, w: 680 },   // Z9 (final con bandera)
  ],
  // Plataformas: bajas (y~420-440) y muy altas (y~180-240) por zona.
  platforms: [
    // Z1
    { x: 260, y: 440, w: 140 },
    { x: 420, y: 220, w: 120 },
    // Z2
    { x: 700, y: 430, w: 140 },
    { x: 900, y: 350, w: 140 },
    { x: 760, y: 200, w: 120 },
    // Z3
    { x: 1250, y: 430, w: 150 },
    { x: 1450, y: 340, w: 150 },
    { x: 1320, y: 260, w: 130 },
    { x: 1380, y: 180, w: 120 },
    // Z4
    { x: 1850, y: 420, w: 150 },
    { x: 2050, y: 330, w: 150 },
    { x: 1920, y: 250, w: 130 },
    { x: 1980, y: 170, w: 120 },
    // Z5
    { x: 2450, y: 420, w: 150 },
    { x: 2650, y: 330, w: 150 },
    { x: 2520, y: 250, w: 130 },
    { x: 2580, y: 170, w: 120 },
    // Z6
    { x: 3050, y: 420, w: 150 },
    { x: 3250, y: 330, w: 150 },
    { x: 3120, y: 250, w: 130 },
    { x: 3180, y: 170, w: 120 },
    // Z7
    { x: 3680, y: 420, w: 150 },
    { x: 3880, y: 330, w: 150 },
    { x: 3750, y: 250, w: 130 },
    { x: 3810, y: 170, w: 120 },
    // Z8
    { x: 4300, y: 420, w: 150 },
    { x: 4500, y: 330, w: 150 },
    { x: 4370, y: 250, w: 130 },
    { x: 4430, y: 170, w: 120 },
    // Z9 (final)
    { x: 4860, y: 440, w: 140 },
    { x: 5100, y: 330, w: 150 },
    { x: 5250, y: 240, w: 130 },
    { x: 5400, y: 440, w: 120 },
  ],
  // Cangrejos: en suelo y en plataformas (avoidPits los mantiene en su plataforma).
  crabs: [
    { x: 350, range: 80, speed: 40 },
    // en plataforma alta Z2
    { x: 760, y: 230, range: 40, speed: 50 },
    { x: 1300, range: 60, speed: 70 },
    { x: 1560, range: 50, speed: 75 },
    { x: 1920, y: 210, range: 30, speed: 60 },
    { x: 2150, range: 25, speed: 85 },
    { x: 2500, range: 50, speed: 90 },
    { x: 2750, range: 40, speed: 95 },
    { x: 3200, range: 30, speed: 100 },
    { x: 3480, range: 20, speed: 105 },
    { x: 3750, range: 40, speed: 108 },
    { x: 4000, range: 30, speed: 112 },
    { x: 4350, range: 25, speed: 115 },
    { x: 4650, range: 20, speed: 120 },
    { x: 4900, range: 15, speed: 125 },
    { x: 5200, range: 30, speed: 128 },
  ],
  // Erizos inmunes (también en plataformas).
  hedgehogs: [
    { x: 800, range: 60, speed: 35 },
    { x: 900, y: 310, range: 30, speed: 40 },
    { x: 1980, range: 40, speed: 45 },
    { x: 2600, range: 50, speed: 50 },
    { x: 3300, range: 30, speed: 55 },
    { x: 3900, range: 40, speed: 60 },
    { x: 4500, range: 30, speed: 65 },
    { x: 5050, y: 200, range: 30, speed: 70 },
  ],
  // Avispas.
  wasps: [
    { x: 950, y: 240, range: 90, speed: 65 },
    { x: 1250, y: 230, range: 100, speed: 80 },
    { x: 1550, y: 260, range: 80, speed: 75 },
    { x: 2120, y: 240, range: 90, speed: 85 },
    { x: 2450, y: 230, range: 100, speed: 90 },
    { x: 2750, y: 260, range: 90, speed: 95 },
    { x: 3100, y: 240, range: 90, speed: 100 },
    { x: 3400, y: 230, range: 90, speed: 105 },
    { x: 3750, y: 240, range: 90, speed: 108 },
    { x: 4050, y: 230, range: 90, speed: 112 },
    { x: 4400, y: 260, range: 90, speed: 115 },
    { x: 4750, y: 240, range: 90, speed: 120 },
    { x: 5100, y: 230, range: 90, speed: 123 },
    { x: 5350, y: 260, range: 90, speed: 126 },
  ],
  // Espinas.
  spikes: [
    { x: 700, y: 532 },
    { x: 1200, y: 532 },
    { x: 1490, y: 532 },
    { x: 1900, y: 532 },
    { x: 2400, y: 532 },
    { x: 2680, y: 532 },
    { x: 3100, y: 532 },
    { x: 3350, y: 532 },
    { x: 3700, y: 532 },
    { x: 3980, y: 532 },
    { x: 4300, y: 532 },
    { x: 4600, y: 532 },
    { x: 4900, y: 532 },
    { x: 5200, y: 532 },
  ],
  // Moscas inofensivas.
  flies: [
    { x: 750, y: 380, range: 40 },
    { x: 1000, y: 330, range: 40 },
    { x: 1350, y: 360, range: 40 },
    { x: 1540, y: 320, range: 40 },
    { x: 1950, y: 370, range: 40 },
    { x: 2150, y: 330, range: 40 },
    { x: 2450, y: 360, range: 40 },
    { x: 2700, y: 320, range: 40 },
    { x: 3050, y: 370, range: 40 },
    { x: 3300, y: 330, range: 40 },
    { x: 3600, y: 360, range: 40 },
    { x: 3850, y: 320, range: 40 },
    { x: 4100, y: 370, range: 40 },
    { x: 4350, y: 330, range: 40 },
    { x: 4600, y: 360, range: 40 },
    { x: 4850, y: 320, range: 40 },
    { x: 5150, y: 360, range: 40 },
    { x: 5400, y: 330, range: 40 },
  ],
  // Mariposas (+25 c/u).
  butterflies: [
    { x: 250, y: 390 },
    { x: 420, y: 470 },
    { x: 720, y: 380 },
    { x: 980, y: 300 },
    { x: 1300, y: 380 },
    { x: 1480, y: 290 },
    { x: 1620, y: 470 },
    { x: 1900, y: 370 },
    { x: 2080, y: 280 },
    { x: 2210, y: 470 },
    { x: 2400, y: 380 },
    { x: 2600, y: 300 },
    { x: 2800, y: 470 },
    { x: 3000, y: 370 },
    { x: 3200, y: 280 },
    { x: 3400, y: 470 },
    { x: 3600, y: 380 },
    { x: 3800, y: 300 },
    { x: 4000, y: 470 },
    { x: 4200, y: 370 },
    { x: 4400, y: 280 },
    { x: 4600, y: 470 },
    { x: 4850, y: 380 },
    { x: 5050, y: 300 },
    { x: 5250, y: 470 },
    { x: 5450, y: 380 },
  ],
  cacti: [],
  // Barro.
  muds: [
    { x: 150, y: 538, w: 110 },
    { x: 1260, y: 538, w: 130 },
    { x: 1770, y: 538, w: 90 },
    { x: 2400, y: 538, w: 130 },
    { x: 3000, y: 538, w: 120 },
    { x: 3600, y: 538, w: 130 },
    { x: 4200, y: 538, w: 120 },
    { x: 4700, y: 538, w: 110 },
    { x: 5200, y: 538, w: 120 },
  ],
  // Troncos.
  logs: [
    { x: 980, y: 532, w: 72 },
    { x: 1400, y: 532, w: 72 },
    { x: 2050, y: 532, w: 72 },
    { x: 2600, y: 532, w: 72 },
    { x: 3200, y: 532, w: 72 },
    { x: 3800, y: 532, w: 72 },
    { x: 4400, y: 532, w: 72 },
    { x: 5000, y: 532, w: 72 },
  ],
  // Anclas: una por pozo (8), a altura media-alta, separadas. Algunas
  // adicionales cerca de plataformas muy altas para alcanzarlas con la cuerda.
  anchors: [
    { x: 570, y: 260 },
    { x: 1100, y: 260 },
    { x: 1690, y: 260 },
    { x: 2290, y: 260 },
    { x: 2900, y: 260 },
    { x: 3520, y: 260 },
    { x: 4140, y: 260 },
    { x: 4760, y: 260 },
    // anclajes extra cerca de plataformas muy altas
    { x: 760, y: 160 },
    { x: 1380, y: 160 },
    { x: 1980, y: 160 },
    { x: 2580, y: 160 },
    { x: 3180, y: 160 },
    { x: 3810, y: 160 },
    { x: 4430, y: 160 },
    { x: 5050, y: 160 },
  ],
  goal: { x: 5400, y: 520 },
  worldWidth: 5500,
};
