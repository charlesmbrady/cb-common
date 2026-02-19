import { CAR_CONFIG } from '../../config.js';
import { Controls } from '../controls.js';
import { attachKeyboardControls } from '../keyboardControls.js';
import { Sensor } from '../sensor.js';
import { getRandomColor } from '../../utils/colors.js';
import { applyBrainOutputs, createBrain } from './brain.js';
import { updatePhysics } from './physics.js';
import { renderCar, tintCarMask } from './render.js';

export class Car {
  constructor(
    x,
    y,
    width = CAR_CONFIG.width,
    height = CAR_CONFIG.height,
    controlType,
    maxSpeed = CAR_CONFIG.maxSpeed,
    color = getRandomColor()
  ) {
    this.id = Car.nextId++;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controlType = controlType;
    this.maxSpeed = maxSpeed;
    this.speed = 0;
    this.acceleration = CAR_CONFIG.acceleration;
    this.friction = CAR_CONFIG.friction;
    this.turnRate = CAR_CONFIG.angleStep;
    this.angle = 0;
    this.damaged = false;
    this.carsPassed = 0;
    this.passedTrafficIds = new Set();

    this.useBrain = controlType === 'AI';

    this.controls = new Controls();
    this.controlCleanup = this.#setupControls(controlType);

    if (controlType !== 'DUMMY') {
      this.sensor = new Sensor(this);
      this.brain = createBrain(this.sensor.rayCount);
    }

    this.img = new Image();
    this.img.src = './assets/self-driving-car-blue.png';
    this.mask = document.createElement('canvas');
    this.mask.width = width;
    this.mask.height = height;

    this.currentMaskColor = null;
    this.baseColor = color;
    this.img.onload = () => {
      tintCarMask(this, this.baseColor);
    };
  }

  static nextId = 1;

  update(roadBorders, traffic) {
    const wasDamaged = this.damaged;
    if (!this.damaged) {
      updatePhysics(this, this.controls, roadBorders, traffic);
    }

    if (!wasDamaged && this.damaged && this.img.complete) {
      tintCarMask(this, 'red');
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      if (this.useBrain) {
        applyBrainOutputs(this.sensor, this.brain, this.controls);
      }
    }
  }

  draw(ctx, drawSensor = false) {
    renderCar(ctx, this, drawSensor);
  }

  setControlMode(mode) {
    if (mode === this.controlType) return;
    if (this.controlCleanup) {
      this.controlCleanup();
      this.controlCleanup = null;
    }

    // reset control inputs to avoid sticky keys
    this.controls.forward = false;
    this.controls.left = false;
    this.controls.right = false;
    this.controls.reverse = false;

    this.controlType = mode;
    this.useBrain = mode === 'AI';
    this.controlCleanup = this.#setupControls(mode);
  }

  dispose() {
    if (this.controlCleanup) {
      this.controlCleanup();
      this.controlCleanup = null;
    }
  }

  #setupControls(controlType) {
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
}
