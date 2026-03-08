/* ------------------------------------------------------------------ */
/*  Self-Driving Car 3D – simulation engine                            */
/*  Orchestrates 3D scene, collision, cars, training loop.             */
/*  No ammo.js – uses lightweight CollisionWorld (AABB + Raycaster).   */
/* ------------------------------------------------------------------ */

import * as THREE from 'three';
import { SDC3D_CAR_CONFIG, SDC3D_SIM_CONFIG } from './config';
import { Car3D, type CarControlType3D } from './car3d';
import { Road3D } from './road3d';
import { CollisionWorld } from '../collision-world';
import {
  NeuralNetwork,
  type NeuralNetworkData,
} from '../neural-network';
import {
  loadBestBrain3D,
  saveBestBrain3D,
  clearBestBrain3D,
  type SDC3DSettings,
  SDC3D_DEFAULT_SETTINGS,
} from './storage3d';

export interface TrafficBlueprint3D {
  lane: number;
  z: number;
}

const DEFAULT_TRAFFIC: TrafficBlueprint3D[] = [
  { lane: 0, z: -20 },
  { lane: 1, z: -25 },
  { lane: 2, z: -45 },
  { lane: 1, z: -65 },
  { lane: 0, z: -90 },
  { lane: 2, z: -110 },
  { lane: 1, z: -130 },
  { lane: 0, z: -155 },
  { lane: 2, z: -180 },
  { lane: 1, z: -210 },
  { lane: 0, z: -240 },
  { lane: 1, z: -245 },
  { lane: 2, z: -280 },
  { lane: 0, z: -320 },
  { lane: 1, z: -360 },
  { lane: 2, z: -400 },
  { lane: 0, z: -440 },
  { lane: 1, z: -480 },
];

/**
 * Encapsulates the full 3D self-driving car simulation.
 * The React layer creates one instance and calls `tick(dt)`.
 */
export class SDCSimulation3D {
  scene: THREE.Scene;
  road: Road3D;
  cars: Car3D[];
  traffic: Car3D[];
  bestCar: Car3D;
  settings: SDC3DSettings;
  collisionWorld: CollisionWorld;

  manualMode = false;
  manualCar: Car3D | null = null;
  paused = false;

  trainingActive = false;
  trainingIterationsLeft = 0;
  trainingBrain: NeuralNetworkData | null = null;

