import p5 from 'p5';
import * as Matter from 'matter-js';

// Matter.js engine and world
let engine: Matter.Engine;
let world: Matter.World;

// Wheel
let rearWheel: Matter.Body;
let frontWheel: Matter.Body;
let bikeBody: Matter.Body;
let rearAxle: Matter.Constraint;
let frontAxle: Matter.Constraint;
let rider: Matter.Body;
let riderConstraint: Matter.Constraint;

// Ground segments
let ground: Matter.Body;

// Controls
let throttle = 0; // -1 for reverse, 0 for off, 1 for forward
let lean = 0;
let shiftHeld = false;

export function setup(p: p5) {
  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = 1;

  // Create a single smooth ground rectangle
  ground = Matter.Bodies.rectangle(400, 390, 800, 40, {
    isStatic: true,
    friction: 0.7,
  });
  Matter.World.add(world, [ground]);

  // --- Collision filtering group for bike parts ---
  const bikeGroup = Matter.Body.nextGroup(true);

  // Place wheels and body above the ground, not overlapping
  rearWheel = Matter.Bodies.circle(200, 330, 28, {
    mass: 3,
    friction: 0.7,
    collisionFilter: { group: bikeGroup },
  });
  frontWheel = Matter.Bodies.circle(270, 330, 28, {
    mass: 2,
    friction: 0.7,
    collisionFilter: { group: bikeGroup },
  });

  // Skinny rectangle (bike body) connecting the wheels
  bikeBody = Matter.Bodies.rectangle(235, 320, 120, 10, {
    mass: 3.5,
    collisionFilter: { group: bikeGroup },
  });
  (bikeBody as any).angularDamping = 0.4;

  // Rider rectangle (person)
  rider = Matter.Bodies.rectangle(235, 285, 20, 100, {
    mass: 1.0,
    collisionFilter: { group: bikeGroup },
  });
  (rider as any).angularDamping = 0.4;

  // Constraint to connect rider to bike body (pivot at seat)
  riderConstraint = Matter.Constraint.create({
    bodyA: rider,
    pointA: { x: 0, y: 20 }, // bottom center of the rider
    bodyB: bikeBody,
    pointB: { x: 0, y: -5 }, // top center of the bike body
    stiffness: 0.7,
    damping: 0.2,
    length: 0,
  });

  // Constraints (axles) to connect the body to the wheels, but allow free wheel rotation
  rearAxle = Matter.Constraint.create({
    bodyA: rearWheel,
    pointA: { x: 0, y: 0 },
    bodyB: bikeBody,
    pointB: { x: -60, y: 10 }, // left end of bike body, bottom
    stiffness: 0.8,
    damping: 0.25,
    length: 4,
  });
  frontAxle = Matter.Constraint.create({
    bodyA: frontWheel,
    pointA: { x: 0, y: 0 },
    bodyB: bikeBody,
    pointB: { x: 60, y: 10 }, // right end of bike body, bottom
    stiffness: 0.8,
    damping: 0.25,
    length: 4,
  });

  Matter.World.add(world, [
    rearWheel,
    frontWheel,
    bikeBody,
    rearAxle,
    frontAxle,
    rider,
    riderConstraint,
  ]);

  p.background(220);
}

export function update(p: p5) {
  Matter.Engine.update(engine, 1000 / 60);
  p.background(220);

  // Apply throttle to rear wheel
  if (throttle !== 0) {
    Matter.Body.setAngularVelocity(
      rearWheel,
      rearWheel.angularVelocity + 0.09 * throttle
    );
  }

  // Rider lean logic
  const maxLean = 0.61; // ~35 degrees in radians
  // Calculate rider's angle relative to bike body
  let relAngle = rider.angle - bikeBody.angle;
  // Normalize to [-PI, PI]
  relAngle = Math.atan2(Math.sin(relAngle), Math.cos(relAngle));

  if (lean !== 0) {
    // Only apply torque if within allowed lean range
    if (
      (lean === -1 && relAngle > -maxLean) ||
      (lean === 1 && relAngle < maxLean)
    ) {
      Matter.Body.setAngularVelocity(
        rider,
        rider.angularVelocity + 0.07 * lean
      );
    }
  } else {
    // Apply restoring torque to bring rider upright
    const k = 0.12; // spring constant for self-righting
    Matter.Body.setAngularVelocity(rider, rider.angularVelocity - k * relAngle);
  }

  // Draw ground
  drawBody(p, ground, '#888');

  // Draw bike body
  drawBody(p, bikeBody, '#1976d2');
  // Draw rider
  drawBody(p, rider, '#8d5524');
  drawConstraint(p, riderConstraint, '#aaa');
  // Draw wheels
  drawBody(p, rearWheel, '#222');
  drawBody(p, frontWheel, '#222');
  // Draw axles
  drawConstraint(p, rearAxle, '#aaa');
  drawConstraint(p, frontAxle, '#aaa');
}

function drawBody(p: p5, body: Matter.Body, color: string) {
  p.push();
  p.translate(body.position.x, body.position.y, 0);
  p.rotate(body.angle, 0);
  if ((body as any).circleRadius) {
    p.fill(color);
    p.ellipse(
      0,
      0,
      (body as any).circleRadius * 2,
      (body as any).circleRadius * 2
    );
    // Draw a spoke to visualize rotation
    p.stroke('#fff');
    p.strokeWeight(3);
    p.line(0, 0, (body as any).circleRadius, 0);
  } else {
    const verts = (body as any).vertices;
    p.fill(color);
    p.beginShape((p as any).BEGIN_SHAPE);
    for (let v of verts) {
      p.vertex(v.x - body.position.x, v.y - body.position.y);
    }
    p.endShape((p5 as any).CLOSE, 0);
  }
  p.pop();
}

function drawConstraint(p: p5, c: Matter.Constraint, color: string) {
  if (!c.bodyA || !c.bodyB) return;
  const posA = Matter.Vector.add(c.bodyA.position, c.pointA || { x: 0, y: 0 });
  const posB = Matter.Vector.add(c.bodyB.position, c.pointB || { x: 0, y: 0 });
  p.stroke(color);
  p.strokeWeight(3);
  p.line(posA.x, posA.y, posB.x, posB.y);
}

// Keyboard controls
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') shiftHeld = true;
    if (e.code === 'Space') {
      throttle = shiftHeld ? -1 : 1;
    }
    if (e.code === 'ArrowLeft') lean = -1;
    if (e.code === 'ArrowRight') lean = 1;
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') shiftHeld = false;
    if (e.code === 'Space') throttle = 0;
    if (e.code === 'ArrowLeft' && lean === -1) lean = 0;
    if (e.code === 'ArrowRight' && lean === 1) lean = 0;
  });
}
