/* ------------------------------------------------------------------ */
/*  Car – main entity: physics, brain, sensor, rendering               */
/* ------------------------------------------------------------------ */

import { SDC_CAR_CONFIG } from './config';
import {
  createControls,
  resetControls,
  attachKeyboardControls,
  type ControlState,
} from './controls';
import { Sensor } from './sensor';
import { NeuralNetwork, type NeuralNetworkData } from '../neural-network';
import { polysIntersect, type Point, type Segment } from '../geometry';
import { getRandomColor } from '../colors';

export type CarControlType = 'AI' | 'KEYS' | 'DUMMY';

let nextCarId = 1;

export class Car {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  controlType: CarControlType;
  maxSpeed: number;
  speed: number;
  acceleration: number;
  friction: number;
  turnRate: number;
  angle: number;
  damaged: boolean;
  carsPassed: number;
  passedTrafficIds: Set<number>;
  useBrain: boolean;
  controls: ControlState;
  sensor: Sensor | null;
  brain: NeuralNetworkData | null;
  polygon: Point[];
  baseColor: string;

  private controlCleanup: (() => void) | null = null;

  /* ---------- Image / mask – set up by the React layer ----------- */
  img: HTMLImageElement | null = null;
  mask: HTMLCanvasElement | null = null;
  currentMaskColor: string | null = null;

  constructor(
    x: number,
    y: number,
    width = SDC_CAR_CONFIG.width,
    height = SDC_CAR_CONFIG.height,
    controlType: CarControlType = 'AI',
    maxSpeed = SDC_CAR_CONFIG.maxSpeed,
    color: string = getRandomColor()
  ) {
    this.id = nextCarId++;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controlType = controlType;
    this.maxSpeed = maxSpeed;
    this.speed = 0;
    this.acceleration = SDC_CAR_CONFIG.acceleration;
    this.friction = SDC_CAR_CONFIG.friction;
    this.turnRate = SDC_CAR_CONFIG.angleStep;
    this.angle = 0;
    this.damaged = false;
    this.carsPassed = 0;
    this.passedTrafficIds = new Set();
    this.useBrain = controlType === 'AI';
    this.controls = createControls();
    this.polygon = [];
    this.baseColor = color;

    this.controlCleanup = this.setupControlMode(controlType);

    if (controlType !== 'DUMMY') {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    } else {
      this.sensor = null;
      this.brain = null;
    }
  }

  /* ---------- Lifecycle ------------------------------------------ */

  update(roadBorders: Segment[], traffic: Car[]): void {
    const wasDamaged = this.damaged;
    if (!this.damaged) {
      this.applyPhysics(roadBorders, traffic);
    }
    if (!wasDamaged && this.damaged) {
      this.tintMask('red');
    }
    if (this.sensor) {
      this.sensor.update(
        roadBorders,
        traffic.map((t) => ({ polygon: t.polygon }))
      );
      if (this.useBrain && this.brain) {
        const offsets = this.sensor.readings.map((r) =>
          r == null ? 0 : 1 - r.offset
        );
        const outputs = NeuralNetwork.feedForward(offsets, this.brain);
        this.controls.forward = Boolean(outputs[0]);
        this.controls.left = Boolean(outputs[1]);
        this.controls.right = Boolean(outputs[2]);
        this.controls.reverse = Boolean(outputs[3]);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, drawSensor = false): void {
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    if (this.img) {
      if ((this.damaged || this.controlType === 'DUMMY') && this.mask) {
        ctx.drawImage(
          this.mask,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
        ctx.globalCompositeOperation = 'multiply';
      }
      ctx.drawImage(
        this.img,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      // Fallback: coloured rectangle
      ctx.fillStyle = this.damaged ? 'gray' : this.baseColor;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    ctx.restore();
  }

  /* ---------- Control mode --------------------------------------- */

  setControlMode(mode: CarControlType): void {
    if (mode === this.controlType) return;
    if (this.controlCleanup) {
      this.controlCleanup();
      this.controlCleanup = null;
    }
    resetControls(this.controls);
    this.controlType = mode;
    this.useBrain = mode === 'AI';
    this.controlCleanup = this.setupControlMode(mode);
  }

  dispose(): void {
    if (this.controlCleanup) {
      this.controlCleanup();
      this.controlCleanup = null;
    }
  }

  /* ---------- Image helpers -------------------------------------- */

  /**
   * Call once from the React layer after creating the shared Image.
   */
  attachImage(img: HTMLImageElement, color?: string): void {
    this.img = img;
    this.mask = document.createElement('canvas');
    this.mask.width = this.width;
    this.mask.height = this.height;
    if (img.complete) {
      this.tintMask(color ?? this.baseColor);
    } else {
      img.addEventListener(
        'load',
        () => this.tintMask(color ?? this.baseColor),
        { once: true }
      );
    }
  }

  tintMask(color: string): void {
    if (!this.mask || !this.img) return;
    const maskCtx = this.mask.getContext('2d');
    if (!maskCtx) return;
    maskCtx.globalCompositeOperation = 'source-over';
    maskCtx.clearRect(0, 0, this.mask.width, this.mask.height);
    maskCtx.fillStyle = color;
    maskCtx.fillRect(0, 0, this.mask.width, this.mask.height);
    maskCtx.globalCompositeOperation = 'destination-atop';
    maskCtx.drawImage(this.img, 0, 0, this.mask.width, this.mask.height);
    this.currentMaskColor = color;
  }

  /* ---------- Internal ------------------------------------------- */

  private setupControlMode(controlType: CarControlType): (() => void) | null {
    switch (controlType) {
      case 'KEYS':
        return attachKeyboardControls(this.controls);
      case 'DUMMY':
        this.controls.forward = true;
        return null;
      default:
        return null;
    }
  }

  private applyPhysics(roadBorders: Segment[], traffic: Car[]): void {
    const c = this.controls;
    if (c.forward) this.speed += this.acceleration;
    if (c.reverse) this.speed -= this.acceleration;
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;
    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;
    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (c.left) this.angle += this.turnRate * flip;
      if (c.right) this.angle -= this.turnRate * flip;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;

    this.polygon = this.createPolygon();
    this.damaged = this.assessDamage(roadBorders, traffic);
  }

  private createPolygon(): Point[] {
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    return [
      {
        x: this.x - Math.sin(this.angle - alpha) * rad,
        y: this.y - Math.cos(this.angle - alpha) * rad,
      },
      {
        x: this.x - Math.sin(this.angle + alpha) * rad,
        y: this.y - Math.cos(this.angle + alpha) * rad,
      },
      {
        x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
        y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
      },
      {
        x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
        y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
      },
    ];
  }

  private assessDamage(roadBorders: Segment[], traffic: Car[]): boolean {
    for (const border of roadBorders) {
      if (polysIntersect(this.polygon, [border[0], border[1]])) return true;
    }
    for (const vehicle of traffic) {
      if (vehicle.polygon && polysIntersect(this.polygon, vehicle.polygon)) {
        return true;
      }
    }
    return false;
  }
}
