/* ------------------------------------------------------------------ */
/*  Three-core – Scene Manager                                         */
/*  Utility for creating and managing a Three.js scene lifecycle.       */
/* ------------------------------------------------------------------ */

import * as THREE from 'three';

export interface SceneManagerOptions {
  background?: string | number;
  fog?: { color: string | number; near: number; far: number };
  ambientLight?: { color: number; intensity: number };
  directionalLight?: {
    color: number;
    intensity: number;
    position: [number, number, number];
    castShadow?: boolean;
  };
}

/**
 * Creates a pre-configured scene with common defaults
 * (ambient light, directional light, optional fog).
 */
export function createScene(options: SceneManagerOptions = {}): THREE.Scene {
  const scene = new THREE.Scene();

  if (options.background !== undefined) {
    scene.background = new THREE.Color(options.background);
  }

  if (options.fog) {
    scene.fog = new THREE.Fog(
      new THREE.Color(options.fog.color),
      options.fog.near,
      options.fog.far
    );
  }

  if (options.ambientLight) {
    const ambient = new THREE.AmbientLight(
      options.ambientLight.color,
      options.ambientLight.intensity
    );
    scene.add(ambient);
  }

  if (options.directionalLight) {
    const dir = new THREE.DirectionalLight(
      options.directionalLight.color,
      options.directionalLight.intensity
    );
    dir.position.set(...options.directionalLight.position);
    if (options.directionalLight.castShadow) {
      dir.castShadow = true;
      dir.shadow.mapSize.width = 2048;
      dir.shadow.mapSize.height = 2048;
      dir.shadow.camera.near = 0.5;
      dir.shadow.camera.far = 200;
      dir.shadow.camera.left = -50;
      dir.shadow.camera.right = 50;
      dir.shadow.camera.top = 50;
      dir.shadow.camera.bottom = -50;
    }
    scene.add(dir);
  }

  return scene;
}

/**
 * Disposes all geometries, materials, and textures in a scene graph.
 */
export function disposeScene(scene: THREE.Scene): void {
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material?.dispose();
      }
    }
  });
}
