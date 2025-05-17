import * as Matter from 'matter-js';

export interface UnitOptions {
  radius: number;
  mass: number;
  frictionStatic: number;
  frictionKinetic: number;
  position: { x: number; y: number };
  isPlayer?: boolean;
  color?: string;
}

export class Unit {
  body: Matter.Body;
  isPlayer: boolean;
  color: string;
  frictionStatic: number;
  frictionKinetic: number;

  constructor(world: Matter.World, opts: UnitOptions) {
    this.body = Matter.Bodies.circle(
      opts.position.x,
      opts.position.y,
      opts.radius,
      {
        mass: opts.mass,
        friction: opts.frictionKinetic,
        frictionStatic: opts.frictionStatic,
        frictionAir: 0.01,
        restitution: 0.2,
        label: opts.isPlayer ? 'player' : 'npc',
      }
    );
    this.isPlayer = !!opts.isPlayer;
    this.color = opts.color || (this.isPlayer ? '#88c' : '#444');
    this.frictionStatic = opts.frictionStatic;
    this.frictionKinetic = opts.frictionKinetic;
    Matter.World.add(world, this.body);
  }

  applyForce(force: { x: number; y: number }) {
    Matter.Body.applyForce(this.body, this.body.position, force);
  }

  setVelocity(vel: { x: number; y: number }) {
    Matter.Body.setVelocity(this.body, vel);
  }

  get position() {
    return this.body.position;
  }

  get velocity() {
    return this.body.velocity;
  }
}
