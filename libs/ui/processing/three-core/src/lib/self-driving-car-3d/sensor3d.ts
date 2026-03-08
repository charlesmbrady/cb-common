/* ------------------------------------------------------------------ */
/*  Self-Driving Car 3D – Sensor (raycasting via THREE.Raycaster)      */
/* ------------------------------------------------------------------ */

import * as THREE from 'three';
import { SDC3D_SENSOR_CONFIG } from './config';
import type { CollisionWorld } from '../collision-world';

export interface SensorReading {
  offset: number | null; // 0..1 (fraction), null if no hit
}

export class Sensor3D {
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rayHeight: number;

  readings: SensorReading[];
  rayLines: THREE.Group;

  private lineMeshes: THREE.Line[] = [];

  constructor() {
    this.rayCount = SDC3D_SENSOR_CONFIG.rayCount;
    this.rayLength = SDC3D_SENSOR_CONFIG.rayLength;
    this.raySpread = SDC3D_SENSOR_CONFIG.raySpread;
    this.rayHeight = SDC3D_SENSOR_CONFIG.rayHeight;
    this.readings = new Array(this.rayCount).fill({ offset: null });
    this.rayLines = new THREE.Group();
    this.buildVisuals();
  }

  private buildVisuals(): void {
    for (let i = 0; i < this.rayCount; i++) {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1),
      ]);
      const mat = new THREE.LineBasicMaterial({ color: 0xffff00 });
      const line = new THREE.Line(geom, mat);
      this.lineMeshes.push(line);
      this.rayLines.add(line);
    }
  }

  update(
    carX: number,
    carZ: number,
    carAngle: number,
    world: CollisionWorld | null
  ): void {
    this.readings = [];

    for (let i = 0; i < this.rayCount; i++) {
      const t = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
      const angle =
        carAngle +
        THREE.MathUtils.lerp(-this.raySpread / 2, this.raySpread / 2, t);

      const startX = carX;
      const startZ = carZ;
      const endX = carX + Math.sin(angle) * this.rayLength;
      const endZ = carZ - Math.cos(angle) * this.rayLength;

      let reading: SensorReading = { offset: null };

      if (world) {
        const hit = world.raycast(startX, startZ, endX, endZ, this.rayHeight);
        if (hit) {
          reading = { offset: hit.fraction };
        }
      }

      this.readings.push(reading);

      // Update visual
      const line = this.lineMeshes[i];
      if (line) {
        const hitDist =
          reading.offset !== null
            ? reading.offset * this.rayLength
            : this.rayLength;

        const positions = line.geometry.attributes[
          'position'
        ] as THREE.BufferAttribute;
        positions.setXYZ(0, startX, this.rayHeight, startZ);
        positions.setXYZ(
          1,
          startX + Math.sin(angle) * hitDist,
          this.rayHeight,
          startZ - Math.cos(angle) * hitDist
        );
        positions.needsUpdate = true;
        line.geometry.computeBoundingSphere();

        // Color: yellow for no-hit, red for hit
        const mat = line.material as THREE.LineBasicMaterial;
        mat.color.set(reading.offset !== null ? 0xff0000 : 0xffff00);
      }
    }
  }

  getInputs(): number[] {
    return this.readings.map((r) => (r.offset !== null ? 1 - r.offset : 0));
  }

  dispose(): void {
    for (const line of this.lineMeshes) {
      line.geometry.dispose();
      (line.material as THREE.LineBasicMaterial).dispose();
    }
  }
}
