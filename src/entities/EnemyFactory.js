import Crab from './Crab.js';
import Hedgehog from './Hedgehog.js';

export default class EnemyFactory {
  static create(scene, { type, x, y, minX, maxX }) {
    if (type === 'crab') return new Crab(scene, x, y, { minX, maxX });
    if (type === 'hedgehog') return new Hedgehog(scene, x, y, { minX, maxX });
    throw new Error(`Enemigo desconocido: ${type}`);
  }
}
