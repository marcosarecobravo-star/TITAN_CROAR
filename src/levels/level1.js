// Nivel 1 — PANTANO. ~5500 px, 2 pozos, dificultad gradual.
// Inicio suave (tutorial), enemigos en plataformas altas para caminos alternativos.
// Recolectables limitados para ~3 vidas extra en total entre los 3 niveles.
export const LEVEL1 = {
  name: 'Pantano',
  spawn: { x: 60, y: 450 },
  bgImage: 'bgPantano',
  // 3 segmentos de suelo = 2 pozos.
  // Pozo A 1800–1900 | Pozo B 3700–3800
  grounds: [
    { x: 0, y: 560, w: 1800 },     // Z1+Z2 (tutorial/aprendizaje)
    { x: 1900, y: 560, w: 1800 },  // Z3+Z4 (tensión)
    { x: 3800, y: 560, w: 1700 },  // Z5 (final)
  ],
  // Plataformas: 2 por zona (baja + alta) para caminos alternativos.
  platforms: [
    // Z1
    { x: 400, y: 440, w: 150 },
    { x: 700, y: 220, w: 130 },
    // Z2
    { x: 1200, y: 430, w: 150 },
    { x: 1500, y: 200, w: 130 },
    // Z3
    { x: 2200, y: 430, w: 150 },
    { x: 2500, y: 200, w: 130 },
    // Z4
    { x: 3000, y: 420, w: 150 },
    { x: 3300, y: 180, w: 130 },
    // Z5 (final)
    { x: 4200, y: 440, w: 150 },
    { x: 4500, y: 240, w: 130 },
    { x: 4900, y: 440, w: 120 },
  ],
  // Cangrejos: 4 (1 por zona, lentos en Z1-Z2).
  crabs: [
    { x: 700, y: 190, range: 40, speed: 35 },
    { x: 2200, range: 60, speed: 55 },
    { x: 3000, range: 50, speed: 65 },
    { x: 3200, y: 386, range: 40, speed: 75 },
    { x: 4500, range: 30, speed: 80 },
    { x: 4900, y: 396, range: 25, speed: 90 },
  ],
  // Erizos inmunes: 2 (Z3 y Z5).
  hedgehogs: [
    { x: 1550, y: 220, range: 90, speed: 35 },
    { x: 3000, y: 386, range: 30, speed: 50 },
    { x: 4200, range: 50, speed: 45 },
  ],
  // Avispas: 3 (Z2, Z4, Z5).
  wasps: [
    { x: 1200, y: 230, range: 90, speed: 60 },
    { x: 3000, y: 200, range: 90, speed: 75 },
    { x: 3300, y: 180, range: 80, speed: 80 },
    { x: 4500, y: 220, range: 90, speed: 85 },
  ],
  // Espinas: 4.
  spikes: [
    { x: 1300, y: 532 },
    { x: 2300, y: 532 },
    { x: 3100, y: 532 },
    { x: 4300, y: 532 },
  ],
  // Moscas inofensivas: 8.
  flies: [
    { x: 400, y: 380, range: 40 },
    { x: 700, y: 330, range: 40 },
    { x: 1200, y: 360, range: 40 },
    { x: 1500, y: 320, range: 40 },
    { x: 2200, y: 370, range: 40 },
    { x: 3000, y: 330, range: 40 },
    { x: 4200, y: 360, range: 40 },
    { x: 4500, y: 320, range: 40 },
  ],
  // Mariposas (+25 c/u): 10.
  butterflies: [
    { x: 250, y: 390 },
    { x: 420, y: 470 },
    { x: 720, y: 380 },
    { x: 980, y: 300 },
    { x: 1300, y: 380 },
    { x: 1620, y: 470 },
    { x: 2200, y: 370 },
    { x: 3000, y: 330 },
    { x: 4200, y: 370 },
    { x: 4500, y: 280 },
  ],
  cacti: [],
  // Barro: 3.
  muds: [
    { x: 150, y: 538, w: 110 },
    { x: 2400, y: 538, w: 130 },
    { x: 4200, y: 538, w: 120 },
  ],
  // Troncos: 2.
  logs: [
    { x: 1400, y: 532, w: 72 },
    { x: 3200, y: 532, w: 72 },
  ],
  // Anclas: 2 (uno por pozo) + 2 altos para plataformas ocultas.
  anchors: [
    { x: 1850, y: 260 },
    { x: 3750, y: 260 },
    { x: 470, y: 160 },
    { x: 1500, y: 160 },
  ],
  goal: { x: 5400, y: 520 },
  worldWidth: 5500,
  timeLimit: 300,
};
