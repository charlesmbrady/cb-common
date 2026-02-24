/* ------------------------------------------------------------------ */
/*  three-core – Three.js engine library                               */
/* ------------------------------------------------------------------ */

export {
  createScene,
  disposeScene,
  type SceneManagerOptions,
} from './lib/scene-manager';
export {
  BasicPhysicsScene,
  type BasicPhysicsSceneConfig,
  type BasicPhysicsSceneObjects,
} from './lib/basic-physics-scene';
export * from './lib/templates';
export { CollisionWorld, type AABB, type RayHit } from './lib/collision-world';
export * from './lib/units';
export * from './lib/self-driving-car-3d';
