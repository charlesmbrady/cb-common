import * as THREE from 'three';
import { Unit, type UnitOptions } from './unit';
import { GameObject3D } from './game-object-3d';

export type BodyPartId =
  | 'head'
  | 'neck'
  | 'upperTorso'
  | 'torso'
  | 'shoulders'
  | 'leftUpperArm'
  | 'rightUpperArm'
  | 'leftLowerArm'
  | 'rightLowerArm'
  | 'leftHand'
  | 'rightHand'
  | 'lowerTorso'
  | 'hips'
  | 'leftHipJoint'
  | 'rightHipJoint'
  | 'leftUpperLeg'
  | 'rightUpperLeg'
  | 'leftKnee'
  | 'rightKnee'
  | 'leftLowerLeg'
  | 'rightLowerLeg'
  | 'leftAnkle'
  | 'rightAnkle'
  | 'leftFoot'
  | 'rightFoot';

type PartDef = {
  id: BodyPartId;
  parentId?: BodyPartId;
  localOffset: THREE.Vector3;
  radius: number;
  mass: number;
  shape: 'sphere' | 'box';
  boxSize?: THREE.Vector3;
};

export type BodyPartState = {
  id: BodyPartId;
  mesh: THREE.Mesh;
  radius: number;
  mass: number;
  velocity: THREE.Vector3;
  localOffset: THREE.Vector3;
  parentId?: BodyPartId;
};

export type ShotEvent = {
  partId: BodyPartId;
  point: THREE.Vector3;
  normal: THREE.Vector3;
};

