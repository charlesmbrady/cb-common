/* ------------------------------------------------------------------ */
/*  Collision World – lightweight AABB + Three.js Raycaster            */
/*  No external physics engine needed.                                 */
/* ------------------------------------------------------------------ */

import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AABB {
  id: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface RayHit {
  point: THREE.Vector3;
  distance: number;
  fraction: number;
  objectId: number;
}

/* ------------------------------------------------------------------ */
/*  CollisionWorld                                                     */
/* ------------------------------------------------------------------ */

/**
 * Simple collision manager using axis-aligned bounding boxes for
 * overlap tests and THREE.Raycaster for sensor rays.
 */
export class CollisionWorld {
  private boxes: Map<number, AABB> = new Map();
  private nextId = 1;

  /** Meshes to test sensor rays against (walls + traffic car meshes). */
  private rayTargets: THREE.Object3D[] = [];

  /* ---------- AABB management ------------------------------------ */

  /** Register an AABB and return its id. */
  addBox(
    centerX: number,
    centerZ: number,
    halfW: number,
    halfL: number
  ): number {
    const id = this.nextId++;
    this.boxes.set(id, {
      id,
      minX: centerX - halfW,
      maxX: centerX + halfW,
      minZ: centerZ - halfL,
      maxZ: centerZ + halfL,
    });
    return id;
  }

  /** Update an existing AABB's position. */
  updateBox(
    id: number,
    centerX: number,
    centerZ: number,
    halfW: number,
    halfL: number
  ): void {
    const box = this.boxes.get(id);
    if (!box) return;
    box.minX = centerX - halfW;
    box.maxX = centerX + halfW;
    box.minZ = centerZ - halfL;
    box.maxZ = centerZ + halfL;
  }

  removeBox(id: number): void {
    this.boxes.delete(id);
  }

  /* ---------- Ray targets ---------------------------------------- */

  addRayTarget(obj: THREE.Object3D): void {
    if (!this.rayTargets.includes(obj)) {
      this.rayTargets.push(obj);
    }
  }

  removeRayTarget(obj: THREE.Object3D): void {
    const idx = this.rayTargets.indexOf(obj);
    if (idx >= 0) this.rayTargets.splice(idx, 1);
  }

  getRayTargets(): THREE.Object3D[] {
    return this.rayTargets;
  }

  /* ---------- AABB overlap tests --------------------------------- */

  /** Check if the given box overlaps any other registered box. */
  testOverlap(id: number): number[] {
    const box = this.boxes.get(id);
    if (!box) return [];

    const hits: number[] = [];
    for (const [otherId, other] of this.boxes) {
      if (otherId === id) continue;
      if (
        box.minX < other.maxX &&
        box.maxX > other.minX &&
        box.minZ < other.maxZ &&
        box.maxZ > other.minZ
      ) {
        hits.push(otherId);
      }
    }
    return hits;
  }

  /* ---------- Raycasting (uses THREE.Raycaster) ------------------ */

  private static _raycaster = new THREE.Raycaster();
  private static _origin = new THREE.Vector3();
  private static _dir = new THREE.Vector3();

  /**
   * Cast a ray and return the closest hit against registered ray targets.
   */
  raycast(
    fromX: number,
    fromZ: number,
    toX: number,
    toZ: number,
    rayHeight = 0.5
  ): RayHit | null {
    const rc = CollisionWorld._raycaster;
    const origin = CollisionWorld._origin.set(fromX, rayHeight, fromZ);
    const dir = CollisionWorld._dir.set(toX - fromX, 0, toZ - fromZ);
    const length = dir.length();
    if (length === 0) return null;
    dir.divideScalar(length); // normalise

    rc.set(origin, dir);
    rc.near = 0;
    rc.far = length;

    const intersects = rc.intersectObjects(this.rayTargets, true);
    if (intersects.length > 0) {
      const hit = intersects[0];
      return {
        point: hit.point,
        distance: hit.distance,
        fraction: hit.distance / length,
        objectId: -1, // we don't track per-object IDs for rays
      };
    }
    return null;
  }

  /* ---------- Cleanup -------------------------------------------- */

  dispose(): void {
    this.boxes.clear();
    this.rayTargets.length = 0;
  }
}
