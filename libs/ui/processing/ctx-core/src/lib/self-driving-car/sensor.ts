/* ------------------------------------------------------------------ */
/*  Sensor – ray-casting for obstacle detection                        */
/* ------------------------------------------------------------------ */

import { SDC_SENSOR_CONFIG } from './config';
import { lerp } from '../math';
import {
  getIntersection,
  type Intersection,
  type Point,
  type Segment,
} from '../geometry';

export interface SensorHost {
  x: number;
  y: number;
  angle: number;
}

export interface SensorReading extends Intersection {
  /* inherited x, y, offset */
}

export class Sensor {
  car: SensorHost;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: [Point, Point][];
  readings: (SensorReading | null)[];

  constructor(car: SensorHost) {
    this.car = car;
    this.rayCount = SDC_SENSOR_CONFIG.rayCount;
    this.rayLength = SDC_SENSOR_CONFIG.rayLength;
    this.raySpread = SDC_SENSOR_CONFIG.raySpread;
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: Segment[], traffic: { polygon: Point[] }[]): void {
    this.castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.getReading(this.rays[i], roadBorders, traffic));
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.rayCount; i++) {
      let end: Point = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i]!;
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  private getReading(
    ray: [Point, Point],
    roadBorders: Segment[],
    traffic: { polygon: Point[] }[]
  ): SensorReading | null {
    const touches: SensorReading[] = [];

    for (const border of roadBorders) {
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (touch) touches.push(touch);
    }

    for (const vehicle of traffic) {
      const poly = vehicle.polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) touches.push(value);
      }
    }

    if (touches.length === 0) return null;
    const offsets = touches.map((t) => t.offset);
    const minOffset = Math.min(...offsets);
    return touches.find((t) => t.offset === minOffset) ?? null;
  }

  private castRays(): void {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start: Point = { x: this.car.x, y: this.car.y };
      const end: Point = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }
}