const PART_DEFS: PartDef[] = [
  { id: 'hips', localOffset: new THREE.Vector3(0, 1.0, 0), radius: 0.22, mass: 2.5, shape: 'sphere' },
  { id: 'lowerTorso', parentId: 'hips', localOffset: new THREE.Vector3(0, 0.28, 0), radius: 0.24, mass: 2.8, shape: 'box', boxSize: new THREE.Vector3(0.55, 0.35, 0.3) },
  { id: 'torso', parentId: 'lowerTorso', localOffset: new THREE.Vector3(0, 0.34, 0), radius: 0.28, mass: 3.1, shape: 'box', boxSize: new THREE.Vector3(0.62, 0.42, 0.34) },
  { id: 'upperTorso', parentId: 'torso', localOffset: new THREE.Vector3(0, 0.28, 0), radius: 0.26, mass: 2.8, shape: 'box', boxSize: new THREE.Vector3(0.58, 0.32, 0.32) },
  { id: 'shoulders', parentId: 'upperTorso', localOffset: new THREE.Vector3(0, 0.22, 0), radius: 0.24, mass: 1.8, shape: 'box', boxSize: new THREE.Vector3(0.85, 0.22, 0.24) },
  { id: 'neck', parentId: 'upperTorso', localOffset: new THREE.Vector3(0, 0.23, 0), radius: 0.12, mass: 0.8, shape: 'sphere' },
  { id: 'head', parentId: 'neck', localOffset: new THREE.Vector3(0, 0.26, 0), radius: 0.19, mass: 1.1, shape: 'sphere' },

  { id: 'leftUpperArm', parentId: 'shoulders', localOffset: new THREE.Vector3(-0.38, -0.06, 0), radius: 0.11, mass: 0.9, shape: 'box', boxSize: new THREE.Vector3(0.2, 0.36, 0.2) },
  { id: 'rightUpperArm', parentId: 'shoulders', localOffset: new THREE.Vector3(0.38, -0.06, 0), radius: 0.11, mass: 0.9, shape: 'box', boxSize: new THREE.Vector3(0.2, 0.36, 0.2) },
  { id: 'leftLowerArm', parentId: 'leftUpperArm', localOffset: new THREE.Vector3(0, -0.33, 0), radius: 0.1, mass: 0.8, shape: 'box', boxSize: new THREE.Vector3(0.18, 0.34, 0.18) },
  { id: 'rightLowerArm', parentId: 'rightUpperArm', localOffset: new THREE.Vector3(0, -0.33, 0), radius: 0.1, mass: 0.8, shape: 'box', boxSize: new THREE.Vector3(0.18, 0.34, 0.18) },
  { id: 'leftHand', parentId: 'leftLowerArm', localOffset: new THREE.Vector3(0, -0.23, 0), radius: 0.08, mass: 0.35, shape: 'sphere' },
  { id: 'rightHand', parentId: 'rightLowerArm', localOffset: new THREE.Vector3(0, -0.23, 0), radius: 0.08, mass: 0.35, shape: 'sphere' },

  { id: 'leftHipJoint', parentId: 'hips', localOffset: new THREE.Vector3(-0.2, -0.06, 0), radius: 0.09, mass: 0.4, shape: 'sphere' },
  { id: 'rightHipJoint', parentId: 'hips', localOffset: new THREE.Vector3(0.2, -0.06, 0), radius: 0.09, mass: 0.4, shape: 'sphere' },
  { id: 'leftUpperLeg', parentId: 'leftHipJoint', localOffset: new THREE.Vector3(0, -0.35, 0), radius: 0.12, mass: 1.4, shape: 'box', boxSize: new THREE.Vector3(0.22, 0.44, 0.22) },
  { id: 'rightUpperLeg', parentId: 'rightHipJoint', localOffset: new THREE.Vector3(0, -0.35, 0), radius: 0.12, mass: 1.4, shape: 'box', boxSize: new THREE.Vector3(0.22, 0.44, 0.22) },
  { id: 'leftKnee', parentId: 'leftUpperLeg', localOffset: new THREE.Vector3(0, -0.3, 0), radius: 0.09, mass: 0.45, shape: 'sphere' },
  { id: 'rightKnee', parentId: 'rightUpperLeg', localOffset: new THREE.Vector3(0, -0.3, 0), radius: 0.09, mass: 0.45, shape: 'sphere' },
  { id: 'leftLowerLeg', parentId: 'leftKnee', localOffset: new THREE.Vector3(0, -0.32, 0), radius: 0.11, mass: 1.1, shape: 'box', boxSize: new THREE.Vector3(0.2, 0.38, 0.2) },
  { id: 'rightLowerLeg', parentId: 'rightKnee', localOffset: new THREE.Vector3(0, -0.32, 0), radius: 0.11, mass: 1.1, shape: 'box', boxSize: new THREE.Vector3(0.2, 0.38, 0.2) },
  { id: 'leftAnkle', parentId: 'leftLowerLeg', localOffset: new THREE.Vector3(0, -0.26, 0), radius: 0.07, mass: 0.35, shape: 'sphere' },
  { id: 'rightAnkle', parentId: 'rightLowerLeg', localOffset: new THREE.Vector3(0, -0.26, 0), radius: 0.07, mass: 0.35, shape: 'sphere' },
  { id: 'leftFoot', parentId: 'leftAnkle', localOffset: new THREE.Vector3(0.07, -0.05, 0.16), radius: 0.1, mass: 0.5, shape: 'box', boxSize: new THREE.Vector3(0.22, 0.1, 0.32) },
  { id: 'rightFoot', parentId: 'rightAnkle', localOffset: new THREE.Vector3(0.07, -0.05, 0.16), radius: 0.1, mass: 0.5, shape: 'box', boxSize: new THREE.Vector3(0.22, 0.1, 0.32) },
];

export type HumanoidUnitOptions = UnitOptions & {
  rootY?: number;
  springK?: number;
  springDamping?: number;
  gravity?: number;
  jumpSpeed?: number;
};

export class HumanoidUnit3D extends Unit {
  readonly object: GameObject3D;
  readonly parts: BodyPartState[] = [];
  readonly partById = new Map<BodyPartId, BodyPartState>();
  private readonly springK: number;
  private readonly springDamping: number;
  private readonly gravity: number;
  private readonly jumpSpeed: number;

  y: number;
  verticalVelocity = 0;
  grounded = false;

  constructor(opts: HumanoidUnitOptions) {
    super(opts);
    this.object = new GameObject3D(`unit-${Math.random().toString(36).slice(2)}`, 'humanoid-unit');
    this.y = opts.rootY ?? 1.05;
    this.springK = opts.springK ?? 60;
    this.springDamping = opts.springDamping ?? 7;
    this.gravity = opts.gravity ?? 18;
    this.jumpSpeed = opts.jumpSpeed ?? 8;

    this.parts = PART_DEFS.map((def) => {
      const mesh = this.object.register(this.createMesh(def));
      const part: BodyPartState = {
        id: def.id,
        mesh,
        radius: def.radius,
        mass: def.mass,
        velocity: new THREE.Vector3(),
        localOffset: def.localOffset.clone(),
        parentId: def.parentId,
      };
      this.partById.set(part.id, part);
      return part;
    });

    this.resetPose();
  }

