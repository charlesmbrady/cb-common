import * as THREE from 'three';
import type { RapierRigidBody } from '@react-three/rapier';
import type { MutableRefObject } from 'react';
import type Rapier from '@dimforge/rapier3d-compat';
import type {
  RagdollBodyDefinition,
  RagdollRigDefinition,
} from './RagdollRigDefinition';

export type CharacterRuntimeMode = 'animated' | 'physics';

export interface ApplyHitOptions {
  targetBone?: string;
  direction: THREE.Vector3;
  strength?: number;
  localize?: boolean;
}

export interface RagdollUpdateContext {
  delta: number;
  floorY?: number;
}

export interface BodyWorldTransform {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
}

export type BoneBodyRefMap = Partial<
  Record<string, MutableRefObject<RapierRigidBody | null>>
>;

export class RagdollController {
  private rig: RagdollRigDefinition;
  private mode: CharacterRuntimeMode = 'animated';
  private bones: Map<string, THREE.Object3D> = new Map();
  private bodyRefs: BoneBodyRefMap = {};

  private tmpPosition = new THREE.Vector3();
  private tmpQuaternion = new THREE.Quaternion();
  private tmpScale = new THREE.Vector3(1, 1, 1);
  private tmpWorldMatrix = new THREE.Matrix4();
  private tmpLocalMatrix = new THREE.Matrix4();
  private tmpParentInverse = new THREE.Matrix4();
  private bodyTypeDynamic: Rapier.RigidBodyType = 0 as Rapier.RigidBodyType;
  private bodyTypeKinematicPosition: Rapier.RigidBodyType =
    2 as Rapier.RigidBodyType;
  private worldUp = new THREE.Vector3(0, 1, 0);
  private bodyUp = new THREE.Vector3();
  private correctionAxis = new THREE.Vector3();
  private euler = new THREE.Euler();
  private maxLinearSpeed = 8;
  private maxVerticalSpeed = 6;
  private worldBounds = 60;

  constructor(rig: RagdollRigDefinition) {
    this.rig = rig;
  }

  getMode(): CharacterRuntimeMode {
    return this.mode;
  }

  isPhysicsMode(): boolean {
    return this.mode === 'physics';
  }

  initializeFromModel(rootObject: THREE.Object3D): void {
    this.bones.clear();
    for (const body of this.rig.bodies) {
      const bone = rootObject.getObjectByName(body.bone);
      if (bone) {
        this.bones.set(body.bone, bone);
      }
    }
  }

  registerBodyRefs(bodyRefs: BoneBodyRefMap): void {
    this.bodyRefs = bodyRefs;
  }

