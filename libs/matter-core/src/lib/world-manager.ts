import * as Matter from 'matter-js';
import { Unit, UnitOptions } from './unit';

export class WorldManager {
  engine: Matter.Engine;
  world: Matter.World;
  units: Unit[] = [];

  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    // Top-down: no gravity
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;
  }

  addUnit(opts: UnitOptions): Unit {
    const unit = new Unit(this.world, opts);
    this.units.push(unit);
    return unit;
  }

  removeUnit(unit: Unit) {
    Matter.World.remove(this.world, unit.body);
    this.units = this.units.filter((u) => u !== unit);
  }

  update() {
    Matter.Engine.update(this.engine);
    // Optionally, handle custom logic here (AI, friction, etc.)
  }

  getUnits() {
    return this.units;
  }
}
