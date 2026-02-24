import * as THREE from 'three';

export class BodyPart3D {
  constructor(
    public readonly id: string,
    public readonly mesh: THREE.Mesh,
    public readonly mass = 1
  ) {
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  addToScene(scene: THREE.Scene) {
    scene.add(this.mesh);
  }

  removeFromScene(scene: THREE.Scene) {
    scene.remove(this.mesh);
  }

  dispose() {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) this.mesh.material.forEach((m) => m.dispose());
    else this.mesh.material.dispose();
  }
}

export class Limb3D extends BodyPart3D {}

export class Joint3D extends BodyPart3D {}

export class Hand3D extends Limb3D {
  constructor(id: string, size = new THREE.Vector3(0.2, 0.14, 0.36), mass = 0.35) {
    super(
      id,
      new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, size.z),
        new THREE.MeshStandardMaterial({ color: 0x8fd6ff, roughness: 0.5, metalness: 0.05 })
      ),
      mass
    );
  }
}