  private sensorGroup: THREE.Group;
  private onTrainingStateChange?: (active: boolean) => void;
  private trainingTimerId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    scene: THREE.Scene,
    settings: SDC3DSettings = SDC3D_DEFAULT_SETTINGS,
    onTrainingStateChange?: (active: boolean) => void
  ) {
    this.scene = scene;
    this.settings = { ...settings };
    this.onTrainingStateChange = onTrainingStateChange;

    // Collision world (replaces ammo physics)
    this.collisionWorld = new CollisionWorld();

    // Road
    this.road = new Road3D(this.collisionWorld);
    scene.add(this.road.group);

    // Sensor group (togglable visibility)
    this.sensorGroup = new THREE.Group();
    this.sensorGroup.visible = settings.showSensors;
    scene.add(this.sensorGroup);

    // Traffic
    this.traffic = this.buildTraffic();
    for (const car of this.traffic) {
      scene.add(car.mesh);
      car.registerCollision(this.collisionWorld);
    }

    // AI cars
    this.cars = this.generateCars(this.settings.carCount);
    this.hydrateBrains();
    for (const car of this.cars) {
      scene.add(car.mesh);
      car.registerCollision(this.collisionWorld);
      if (car.sensor) {
        this.sensorGroup.add(car.sensor.rayLines);
      }
    }

    this.bestCar = this.cars[0];
    this.updateVisibility();
  }

  /* ---------- Setup helpers -------------------------------------- */

  setupLighting(scene: THREE.Scene): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(30, 50, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    scene.add(sun);

    // Sky-like background
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 100, 400);
  }

  setupCamera(camera: THREE.PerspectiveCamera): void {
    camera.position.set(
      0,
      SDC3D_SIM_CONFIG.followHeight,
      SDC3D_SIM_CONFIG.followDistance
    );
    camera.lookAt(0, 0, 0);
  }

  /* ---------- Simulation tick ------------------------------------ */

  tick(dt: number): void {
    if (this.paused) return;

    // Clamp dt to prevent huge jumps
    const clampedDt = Math.min(dt, 0.05);

    // Update traffic
    for (const car of this.traffic) {
      car.update(clampedDt, this.collisionWorld);
    }

    // Update AI cars
    for (const car of this.cars) {
      if (!car.damaged) {
        car.update(clampedDt, this.collisionWorld);
        car.checkCollision(this.collisionWorld);
      }
    }

    // Update passing stats
    this.updatePassingStats();

    // Update best car
    this.bestCar =
      this.manualMode && this.manualCar
        ? this.manualCar
        : this.getLeadCar() ?? this.cars[0];

    this.updateVisibility();
  }

  /* ---------- Camera follow -------------------------------------- */

  updateCamera(camera: THREE.PerspectiveCamera, dt: number): void {
    const target = this.bestCar;
    const lerpSpeed = SDC3D_SIM_CONFIG.cameraLerpSpeed * dt;

    const idealX = target.x;
    const idealY = SDC3D_SIM_CONFIG.followHeight;
    const idealZ = target.z + SDC3D_SIM_CONFIG.followDistance;

    camera.position.x += (idealX - camera.position.x) * lerpSpeed;
    camera.position.y += (idealY - camera.position.y) * lerpSpeed;
    camera.position.z += (idealZ - camera.position.z) * lerpSpeed;

    camera.lookAt(target.x, 1, target.z);
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

    // Remove old cars
    for (const car of this.cars) {
      this.scene.remove(car.mesh);
      if (car.sensor) {
        this.sensorGroup.remove(car.sensor.rayLines);
      }
      car.dispose(this.collisionWorld);
    }
    for (const car of this.traffic) {
      this.scene.remove(car.mesh);
      car.dispose(this.collisionWorld);
    }

    // Rebuild
    this.traffic = this.buildTraffic();
    for (const car of this.traffic) {
      this.scene.add(car.mesh);
      car.registerCollision(this.collisionWorld);
    }

    this.cars = this.generateCars(this.settings.carCount);
    this.hydrateBrains();
    for (const car of this.cars) {
      this.scene.add(car.mesh);
      car.registerCollision(this.collisionWorld);
      if (car.sensor) {
        this.sensorGroup.add(car.sensor.rayLines);
      }
    }

    this.bestCar = this.cars[0];
    this.manualCar = null;
    this.manualMode = false;

    if (wasManual) this.setManualMode(true);
    this.updateVisibility();
  }

  /* ---------- Brain persistence ---------------------------------- */

  saveBrain(): void {
    saveBestBrain3D(this.bestCar.brain);
  }

  discardBrain(): void {
    this.trainingBrain = null;
    clearBestBrain3D();
  }

  /* ---------- Settings ------------------------------------------- */

  setSensorsVisible(visible: boolean): void {
    this.sensorGroup.visible = visible;
    this.settings.showSensors = visible;
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

  /* ---------- Visibility ----------------------------------------- */

  private updateVisibility(): void {
    for (const car of this.cars) {
      if (car === this.bestCar) {
        car.setOpacity(1);
        car.setHighlight(true);
        if (car.sensor) car.sensor.rayLines.visible = this.sensorGroup.visible;
      } else {
        car.setOpacity(0.15);
        car.setHighlight(false);
        if (car.sensor) car.sensor.rayLines.visible = false;
      }
    }
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
    blueprints: TrafficBlueprint3D[] = DEFAULT_TRAFFIC
  ): Car3D[] {
    return blueprints.map(
      ({ lane, z }) => new Car3D(this.road.getLaneCenter(lane), z, 'DUMMY')
    );
  }

  private generateCars(count: number): Car3D[] {
    const generated: Car3D[] = [];
    for (let i = 0; i < count; i++) {
      generated.push(new Car3D(this.road.getLaneCenter(1), 0, 'AI'));
    }
    return generated;
  }

  private hydrateBrains(): void {
    const baseBrain = this.trainingBrain ?? loadBestBrain3D();
    if (!baseBrain) return;
    for (let i = 0; i < this.cars.length; i++) {
      this.cars[i].brain = NeuralNetwork.clone(baseBrain);
      if (i !== 0) {
        NeuralNetwork.mutate(this.cars[i].brain!, this.settings.mutationRate);
      }
    }
  }

  private getLeadCar(): Car3D | null {
    if (this.cars.length === 0) return null;
    return this.cars.reduce((lead, car) => {
      if (car.carsPassed !== lead.carsPassed) {
        return car.carsPassed > lead.carsPassed ? car : lead;
      }
      // More negative Z = further ahead
      return car.z < lead.z ? car : lead;
    }, this.cars[0]);
  }

  private updatePassingStats(): void {
    for (const car of this.cars) {
      for (const trafficCar of this.traffic) {
        if (car.z < trafficCar.z && !car.passedTrafficIds.has(trafficCar.id)) {
          car.passedTrafficIds.add(trafficCar.id);
          car.carsPassed += 1;
        }
      }
    }
  }

  /* ---------- Cleanup -------------------------------------------- */

  dispose(): void {
    this.stopTraining();
    for (const car of this.cars) {
      this.scene.remove(car.mesh);
      if (car.sensor) this.sensorGroup.remove(car.sensor.rayLines);
      car.dispose(this.collisionWorld);
    }
    for (const car of this.traffic) {
      this.scene.remove(car.mesh);
      car.dispose(this.collisionWorld);
    }
    this.road.dispose(this.collisionWorld);
    this.scene.remove(this.road.group);
    this.scene.remove(this.sensorGroup);
    this.collisionWorld.dispose();
  }
}
