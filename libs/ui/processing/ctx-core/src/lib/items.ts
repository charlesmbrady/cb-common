export class Item {
  constructor(public name: string, public kind: 'utility' | 'firearm' = 'utility') {}
}

export class Firearm extends Item {
  private lastShotSeconds = 0;

  constructor(name: string, public roundsPerSecond = 6) {
    super(name, 'firearm');
  }

  canFire(nowSeconds: number) {
    return nowSeconds - this.lastShotSeconds >= 1 / this.roundsPerSecond;
  }

  markFired(nowSeconds: number) {
    this.lastShotSeconds = nowSeconds;
  }
}