  setMode(nextMode: CharacterRuntimeMode): void {
    if (this.mode === nextMode) return;

    if (nextMode === 'physics') {
      this.syncBodiesFromAnimation(true);
    }

    this.mode = nextMode;

    for (const bodyDef of this.rig.bodies) {
      const body = this.bodyRefs[bodyDef.bone]?.current;
      if (!body) continue;
      if (nextMode === 'physics') {
        body.setBodyType(this.bodyTypeDynamic, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        body.wakeUp();
      } else {
        body.setBodyType(this.bodyTypeKinematicPosition, true);
      }
    }

    if (nextMode === 'animated') {
      this.syncBodiesFromAnimation(true);
    }
  }

  toggleMode(): CharacterRuntimeMode {
    this.setMode(this.mode === 'animated' ? 'physics' : 'animated');
    return this.mode;
  }

  syncBodiesFromAnimation(forceImmediate = false): void {
    if (this.mode !== 'animated') return;

    for (const bodyDef of this.rig.bodies) {
      const bone = this.bones.get(bodyDef.bone);
      const body = this.bodyRefs[bodyDef.bone]?.current;
      if (!bone || !body) continue;

      bone.getWorldPosition(this.tmpPosition);
      bone.getWorldQuaternion(this.tmpQuaternion);

      if (forceImmediate) {
        body.setTranslation(
          {
            x: this.tmpPosition.x,
            y: this.tmpPosition.y,
            z: this.tmpPosition.z,
          },
          true
        );
        body.setRotation(this.tmpQuaternion, true);
      } else {
        body.setNextKinematicTranslation({
          x: this.tmpPosition.x,
          y: this.tmpPosition.y,
          z: this.tmpPosition.z,
        });
        body.setNextKinematicRotation(this.tmpQuaternion);
      }

      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }

  getBodyTransform(boneName: string): BodyWorldTransform | null {
    const body = this.bodyRefs[boneName]?.current;
    if (!body) return null;

    const t = body.translation();
    const r = body.rotation();
    return {
      position: new THREE.Vector3(t.x, t.y, t.z),
      rotation: new THREE.Quaternion(r.x, r.y, r.z, r.w),
    };
  }

  getRootBodyTransform(): BodyWorldTransform | null {
    const transform = this.getBodyTransform(this.rig.rootBone);
    if (!transform) return null;

    const pelvisDef = this.rig.bodies.find(
      (body) => body.bone === this.rig.rootBone
    );
    const minYOffset = pelvisDef
      ? this.getBodyGroundClearance(pelvisDef)
      : 0.12;

    if (transform.position.y < minYOffset) {
      transform.position.y = minYOffset;
    }
    return transform;
  }

  private getBodyGroundClearance(bodyDef: RagdollBodyDefinition): number {
    if (bodyDef.collider.type === 'sphere') {
      return bodyDef.collider.size[0];
    }
    if (bodyDef.collider.type === 'capsule') {
      return bodyDef.collider.size[0] + bodyDef.collider.size[1] / 2;
    }
    return bodyDef.collider.size[1] / 2;
  }

  private keepBodiesAboveFloor(floorY: number): void {
    for (const bodyDef of this.rig.bodies) {
      const body = this.bodyRefs[bodyDef.bone]?.current;
      if (!body) continue;

      const clearance = this.getBodyGroundClearance(bodyDef);
      const minY = floorY + clearance;
      const translation = body.translation();
      if (translation.y < minY) {
        body.setTranslation(
          { x: translation.x, y: minY, z: translation.z },
          true
        );

        const lv = body.linvel();
        body.setLinvel(
          { x: lv.x * 0.9, y: Math.max(0, lv.y), z: lv.z * 0.9 },
          true
        );
      }
    }
  }

  private applyUprightAssist(delta: number): void {
    const pelvis = this.bodyRefs[this.rig.rootBone]?.current;
    if (!pelvis) return;

    const q = pelvis.rotation();
    this.tmpQuaternion.set(q.x, q.y, q.z, q.w);

    this.bodyUp.set(0, 1, 0).applyQuaternion(this.tmpQuaternion).normalize();
    this.correctionAxis.crossVectors(this.bodyUp, this.worldUp);

    const tiltAmount = this.correctionAxis.length();
    if (tiltAmount < 0.001) return;

    this.correctionAxis.normalize();
    const torqueStrength = THREE.MathUtils.clamp(tiltAmount * 4, 0, 3) * delta;
    pelvis.applyTorqueImpulse(
      {
        x: this.correctionAxis.x * torqueStrength,
        y: this.correctionAxis.y * torqueStrength,
        z: this.correctionAxis.z * torqueStrength,
      },
      true
    );

    const av = pelvis.angvel();
    pelvis.setAngvel(
      {
        x: av.x * 0.9,
        y: THREE.MathUtils.clamp(av.y * 0.96, -2.5, 2.5),
        z: av.z * 0.9,
      },
      true
    );
  }

  private hardConstrainRootBody(floorY: number): void {
    const pelvis = this.bodyRefs[this.rig.rootBone]?.current;
    if (!pelvis) return;

    const t = pelvis.translation();
    const r = pelvis.rotation();
    this.tmpQuaternion.set(r.x, r.y, r.z, r.w);
    this.euler.setFromQuaternion(this.tmpQuaternion, 'YXZ');

    this.euler.x = 0;
    this.euler.z = 0;
    this.tmpQuaternion.setFromEuler(this.euler);
    pelvis.setRotation(this.tmpQuaternion, true);

    const av = pelvis.angvel();
    pelvis.setAngvel(
      {
        x: 0,
        y: THREE.MathUtils.clamp(av.y, -2.5, 2.5),
        z: 0,
      },
      true
    );

    const lv = pelvis.linvel();
    this.tmpPosition.set(lv.x, lv.y, lv.z);
    const horizontal = Math.hypot(this.tmpPosition.x, this.tmpPosition.z);
    if (horizontal > this.maxLinearSpeed) {
      const scale = this.maxLinearSpeed / horizontal;
      this.tmpPosition.x *= scale;
      this.tmpPosition.z *= scale;
    }
    this.tmpPosition.y = THREE.MathUtils.clamp(
      this.tmpPosition.y,
      -this.maxVerticalSpeed,
      this.maxVerticalSpeed
    );
    pelvis.setLinvel(
      {
        x: this.tmpPosition.x,
        y: this.tmpPosition.y,
        z: this.tmpPosition.z,
      },
      true
    );

    const clearance = floorY + 0.2;
    const clampedX = THREE.MathUtils.clamp(
      t.x,
      -this.worldBounds,
      this.worldBounds
    );
    const clampedZ = THREE.MathUtils.clamp(
      t.z,
      -this.worldBounds,
      this.worldBounds
    );
    const clampedY = Math.max(t.y, clearance);
    if (clampedX !== t.x || clampedY !== t.y || clampedZ !== t.z) {
      pelvis.setTranslation({ x: clampedX, y: clampedY, z: clampedZ }, true);
    }
  }

  applyHitReaction(options: ApplyHitOptions): void {
    if (this.mode !== 'physics') {
      this.setMode('physics');
    }

    const impulseStrength = options.strength ?? 3.2;
    const direction = options.direction.clone();

    if (direction.lengthSq() < 1e-6) {
      direction.set(0, 0, -1);
    }

    direction.normalize().multiplyScalar(impulseStrength);

    const fallbackBone = this.rig.rootBone;
    const targetBone = options.targetBone ?? fallbackBone;
    const targetBody =
      this.bodyRefs[targetBone]?.current ??
      this.bodyRefs[fallbackBone]?.current;

    if (targetBody) {
      targetBody.applyImpulse(
        {
          x: direction.x,
          y: direction.y + (options.localize ? 1.1 : 0.6),
          z: direction.z,
        },
        true
      );
    }
  }

  private syncBonesFromPhysics(): void {
    for (const bodyDef of this.rig.bodies) {
      const bone = this.bones.get(bodyDef.bone);
      const body = this.bodyRefs[bodyDef.bone]?.current;
      if (!bone || !body) continue;

      const translation = body.translation();
      const rotation = body.rotation();

      this.tmpPosition.set(translation.x, translation.y, translation.z);
      this.tmpQuaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

      const parent = bone.parent;
      if (!parent) {
        bone.position.copy(this.tmpPosition);
        bone.quaternion.copy(this.tmpQuaternion);
        bone.updateMatrix();
        bone.updateMatrixWorld(true);
        continue;
      }

      parent.updateWorldMatrix(true, false);

      bone.getWorldScale(this.tmpScale);
      this.tmpWorldMatrix.compose(
        this.tmpPosition,
        this.tmpQuaternion,
        this.tmpScale
      );
      this.tmpParentInverse.copy(parent.matrixWorld).invert();
      this.tmpLocalMatrix
        .multiplyMatrices(this.tmpParentInverse, this.tmpWorldMatrix)
        .decompose(bone.position, bone.quaternion, bone.scale);
      bone.updateMatrix();
      bone.updateMatrixWorld(true);
    }
  }

  update(context: RagdollUpdateContext): void {
    if (this.mode !== 'physics') return;

    const floorY = context.floorY ?? 0;
    this.keepBodiesAboveFloor(floorY);
    this.applyUprightAssist(context.delta);
    this.hardConstrainRootBody(floorY);
    this.syncBonesFromPhysics();
  }
}
