// Nivel 1 — PANTANO. Nivel ÚNICO y largo (~2240 px, ~2x el original de 1120),
// decisión del usuario (19/10/2026): un solo nivel con dificultad creciente
// por POSICIÓN (de izquierda a derecha), en 4 zonas:
//   Z1 (0–500)    Tutorial: suelo llano, 1 cangrejo lento, barro. Enseña a moverse.
//   Z2 (500–1100) Aprendizaje: pozo estrecho, espinas, erizo, 1 avispa, tronco.
//   Z3 (1100–1700) Tensión: pozo más ancho, 2 cangrejos rápidos, 2 avispas,
//                  barro, más espinas y tronco.
//   Z4 (1700–2240) Final: pozo ancho, barro, espinas, erizo, cangrejo, avispa
//                  y aproximación a la bandera.
// Obstáculos según Docs/GDD_TC.docx, sección "NIVEL 1: PANTANO": barro, pozos,
// espinas y tronco. Sin cactus (no listado en Pantano; brecha corregida).
// Enemigos según la misma sección: cangrejo, avispa y erizo. Sin águila jefe
// (decisión usuario: el nivel acaba en la bandera).
// Supuesto: posiciones propias porque el GDD no define layout.
export const LEVEL1 = {
  name: 'Pantano',
  spawn: { x: 60, y: 450 },
  bgImage: 'bgPantano', // PNG real en public/ (decisión del usuario).
  // Segmentos de suelo (el hueco entre ellos es el pozo).
  // Pozo A 540–600 (60px, estrecho) | B 1060–1140 (80px) | C 1640–1740 (100px, ancho)
  grounds: [
    { x: 0, y: 560, w: 540 },     // Z1
    { x: 600, y: 560, w: 460 },   // Z2
    { x: 1140, y: 560, w: 500 },  // Z3
    { x: 1740, y: 560, w: 500 },  // Z4
  ],
  platforms: [
    { x: 260, y: 440, w: 140 },   // Z1 (tutorial)
    { x: 700, y: 430, w: 140 },   // Z2
    { x: 900, y: 350, w: 140 },   // Z2 (alta)
    { x: 1250, y: 430, w: 150 },  // Z3
    { x: 1450, y: 340, w: 150 },  // Z3 (alta)
    { x: 1850, y: 420, w: 150 },  // Z4
    { x: 2050, y: 330, w: 150 },  // Z4 (alta)
  ],
  // Cangrejos: 1 lento (Z1) -> 3 más rápidos (Z3/Z4). Dificultad creciente.
  crabs: [
    { x: 350, range: 80, speed: 40 },   // Z1 fácil
    { x: 1300, range: 60, speed: 70 },  // Z3
    { x: 1560, range: 50, speed: 75 },  // Z3
    { x: 2150, range: 25, speed: 85 },  // Z4 (guarda la bandera)
  ],
  // Erizos inmunes: 1 aliviado (Z2) -> 1 más rápido (Z4).
  hedgehogs: [
    { x: 800, range: 60, speed: 35 },   // Z2
    { x: 1980, range: 40, speed: 45 },  // Z4
  ],
  // Avispas: 1 (Z2) -> 2 (Z3) -> 1 (Z4). Más rápidas hacia la derecha.
  wasps: [
    { x: 950, y: 240, range: 90, speed: 65 },    // Z2
    { x: 1250, y: 230, range: 100, speed: 80 },  // Z3
    { x: 1550, y: 260, range: 80, speed: 75 },   // Z3
    { x: 2120, y: 240, range: 90, speed: 85 },   // Z4
  ],
  // Espinas (sobre el piso): 1 en Z2 -> 2 en Z3 -> 1 en Z4.
  spikes: [
    { x: 700, y: 532 },   // Z2
    { x: 1200, y: 532 },  // Z3
    { x: 1490, y: 532 },  // Z3
    { x: 1900, y: 532 },  // Z4
  ],
  // Moscas inofensivas (capturables con lengua). Supuesto: layout propio.
  flies: [
    { x: 750, y: 380, range: 40 },   // Z2
    { x: 1000, y: 330, range: 40 },  // Z2
    { x: 1350, y: 360, range: 40 },  // Z3
    { x: 1540, y: 320, range: 40 },  // Z3
    { x: 1950, y: 370, range: 40 },  // Z4
    { x: 2150, y: 330, range: 40 },  // Z4
  ],
  // Mariposas (suman puntos al pasar). Supuesto: +25 c/u.
  butterflies: [
    { x: 250, y: 390 },   // Z1
    { x: 420, y: 470 },   // Z1
    { x: 720, y: 380 },   // Z2
    { x: 980, y: 300 },   // Z2
    { x: 1300, y: 380 },  // Z3
    { x: 1480, y: 290 },  // Z3
    { x: 1620, y: 470 },  // Z3
    { x: 1900, y: 370 },  // Z4
    { x: 2080, y: 280 },  // Z4
    { x: 2210, y: 470 },  // Z4
  ],
  // Sin cactus en Pantano (GDD no lo lista en este nivel).
  cacti: [],
  // Barro (GDD: reduce la velocidad temporalmente): 1 en Z1 -> Z3 -> Z4.
  muds: [
    { x: 150, y: 538, w: 110 },   // Z1 (tutorial suave)
    { x: 1260, y: 538, w: 130 },  // Z3
    { x: 1770, y: 538, w: 90 },   // Z4
  ],
  // Tronco (GDD Obstáculos: "Se interpone en el camino"; sólido y saltable,
  // sin daño). x = esquina izquierda. 1 por zona a partir de Z2.
  logs: [
    { x: 980, y: 532, w: 72 },   // Z2
    { x: 1400, y: 532, w: 72 },  // Z3
    { x: 2050, y: 532, w: 72 },  // Z4
  ],
  // Anclas de la lengua-cuerda: una sobre cada pozo (cruzar balanceándose).
  anchors: [
    { x: 570, y: 300 },   // Pozo A
    { x: 1100, y: 300 },  // Pozo B
    { x: 1690, y: 300 },  // Pozo C
  ],
  goal: { x: 2200, y: 520 },
  worldWidth: 2240,
};
