import * as THREE from 'three';
import { Unit, type UnitOptions } from './unit';
import { Hand3D, Joint3D } from './body-parts-3d';

export type CylinderUnit3DOptions = UnitOptions & {
  radius: number;
  height: number;
  y?: number;
  color?: string;
  moveAcceleration?: number;
  jumpSpeed?: number;
  gravity?: number;
};

export class CylinderUnit3D extends Unit {
  readonly mesh: THREE.Mesh;
  readonly hand: Hand3D;
  readonly wrist: Joint3D;

  override readonly radius: number;
  readonly height: number;
  y: number;
  yaw = 0;

  verticalVelocity = 0;
  grounded = false;

  private readonly moveAcceleration: number;
  private readonly jumpSpeed: number;
  private readonly gravity: number;

  constructor(opts: CylinderUnit3DOptions) {
    super(opts);
    this.radius = opts.radius;
    this.height = opts.height;
    this.y = opts.y ?? opts.height / 2;
    this.moveAcceleration = opts.moveAcceleration ?? 16;
    this.jumpSpeed = opts.jumpSpeed ?? 8;
    this.gravity = opts.gravity ?? 18;

    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius, this.radius, this.height, 20),
      new THREE.MeshStandardMaterial({
        color: opts.color ?? 0x4ec1ff,
        roughness: 0.55,
      })
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.hand = new Hand3D('hand');
    this.wrist = new Joint3D(
      'wrist',
      new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xb7e8ff, roughness: 0.45 })
      ),
      0.18
    );

    this.syncMeshes();
  }

  addToScene(scene: THREE.Scene) {
    scene.add(this.mesh);
    this.wrist.addToScene(scene);
    this.hand.addToScene(scene);
  }

  removeFromScene(scene: THREE.Scene) {
    scene.remove(this.mesh);
    this.wrist.removeFromScene(scene);
    this.hand.removeFromScene(scene);
  }

  dispose() {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material))
      this.mesh.material.forEach((m) => m.dispose());
    else this.mesh.material.dispose();
    this.wrist.dispose();
    this.hand.dispose();
  }

  jump() {
    if (!this.grounded) return false;
    this.verticalVelocity = this.jumpSpeed;
    this.grounded = false;
    return true;
  }

  move(
    inputX: number,
    inputZ: number,
    dt: number,
    frictionCoefficient: number
  ) {
    const len = Math.hypot(inputX, inputZ);
    if (len > 0) {
      const nx = inputX / len;
      const nz = inputZ / len;
      this.velocity.x +=
        nx * (this.moveAcceleration / Math.max(this.mass, 0.1)) * dt;
      this.velocity.y +=
        nz * (this.moveAcceleration / Math.max(this.mass, 0.1)) * dt;
    }

    const damping = Math.max(0, 1 - frictionCoefficient * dt * 6);
    this.velocity.x *= damping;
    this.velocity.y *= damping;

    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }

  override update(dt = 1 / 60, floorY = 0, worldHalfSize = 60) {
    this.verticalVelocity -= this.gravity * dt;
    this.y += this.verticalVelocity * dt;

    const minY = floorY + this.height / 2;
    if (this.y <= minY) {
      this.y = minY;
      this.verticalVelocity = 0;
      this.grounded = true;
    }

    this.position.x = THREE.MathUtils.clamp(
      this.position.x,
      -worldHalfSize,
      worldHalfSize
    );
    this.position.y = THREE.MathUtils.clamp(
      this.position.y,
      -worldHalfSize,
      worldHalfSize
    );

    this.syncMeshes();
  }

  private syncMeshes() {
    this.mesh.position.set(this.position.x, this.y, this.position.y);
    this.mesh.rotation.y = this.yaw;

    const forward = new THREE.Vector3(
      Math.sin(this.yaw),
      0,
      Math.cos(this.yaw)
    );
    const center = new THREE.Vector3(
      this.position.x,
      this.y + this.height * 0.08,
      this.position.y
    );

    this.wrist.mesh.position
      .copy(center)
      .addScaledVector(forward, this.radius + 0.04);
    this.hand.mesh.position
      .copy(center)
      .addScaledVector(forward, this.radius + 0.22);
    this.hand.mesh.rotation.y = this.yaw;
  }
}
