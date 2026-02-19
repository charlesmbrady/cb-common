import { polysIntersect } from '../../utils/geometry.js';

export function updatePhysics(car, controls, roadBorders, traffic) {
  applyMovement(car, controls);
  car.polygon = createPolygon(car);
  car.damaged = assessDamage(car.polygon, roadBorders, traffic);
  return car.damaged;
}

function applyMovement(car, controls) {
  if (controls.forward) {
    car.speed += car.acceleration;
  }
  if (controls.reverse) {
    car.speed -= car.acceleration;
  }
  if (car.speed > car.maxSpeed) {
    car.speed = car.maxSpeed;
  }
  if (car.speed < -car.maxSpeed / 2) {
    car.speed = -car.maxSpeed / 2;
  }

  if (car.speed > 0) {
    car.speed -= car.friction;
  }
  if (car.speed < 0) {
    car.speed += car.friction;
  }
  if (Math.abs(car.speed) < car.friction) {
    car.speed = 0;
  }

  if (car.speed !== 0) {
    const flip = car.speed > 0 ? 1 : -1;
    if (controls.left) {
      car.angle += car.turnRate * flip;
    }
    if (controls.right) {
      car.angle -= car.turnRate * flip;
    }
  }

  car.x -= Math.sin(car.angle) * car.speed;
  car.y -= Math.cos(car.angle) * car.speed;
}

function createPolygon(car) {
  const points = [];
  const rad = Math.hypot(car.width, car.height) / 2;
  const alpha = Math.atan2(car.width, car.height);
  points.push({
    x: car.x - Math.sin(car.angle - alpha) * rad,
    y: car.y - Math.cos(car.angle - alpha) * rad,
  });

  points.push({
    x: car.x - Math.sin(car.angle + alpha) * rad,
    y: car.y - Math.cos(car.angle + alpha) * rad,
  });

  points.push({
    x: car.x - Math.sin(Math.PI + car.angle - alpha) * rad,
    y: car.y - Math.cos(Math.PI + car.angle - alpha) * rad,
  });

  points.push({
    x: car.x - Math.sin(Math.PI + car.angle + alpha) * rad,
    y: car.y - Math.cos(Math.PI + car.angle + alpha) * rad,
  });

  return points;
}

function assessDamage(polygon, roadBorders, traffic) {
  for (let i = 0; i < roadBorders.length; i++) {
    if (polysIntersect(polygon, roadBorders[i])) {
      return true;
    }
  }

  for (let i = 0; i < traffic.length; i++) {
    if (polysIntersect(polygon, traffic[i].polygon)) {
      return true;
    }
  }
  return false;
}