  addToScene(scene: THREE.Scene) {
    this.object.addToScene(scene);
  }

  removeFromScene(scene: THREE.Scene) {
    this.object.removeFromScene(scene);
  }

  dispose() {
    this.object.dispose();
  }

  jump() {
    if (!this.grounded) return false;
    this.verticalVelocity = this.jumpSpeed;
    this.grounded = false;
    return true;
  }

  override update(dt = 1 / 60, floorY = 0, worldHalfSize = 60) {
    this.verticalVelocity -= this.gravity * dt;
    this.y += this.verticalVelocity * dt;

    const minRootY = floorY + 1.0;
    if (this.y < minRootY) {
      this.y = minRootY;
      this.verticalVelocity = 0;
      this.grounded = true;
    }

    for (const part of this.parts) {
      const target = this.getTargetPosition(part);
      const current = part.mesh.position;

      const force = new THREE.Vector3()
        .subVectors(target, current)
        .multiplyScalar(this.springK)
        .addScaledVector(part.velocity, -this.springDamping);

      part.velocity.addScaledVector(force, dt / Math.max(0.1, part.mass));
      part.velocity.y -= this.gravity * dt * 0.45;
      part.mesh.position.addScaledVector(part.velocity, dt);

      const minY = floorY + part.radius;
      if (part.mesh.position.y < minY) {
        part.mesh.position.y = minY;
        if (part.velocity.y < 0) part.velocity.y *= -0.25;
      }

      part.mesh.position.x = THREE.MathUtils.clamp(part.mesh.position.x, -worldHalfSize, worldHalfSize);
      part.mesh.position.z = THREE.MathUtils.clamp(part.mesh.position.z, -worldHalfSize, worldHalfSize);
    }
  }

  moveOnGround(deltaX: number, deltaZ: number) {
    this.position.x += deltaX;
    this.position.y += deltaZ;
  }

  shootRay(origin: THREE.Vector3, direction: THREE.Vector3, range = 200): ShotEvent | null {
    const raycaster = new THREE.Raycaster(origin, direction.clone().normalize(), 0, range);
    const hits = raycaster.intersectObjects(this.parts.map((p) => p.mesh), false);
    if (!hits.length) return null;

    const hit = hits[0];
    const part = this.parts.find((p) => p.mesh === hit.object);
    if (!part) return null;

    part.velocity.addScaledVector(direction.clone().normalize(), 4.5 / Math.max(0.3, part.mass));
    const parent = part.parentId ? this.partById.get(part.parentId) : undefined;
    if (parent) parent.velocity.addScaledVector(direction.clone().normalize(), 1.4 / Math.max(0.3, parent.mass));

    return {
      partId: part.id,
      point: hit.point.clone(),
      normal: hit.face?.normal.clone() ?? new THREE.Vector3(0, 1, 0),
    };
  }

  private resetPose() {
    for (const part of this.parts) {
      const target = this.getTargetPosition(part);
      part.mesh.position.copy(target);
      part.velocity.set(0, 0, 0);
    }
  }

  private getTargetPosition(part: BodyPartState) {
    if (part.parentId) {
      const parent = this.partById.get(part.parentId);
      if (parent) return parent.mesh.position.clone().add(part.localOffset);
    }
    return new THREE.Vector3(this.position.x, this.y, this.position.y).add(part.localOffset);
  }

  private createMesh(def: PartDef) {
    if (def.shape === 'sphere') {
      return new THREE.Mesh(
        new THREE.SphereGeometry(def.radius, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x5ec7ff, roughness: 0.55 })
      );
    }

    const size = def.boxSize ?? new THREE.Vector3(def.radius * 2, def.radius * 2, def.radius * 2);
    return new THREE.Mesh(
      new THREE.BoxGeometry(size.x, size.y, size.z),
      new THREE.MeshStandardMaterial({ color: 0x4ea2dd, roughness: 0.6 })
    );
  }
}
