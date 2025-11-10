export interface UnitOptions {
  radius: number;
  mass: number;
  friction: number;
  position: { x: number; y: number };
  velocity?: { x: number; y: number };
  color?: string;
}

export class Unit {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number } = { x: 0, y: 0 };
  mass: number;
  friction: number;
  radius: number;
  color: string;

  constructor(opts: UnitOptions) {
    this.position = { ...opts.position };
    this.velocity = opts.velocity ? { ...opts.velocity } : { x: 0, y: 0 };
    this.mass = opts.mass;
    this.friction = opts.friction;
    this.radius = opts.radius;
    this.color = opts.color || '#888';
  }

  applyForce(force: { x: number; y: number }) {
    // F = m * a => a = F / m
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
  }

  update() {
    // Apply friction (simple linear)
    this.velocity.x *= 1 - this.friction;
    this.velocity.y *= 1 - this.friction;
    // Integrate acceleration
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // Reset acceleration
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }
}
