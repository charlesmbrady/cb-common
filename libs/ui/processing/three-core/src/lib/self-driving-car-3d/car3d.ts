/* ------------------------------------------------------------------ */
/*  Self-Driving Car 3D – Car entity                                   */
/*  Arcade movement on XZ plane, AABB collision via CollisionWorld,    */
/*  reuses NeuralNetwork from ctx-core.                                */
/* ------------------------------------------------------------------ */

import * as THREE from 'three';
import { SDC3D_CAR_CONFIG } from './config';
import { Sensor3D } from './sensor3d';
import type { CollisionWorld } from '../collision-world';
import {
  NeuralNetwork,
  type NeuralNetworkData,
} from '../neural-network';

export type CarControlType3D = 'AI' | 'KEYS' | 'DUMMY';

let nextCarId3D = 1;

export class Car3D {
  id: number;
  x: number;
  z: number;
  width: number;
  height: number;
  length: number;
  controlType: CarControlType3D;
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
  sensor: Sensor3D | null = null;
  brain: NeuralNetworkData | null = null;

  mesh: THREE.Group;
  collisionId = -1;

  /* keyboard state */
  controls = { forward: false, backward: false, left: false, right: false };
  private keyDownHandler: ((e: KeyboardEvent) => void) | null = null;
  private keyUpHandler: ((e: KeyboardEvent) => void) | null = null;

  private bodyMat: THREE.MeshStandardMaterial;

