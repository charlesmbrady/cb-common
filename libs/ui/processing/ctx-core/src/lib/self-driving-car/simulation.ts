/* ------------------------------------------------------------------ */
/*  Self-Driving Car – simulation engine (framework-agnostic)          */
/* ------------------------------------------------------------------ */

import { SDC_CAR_CONFIG } from './config';
import { Car, type CarControlType } from './car';
import { Road } from './road';
import { NeuralNetwork, type NeuralNetworkData } from '../neural-network';
import {
  loadBestBrain,
  saveBestBrain as persistBrain,
  clearBestBrain as removeBrain,
  type SDCSettings,
  SDC_DEFAULT_SETTINGS,
} from './storage';

export interface TrafficBlueprint {
  lane: number;
  y: number;
}

const DEFAULT_TRAFFIC: TrafficBlueprint[] = [
  { lane: 0, y: -100 },
  { lane: 1, y: -110 },
  { lane: 2, y: -232 },
  { lane: 1, y: -300 },
  { lane: 0, y: -400 },
  { lane: 1, y: -500 },
  { lane: 2, y: -600 },
  { lane: 0, y: -700 },
  { lane: 1, y: -800 },
  { lane: 2, y: -900 },
  { lane: 0, y: -1000 },
  { lane: 1, y: -1010 },
  { lane: 2, y: -1320 },
  { lane: 1, y: -1410 },
];

/**
 * Encapsulates the entire self-driving car simulation state.
 * The React layer creates one instance and calls `tick()` / `render()`.
 */
export class SDCSimulation {
  road: Road;
  cars: Car[];
  traffic: Car[];
  bestCar: Car;
  settings: SDCSettings;

  manualMode = false;
  manualCar: Car | null = null;
  paused = false;

  trainingActive = false;
  trainingIterationsLeft = 0;
  trainingBrain: NeuralNetworkData | null = null;

  /** Shared car sprite — set via `loadCarImage()`. */
  carImage: HTMLImageElement | null = null;

  private trainingTimerId: ReturnType<typeof setTimeout> | null = null;
  private onTrainingStateChange?: (active: boolean) => void;

  constructor(
    canvasWidth: number,
    settings: SDCSettings = SDC_DEFAULT_SETTINGS,
    onTrainingStateChange?: (active: boolean) => void
  ) {
    this.settings = { ...settings };
    this.onTrainingStateChange = onTrainingStateChange;
    this.road = new Road(canvasWidth / 2, canvasWidth * 0.8);
    this.traffic = this.buildTraffic();
    this.cars = this.generateCars(this.settings.carCount);
    this.hydrateBrains();
    this.bestCar = this.cars[0];
  }

  /* ---------- Image loader --------------------------------------- */

