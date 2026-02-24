import * as THREE from 'three';

export interface BasicPhysicsSceneConfig {
  backgroundColor: THREE.ColorRepresentation;
  groundSize: number;
  groundHeight: number;
  groundColor: THREE.ColorRepresentation;
  gridDivisions: number;
  gridColor: THREE.ColorRepresentation;
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  directionalLightPosition: [number, number, number];
}

export interface BasicPhysicsSceneObjects {
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  grid: THREE.GridHelper;
  ground: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
}

const DEFAULT_CONFIG: BasicPhysicsSceneConfig = {
  backgroundColor: '#111111',
  groundSize: 20,
  groundHeight: 0.1,
  groundColor: '#444444',
  gridDivisions: 20,
  gridColor: '#616161',
  ambientLightIntensity: 0.6,
  directionalLightIntensity: 0.8,
  directionalLightPosition: [6, 10, 6],
};

export class BasicPhysicsScene {
  readonly config: BasicPhysicsSceneConfig;

  constructor(config: Partial<BasicPhysicsSceneConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  createSceneObjects(): BasicPhysicsSceneObjects {
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      this.config.ambientLightIntensity
    );

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      this.config.directionalLightIntensity
    );
    directionalLight.position.set(...this.config.directionalLightPosition);
    directionalLight.castShadow = true;

    const grid = new THREE.GridHelper(
      this.config.groundSize,
      this.config.gridDivisions,
      this.config.gridColor,
      this.config.gridColor
    );
    grid.position.y = 0.001;

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(
        this.config.groundSize,
        this.config.groundHeight,
        this.config.groundSize
      ),
      new THREE.MeshStandardMaterial({ color: this.config.groundColor })
    );
    ground.position.y = -(this.config.groundHeight / 2);
    ground.receiveShadow = true;

    return {
      ambientLight,
      directionalLight,
      grid,
      ground,
    };
  }
}
