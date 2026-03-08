import * as THREE from 'three';

export class GameObject3D {
  protected objects: THREE.Object3D[] = [];

  constructor(public id: string, public label: string) {}

  register<T extends THREE.Object3D>(object: T): T {
    this.objects.push(object);
    return object;
  }

  addToScene(scene: THREE.Scene) {
    for (const obj of this.objects) scene.add(obj);
  }

  removeFromScene(scene: THREE.Scene) {
    for (const obj of this.objects) scene.remove(obj);
  }

  dispose() {
    for (const obj of this.objects) {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }
    this.objects.length = 0;
  }
}