  /**
   * Load (or reuse) the car sprite. Call once after construction.
   * The image is shared across all cars via `car.attachImage()`.
   */
  loadCarImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.carImage = img;
        [...this.cars, ...this.traffic].forEach((c) => c.attachImage(img));
        resolve(img);
      };
      // Fallback: if already cached
      if (img.complete) {
        this.carImage = img;
        [...this.cars, ...this.traffic].forEach((c) => c.attachImage(img));
        resolve(img);
      }
    });
  }

  /* ---------- Simulation tick ------------------------------------ */

  tick(): void {
    if (this.paused) return;
    for (const vehicle of this.traffic) vehicle.update(this.road.borders, []);
    for (const car of this.cars) car.update(this.road.borders, this.traffic);
    this.updatePassingStats();
    this.bestCar =
      this.manualMode && this.manualCar
        ? this.manualCar
        : this.getLeadCar() ?? this.cars[0];
  }

  /* ---------- Rendering ------------------------------------------ */

  renderCarCanvas(ctx: CanvasRenderingContext2D, canvasHeight: number): void {
    ctx.save();
    ctx.translate(
      0,
      -this.bestCar.y + canvasHeight * this.settings.followRatio
    );
    this.road.draw(ctx);
    for (const vehicle of this.traffic) vehicle.draw(ctx);

    ctx.globalAlpha = this.paused ? 0.3 : 0.2;
    for (const car of this.cars) car.draw(ctx);
    ctx.globalAlpha = 1;
    this.bestCar.draw(ctx, true);
    ctx.restore();

    // HUD
    this.drawHud(ctx);
  }

  /* ---------- Manual mode ---------------------------------------- */

  toggleManual(): boolean {
    this.setManualMode(!this.manualMode);
    return this.manualMode;
  }

  setManualMode(enabled: boolean): void {
    if (enabled) {
      this.manualMode = true;
      this.manualCar = this.bestCar;
      this.manualCar.setControlMode('KEYS');
    } else {
      this.manualMode = false;
      if (this.manualCar) this.manualCar.setControlMode('AI');
      this.manualCar = null;
    }
  }

  /* ---------- Reset ---------------------------------------------- */

  reset(opts: { preserveManual?: boolean } = {}): void {
    const { preserveManual = true } = opts;
    const wasManual = preserveManual ? this.manualMode : false;

    for (const car of this.cars) car.dispose();

    this.traffic = this.buildTraffic();
    this.cars = this.generateCars(this.settings.carCount);
    this.hydrateBrains();
    this.bestCar = this.cars[0];
    this.manualCar = null;
    this.manualMode = false;

    if (this.carImage) {
      [...this.cars, ...this.traffic].forEach((c) =>
        c.attachImage(this.carImage!)
      );
    }

    if (wasManual) this.setManualMode(true);
    else this.setManualMode(false);
  }

  /* ---------- Brain persistence ---------------------------------- */

  saveBrain(): void {
    persistBrain(this.bestCar.brain);
  }

  discardBrain(): void {
    this.trainingBrain = null;
    removeBrain();
  }

  /* ---------- Automated training --------------------------------- */

  toggleTraining(): boolean {
    if (this.trainingActive) {
      this.stopTraining();
    } else {
      this.startTraining();
    }
    return this.trainingActive;
  }

  startTraining(): void {
    this.trainingIterationsLeft = Math.max(1, this.settings.trainingIterations);
    this.trainingActive = true;
    this.paused = false;
    this.setManualMode(false);
    this.onTrainingStateChange?.(true);
    this.runTrainingCycle();
  }

  stopTraining(): void {
    this.trainingActive = false;
    this.trainingIterationsLeft = 0;
    if (this.trainingTimerId) {
      clearTimeout(this.trainingTimerId);
      this.trainingTimerId = null;
    }
    this.onTrainingStateChange?.(false);
  }

  /* ---------- Internals ------------------------------------------ */

  private runTrainingCycle(): void {
    if (!this.trainingActive || this.trainingIterationsLeft <= 0) {
      this.stopTraining();
      return;
    }
    this.reset({ preserveManual: false });
    const durationMs =
      Math.max(1, this.settings.trainingDurationSeconds) * 1000;

    if (this.trainingTimerId) clearTimeout(this.trainingTimerId);

    this.trainingTimerId = setTimeout(() => {
      this.captureBestBrain();
      this.trainingIterationsLeft -= 1;
      if (this.trainingIterationsLeft <= 0) {
        this.stopTraining();
        return;
      }
      this.runTrainingCycle();
    }, durationMs);
  }

  private captureBestBrain(): void {
    if (this.bestCar?.brain) {
      this.trainingBrain = NeuralNetwork.clone(this.bestCar.brain);
    }
  }

  private buildTraffic(
    blueprints: TrafficBlueprint[] = DEFAULT_TRAFFIC
  ): Car[] {
    return blueprints.map(
      ({ lane, y }) =>
        new Car(
          this.road.getLaneCenter(lane),
          y,
          SDC_CAR_CONFIG.width,
          SDC_CAR_CONFIG.height,
          'DUMMY',
          2
        )
    );
  }

  private generateCars(count: number): Car[] {
    const generated: Car[] = [];
    for (let i = 0; i < count; i++) {
      generated.push(
        new Car(
          this.road.getLaneCenter(1),
          100,
          SDC_CAR_CONFIG.width,
          SDC_CAR_CONFIG.height,
          'AI'
        )
      );
    }
    return generated;
  }

  private hydrateBrains(): void {
    const baseBrain = this.trainingBrain ?? loadBestBrain();
    if (!baseBrain) return;
    for (let i = 0; i < this.cars.length; i++) {
      this.cars[i].brain = NeuralNetwork.clone(baseBrain);
      if (i !== 0) {
        NeuralNetwork.mutate(this.cars[i].brain!, this.settings.mutationRate);
      }
    }
  }

  private getLeadCar(): Car | null {
    if (this.cars.length === 0) return null;
    return this.cars.reduce((lead, car) => {
      if (car.carsPassed !== lead.carsPassed) {
        return car.carsPassed > lead.carsPassed ? car : lead;
      }
      return car.y < lead.y ? car : lead;
    }, this.cars[0]);
  }

  private updatePassingStats(): void {
    for (const car of this.cars) {
      for (const trafficCar of this.traffic) {
        if (car.y < trafficCar.y && !car.passedTrafficIds.has(trafficCar.id)) {
          car.passedTrafficIds.add(trafficCar.id);
          car.carsPassed += 1;
        }
      }
    }
  }

  private drawHud(ctx: CanvasRenderingContext2D): void {
    if (!this.bestCar) return;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(8, 8, 190, 54);
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Best cars passed: ${this.bestCar.carsPassed}`, 16, 28);
    ctx.fillText(`Best y: ${this.bestCar.y.toFixed(1)}`, 16, 48);
    ctx.restore();
  }
}
