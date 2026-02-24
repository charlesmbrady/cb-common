import * as THREE from 'three';

export interface BasicUnitOptions {
  size?: number | [number, number, number];
  color?: THREE.ColorRepresentation;
  position?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export class BasicUnit extends THREE.Mesh<
  THREE.BoxGeometry,
  THREE.MeshStandardMaterial
> {
  readonly dimensions: [number, number, number];

  constructor(options: BasicUnitOptions = {}) {
    const size = options.size ?? 1;
    const dimensions: [number, number, number] =
      typeof size === 'number' ? [size, size, size] : size;

    const geometry = new THREE.BoxGeometry(...dimensions);
    const material = new THREE.MeshStandardMaterial({
      color: options.color ?? '#4fa3ff',
    });

    super(geometry, material);

    this.dimensions = dimensions;
    const [x, y, z] = options.position ?? [0, 0.5, 0];
    this.position.set(x, y, z);
    this.castShadow = options.castShadow ?? true;
    this.receiveShadow = options.receiveShadow ?? true;
  }

  get halfExtents(): [number, number, number] {
    return [
      this.dimensions[0] / 2,
      this.dimensions[1] / 2,
      this.dimensions[2] / 2,
    ];
  }

  disposeResources(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
