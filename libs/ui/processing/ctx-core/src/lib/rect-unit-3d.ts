import * as THREE from 'three';
import { Unit, type UnitOptions } from './unit';

export type RectUnit3DOptions = UnitOptions & {
  width: number;
  height: number;
  depth: number;
  y?: number;
  jumpSpeed?: number;
  gravity?: number;
};

export class RectUnit3D extends Unit {
  width: number;
  height: number;
  depth: number;
  y: number;
  verticalVelocity = 0;
  grounded = false;
  jumpSpeed: number;
  gravity: number;

  constructor(opts: RectUnit3DOptions) {
    super(opts);
    this.width = opts.width;
    this.height = opts.height;
    this.depth = opts.depth;
    this.y = opts.y ?? opts.height / 2;
    this.jumpSpeed = opts.jumpSpeed ?? 7.8;
    this.gravity = opts.gravity ?? 18;
  }

  jump() {
    if (!this.grounded) return false;
    this.verticalVelocity = this.jumpSpeed;
    this.grounded = false;
    return true;
  }

  stepVertical(dt: number, floorY = 0) {
    this.verticalVelocity -= this.gravity * dt;
    this.y += this.verticalVelocity * dt;

    const minY = floorY + this.height / 2;
    if (this.y <= minY) {
      this.y = minY;
      this.verticalVelocity = 0;
      this.grounded = true;
    }
  }

  syncMesh(mesh: THREE.Mesh) {
    mesh.position.set(this.position.x, this.y, this.position.y);
  }
}
