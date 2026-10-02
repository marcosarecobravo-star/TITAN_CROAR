import Crab from '../entities/Crab.js';
import Hedgehog from '../entities/Hedgehog.js';
import Wasp from '../entities/Wasp.js';

// Patrón Factory: crea enemigos/obstáculos desde LevelConfig sin que la
// Scene conozca las clases concretas.
export default class EntityFactory {
  static createEnemies(scene, config) {
    const list = [];
    for (const c of config.crabs ?? []) {
      list.push(new Crab(scene, c.x, 520, {
        patrolMin: c.x - c.range,
        patrolMax: c.x + c.range,
        speed: c.speed,
      }));
    }
    for (const h of config.hedgehogs ?? []) {
      list.push(new Hedgehog(scene, h.x, 520, {
        patrolMin: h.x - h.range,
        patrolMax: h.x + h.range,
        speed: h.speed,
      }));
    }
    for (const w of config.wasps ?? []) {
      list.push(new Wasp(scene, w.x, w.y, {
        patrolMin: w.x - w.range,
        patrolMax: w.x + w.range,
        speed: w.speed,
      }));
    }
    return list;
  }

  static createStaticRect(scene, group, x, y, texture, w, h) {
    const obj = group.create(x, y, texture);
    obj.setDisplaySize(w, h);
    obj.refreshBody();
    return obj;
  }
}