  constructor(
    x: number,
    z: number,
    controlType: CarControlType3D = 'AI',
    maxSpeed = SDC3D_CAR_CONFIG.maxSpeed,
    color?: number
  ) {
    this.id = nextCarId3D++;
    this.x = x;
    this.z = z;
    this.width = SDC3D_CAR_CONFIG.width;
    this.height = SDC3D_CAR_CONFIG.height;
    this.length = SDC3D_CAR_CONFIG.length;
    this.controlType = controlType;
    this.maxSpeed =
      controlType === 'DUMMY' ? SDC3D_CAR_CONFIG.dummySpeed : maxSpeed;
    this.speed = 0;
    this.acceleration = SDC3D_CAR_CONFIG.acceleration;
    this.friction = SDC3D_CAR_CONFIG.friction;
    this.turnRate = SDC3D_CAR_CONFIG.turnRate;
    this.angle = 0;
    this.damaged = false;
    this.carsPassed = 0;
    this.passedTrafficIds = new Set();
    this.useBrain = controlType === 'AI';

    /* -- visual ---------------------------------------------------- */
    this.mesh = new THREE.Group();

    const bodyColor =
      color ?? (controlType === 'DUMMY' ? 0xdd4444 : Math.random() * 0xffffff);
    this.bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.4,
      metalness: 0.3,
    });

    // Car body
    const bodyGeo = new THREE.BoxGeometry(this.width, this.height, this.length);
    const body = new THREE.Mesh(bodyGeo, this.bodyMat);
    body.position.y = this.height / 2 + 0.1;
    body.castShadow = true;
    this.mesh.add(body);

    // Roof (smaller box on top)
    const roofGeo = new THREE.BoxGeometry(
      this.width * 0.8,
      this.height * 0.6,
      this.length * 0.5
    );
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.5,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = this.height + 0.4;
    roof.position.z = -this.length * 0.05;
    roof.castShadow = true;
    this.mesh.add(roof);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 12);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.9,
    });
    const wheelPositions: [number, number, number][] = [
      [-this.width / 2, 0.35, -this.length * 0.3],
      [this.width / 2, 0.35, -this.length * 0.3],
      [-this.width / 2, 0.35, this.length * 0.3],
      [this.width / 2, 0.35, this.length * 0.3],
    ];
    for (const [wx, wy, wz] of wheelPositions) {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, wy, wz);
      wheel.rotation.z = Math.PI / 2;
      this.mesh.add(wheel);
    }

    // Headlights
    const headlightGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffcc,
      emissive: 0xffffcc,
      emissiveIntensity: 0.5,
    });
    const hlLeft = new THREE.Mesh(headlightGeo, headlightMat);
    hlLeft.position.set(
      -this.width * 0.35,
      this.height * 0.5,
      -this.length / 2
    );
    this.mesh.add(hlLeft);

    const hlRight = new THREE.Mesh(headlightGeo, headlightMat);
    hlRight.position.set(
      this.width * 0.35,
      this.height * 0.5,
      -this.length / 2
    );
    this.mesh.add(hlRight);

    /* -- sensor / brain -------------------------------------------- */
    if (controlType === 'AI') {
      this.sensor = new Sensor3D();
      this.brain = new NeuralNetwork([this.sensor.rayCount, 8, 4]);
    }

    this.syncMesh();
  }

  /* ---------- Collision registration ----------------------------- */

  registerCollision(world: CollisionWorld): void {
    this.collisionId = world.addBox(
      this.x,
      this.z,
      this.width / 2,
      this.length / 2
    );
    // AI cars' meshes are also ray targets so sensors detect them
    if (this.controlType === 'DUMMY') {
      world.addRayTarget(this.mesh);
    }
  }

  /* ---------- Keyboard controls ---------------------------------- */

  attachKeyboardControls(): void {
    this.keyDownHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          this.controls.forward = true;
          break;
        case 'ArrowDown':
        case 's':
          this.controls.backward = true;
          break;
        case 'ArrowLeft':
        case 'a':
          this.controls.left = true;
          break;
        case 'ArrowRight':
        case 'd':
          this.controls.right = true;
          break;
      }
    };
    this.keyUpHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          this.controls.forward = false;
          break;
        case 'ArrowDown':
        case 's':
          this.controls.backward = false;
          break;
        case 'ArrowLeft':
        case 'a':
          this.controls.left = false;
          break;
        case 'ArrowRight':
        case 'd':
          this.controls.right = false;
          break;
      }
    };
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  detachKeyboardControls(): void {
    if (this.keyDownHandler) {
      window.removeEventListener('keydown', this.keyDownHandler);
      this.keyDownHandler = null;
    }
    if (this.keyUpHandler) {
      window.removeEventListener('keyup', this.keyUpHandler);
      this.keyUpHandler = null;
    }
  }

  setControlMode(mode: CarControlType3D): void {
    this.detachKeyboardControls();
    this.controlType = mode;
    this.useBrain = mode === 'AI';
    if (mode === 'KEYS') {
      this.attachKeyboardControls();
    }
  }

  /* ---------- Update --------------------------------------------- */

  update(dt: number, world: CollisionWorld | null): void {
    if (this.damaged) return;

    // Sensor
    if (this.sensor) {
      this.sensor.update(this.x, this.z, this.angle, world);
    }

    // Brain
    if (this.useBrain && this.sensor && this.brain) {
      const inputs = this.sensor.getInputs();
      const outputs = NeuralNetwork.feedForward(inputs, this.brain);
      this.controls.forward = outputs[0] > 0.5;
      this.controls.left = outputs[1] > 0.5;
      this.controls.right = outputs[2] > 0.5;
      this.controls.backward = outputs[3] > 0.5;
    }

    // Dummy cars just drive forward
    if (this.controlType === 'DUMMY') {
      this.speed = -this.maxSpeed;
      this.z += this.speed * dt;
      this.syncMesh();
      if (world && this.collisionId >= 0) {
        world.updateBox(
          this.collisionId,
          this.x,
          this.z,
          this.width / 2,
          this.length / 2
        );
      }
      return;
    }

    // Arcade physics
    if (this.controls.forward) this.speed -= this.acceleration * dt;
    if (this.controls.backward) this.speed += this.acceleration * dt;

    this.speed = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.speed));
    this.speed *= this.friction;

    if (Math.abs(this.speed) > 0.1) {
      const flip = this.speed > 0 ? -1 : 1;
      if (this.controls.left) this.angle -= this.turnRate * dt * flip;
      if (this.controls.right) this.angle += this.turnRate * dt * flip;
    }

    this.x += Math.sin(this.angle) * this.speed * dt;
    this.z += Math.cos(this.angle) * this.speed * dt;

    // Sync visual
    this.syncMesh();

    // Sync collision box
    if (world && this.collisionId >= 0) {
      world.updateBox(
        this.collisionId,
        this.x,
        this.z,
        this.width / 2,
        this.length / 2
      );
    }
  }

  /* ---------- Collision check ------------------------------------ */

  checkCollision(world: CollisionWorld | null): void {
    if (!world || this.collisionId < 0 || this.damaged) return;

    const overlaps = world.testOverlap(this.collisionId);
    if (overlaps.length > 0) {
      this.damaged = true;
      this.bodyMat.color.set(0x666666);
      this.bodyMat.emissive.set(0x330000);
    }
  }

  /* ---------- Visuals -------------------------------------------- */

  private syncMesh(): void {
    this.mesh.position.set(this.x, 0, this.z);
    this.mesh.rotation.y = this.angle;
  }

  setOpacity(alpha: number): void {
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.transparent = alpha < 1;
        mat.opacity = alpha;
      }
    });
  }

  setHighlight(enabled: boolean): void {
    if (enabled) {
      this.bodyMat.emissive.set(0x003300);
      this.bodyMat.emissiveIntensity = 0.3;
    } else {
      this.bodyMat.emissive.set(0x000000);
      this.bodyMat.emissiveIntensity = 0;
    }
  }

  /* ---------- Cleanup -------------------------------------------- */

  dispose(world: CollisionWorld | null): void {
    this.detachKeyboardControls();
    if (world && this.collisionId >= 0) {
      world.removeBox(this.collisionId);
      if (this.controlType === 'DUMMY') {
        world.removeRayTarget(this.mesh);
      }
    }
    this.sensor?.dispose();
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
