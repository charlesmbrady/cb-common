import { Unit, UnitOptions } from './unit';

export class WorldManager {
  units: Unit[] = [];

  addUnit(opts: UnitOptions): Unit {
    const unit = new Unit(opts);
    this.units.push(unit);
    return unit;
  }

  removeUnit(unit: Unit) {
    this.units = this.units.filter((u) => u !== unit);
  }

  update() {
    for (const unit of this.units) {
      unit.update();
    }
  }

  getUnits() {
    return this.units;
  }
}
