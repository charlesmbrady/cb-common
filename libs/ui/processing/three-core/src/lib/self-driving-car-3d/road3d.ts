/* ------------------------------------------------------------------ */
/*  Self-Driving Car 3D – Road                                         */
/*  Three.js meshes for road surface, lanes, and walls.                */
/*  Wall meshes double as ray-cast targets for sensors.                */
/* ------------------------------------------------------------------ */

import * as THREE from 'three';
import { SDC3D_ROAD_CONFIG } from './config';
import type { CollisionWorld } from '../collision-world';

export class Road3D {
  laneCount: number;
  laneWidth: number;
  roadWidth: number;
  roadLength: number;
  left: number;
  right: number;

  group: THREE.Group;

  /** Wall meshes — added as ray targets for sensors. */
  leftWall!: THREE.Mesh;
  rightWall!: THREE.Mesh;

  /** AABB ids for wall collision boxes. */
  wallBoxIds: number[] = [];

  constructor(collisionWorld: CollisionWorld | null) {
    this.laneCount = SDC3D_ROAD_CONFIG.laneCount;
    this.laneWidth = SDC3D_ROAD_CONFIG.laneWidth;
    this.roadWidth = this.laneCount * this.laneWidth;
    this.roadLength = SDC3D_ROAD_CONFIG.roadLength;
    this.left = -this.roadWidth / 2;
    this.right = this.roadWidth / 2;

    this.group = new THREE.Group();
    this.buildVisuals();

    if (collisionWorld) {
      this.registerCollision(collisionWorld);
    }
  }

  getLaneCenter(laneIndex: number): number {
    const idx = Math.min(laneIndex, this.laneCount - 1);
    return this.left + this.laneWidth / 2 + idx * this.laneWidth;
  }

  /* ---------- Visuals -------------------------------------------- */

  private buildVisuals(): void {
    // Road surface
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.roadLength);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.9,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0, -this.roadLength / 2);
    roadMesh.receiveShadow = true;
    this.group.add(roadMesh);

    // Grass on each side
    const grassWidth = this.roadWidth * 3;
    const grassGeo = new THREE.PlaneGeometry(grassWidth, this.roadLength);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x3a7d44,
      roughness: 1,
    });

    const leftGrass = new THREE.Mesh(grassGeo, grassMat);
    leftGrass.rotation.x = -Math.PI / 2;
    leftGrass.position.set(
      this.left - grassWidth / 2,
      -0.01,
      -this.roadLength / 2
    );
    leftGrass.receiveShadow = true;
    this.group.add(leftGrass);

    const rightGrass = new THREE.Mesh(grassGeo, grassMat);
    rightGrass.rotation.x = -Math.PI / 2;
    rightGrass.position.set(
      this.right + grassWidth / 2,
      -0.01,
      -this.roadLength / 2
    );
    rightGrass.receiveShadow = true;
    this.group.add(rightGrass);

    // Lane dashes
    const dashLength = 2;
    const gapLength = 2;
    const dashGeo = new THREE.PlaneGeometry(0.15, dashLength);
    const dashMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });

    for (let lane = 1; lane < this.laneCount; lane++) {
      const x = this.left + lane * this.laneWidth;
      for (let z = 0; z > -this.roadLength; z -= dashLength + gapLength) {
        const dash = new THREE.Mesh(dashGeo, dashMat);
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(x, 0.005, z - dashLength / 2);
        this.group.add(dash);
      }
    }

    // Solid edge lines
    const edgeGeo = new THREE.PlaneGeometry(0.2, this.roadLength);
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });

    const leftEdge = new THREE.Mesh(edgeGeo, edgeMat);
    leftEdge.rotation.x = -Math.PI / 2;
    leftEdge.position.set(this.left, 0.005, -this.roadLength / 2);
    this.group.add(leftEdge);

    const rightEdge = new THREE.Mesh(edgeGeo, edgeMat);
    rightEdge.rotation.x = -Math.PI / 2;
    rightEdge.position.set(this.right, 0.005, -this.roadLength / 2);
    this.group.add(rightEdge);

    // 3D wall barriers
    const wallH = SDC3D_ROAD_CONFIG.wallHeight;
    const wallT = SDC3D_ROAD_CONFIG.wallThickness;
    const wallGeo = new THREE.BoxGeometry(wallT, wallH, this.roadLength);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xcc3333,
      roughness: 0.6,
    });

    this.leftWall = new THREE.Mesh(wallGeo, wallMat);
    this.leftWall.position.set(
      this.left - wallT / 2,
      wallH / 2,
      -this.roadLength / 2
    );
    this.leftWall.castShadow = true;
    this.group.add(this.leftWall);

    this.rightWall = new THREE.Mesh(wallGeo, wallMat);
    this.rightWall.position.set(
      this.right + wallT / 2,
      wallH / 2,
      -this.roadLength / 2
    );
    this.rightWall.castShadow = true;
    this.group.add(this.rightWall);
  }

  /* ---------- Collision registration ----------------------------- */

  private registerCollision(world: CollisionWorld): void {
    const wallT = SDC3D_ROAD_CONFIG.wallThickness;

    // Add wall meshes as ray targets so sensors detect them
    world.addRayTarget(this.leftWall);
    world.addRayTarget(this.rightWall);

    // Add AABB boxes for wall collision
    this.wallBoxIds.push(
      world.addBox(
        this.left - wallT / 2,
        -this.roadLength / 2,
        wallT / 2,
        this.roadLength / 2
      )
    );
    this.wallBoxIds.push(
      world.addBox(
        this.right + wallT / 2,
        -this.roadLength / 2,
        wallT / 2,
        this.roadLength / 2
      )
    );
  }

  dispose(world: CollisionWorld | null): void {
    if (world) {
      world.removeRayTarget(this.leftWall);
      world.removeRayTarget(this.rightWall);
      for (const id of this.wallBoxIds) world.removeBox(id);
    }
  }
}
