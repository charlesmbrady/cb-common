import * as THREE from 'three';

export type RagdollBoneName =
  | 'pelvis'
  | 'lower_spine'
  | 'upper_spine'
  | 'neck'
  | 'head'
  | 'clavicle.L'
  | 'upper_arm.L'
  | 'lower_arm.L'
  | 'clavicle.R'
  | 'upper_arm.R'
  | 'lower_arm.R'
  | 'hip.L'
  | 'upper_leg.L'
  | 'lower_leg.L'
  | 'foot.L'
  | 'hip.R'
  | 'upper_leg.R'
  | 'lower_leg.R'
  | 'foot.R';

export type RagdollBodyType = 'capsule' | 'box' | 'sphere';
export type RagdollBodyMode = 'kinematic' | 'dynamic';

export interface RagdollBodyDefinition {
  bone: RagdollBoneName;
  collider: {
    type: RagdollBodyType;
    size: [number, number, number];
    offset?: [number, number, number];
  };
  mass: number;
  damping: {
    linear: number;
    angular: number;
  };
  mode: RagdollBodyMode;
}

export interface JointLimitConfig {
  swingX: [number, number];
  swingY: [number, number];
  twist: [number, number];
}

export interface RagdollJointDefinition {
  parent: RagdollBoneName;
  child: RagdollBoneName;
  anchorParent: [number, number, number];
  anchorChild: [number, number, number];
  limits: JointLimitConfig;
}

export interface RagdollRigDefinition {
  rootBone: RagdollBoneName;
  characterRootOffset: THREE.Vector3;
  bodies: RagdollBodyDefinition[];
  joints: RagdollJointDefinition[];
}

export const HUMANOID_BLOCK_RIG: RagdollRigDefinition = {
  rootBone: 'pelvis',
  characterRootOffset: new THREE.Vector3(0, -0.9, 0),
  bodies: [
    {
      bone: 'pelvis',
      collider: { type: 'box', size: [0.22, 0.16, 0.18] },
      mass: 2.5,
      damping: { linear: 0.25, angular: 0.35 },
      mode: 'kinematic',
    },
    {
      bone: 'lower_spine',
      collider: { type: 'box', size: [0.2, 0.18, 0.16] },
      mass: 1.8,
      damping: { linear: 0.25, angular: 0.35 },
      mode: 'kinematic',
    },
    {
      bone: 'upper_spine',
      collider: { type: 'box', size: [0.2, 0.2, 0.16] },
      mass: 1.8,
      damping: { linear: 0.25, angular: 0.35 },
      mode: 'kinematic',
    },
    {
      bone: 'head',
      collider: { type: 'sphere', size: [0.12, 0.12, 0.12] },
      mass: 1.2,
      damping: { linear: 0.2, angular: 0.25 },
      mode: 'kinematic',
    },
    {
      bone: 'upper_arm.L',
      collider: { type: 'capsule', size: [0.07, 0.19, 0.07] },
      mass: 0.8,
      damping: { linear: 0.3, angular: 0.35 },
      mode: 'kinematic',
    },
    {
      bone: 'lower_arm.L',
      collider: { type: 'capsule', size: [0.06, 0.18, 0.06] },
      mass: 0.7,
      damping: { linear: 0.3, angular: 0.35 },
      mode: 'kinematic',
    },
    {
      bone: 'upper_arm.R',
      collider: { type: 'capsule', size: [0.07, 0.19, 0.07] },
      mass: 0.8,
      damping: { linear: 0.3, angular: 0.35 },
      mode: 'kinematic',
    },
    {
      bone: 'lower_arm.R',
      collider: { type: 'capsule', size: [0.06, 0.18, 0.06] },
      mass: 0.7,
      damping: { linear: 0.3, angular: 0.35 },
      mode: 'kinematic',
    },
    {
      bone: 'upper_leg.L',
      collider: { type: 'capsule', size: [0.09, 0.25, 0.09] },
      mass: 1.7,
      damping: { linear: 0.22, angular: 0.3 },
      mode: 'kinematic',
    },
    {
      bone: 'lower_leg.L',
      collider: { type: 'capsule', size: [0.08, 0.24, 0.08] },
      mass: 1.5,
      damping: { linear: 0.22, angular: 0.3 },
      mode: 'kinematic',
    },
    {
      bone: 'upper_leg.R',
      collider: { type: 'capsule', size: [0.09, 0.25, 0.09] },
      mass: 1.7,
      damping: { linear: 0.22, angular: 0.3 },
      mode: 'kinematic',
    },
    {
      bone: 'lower_leg.R',
      collider: { type: 'capsule', size: [0.08, 0.24, 0.08] },
      mass: 1.5,
      damping: { linear: 0.22, angular: 0.3 },
      mode: 'kinematic',
    },
  ],
  joints: [
    {
      parent: 'pelvis',
      child: 'lower_spine',
      anchorParent: [0, 0.09, 0],
      anchorChild: [0, -0.08, 0],
      limits: {
        swingX: [-0.3, 0.3],
        swingY: [-0.2, 0.2],
        twist: [-0.25, 0.25],
      },
    },
    {
      parent: 'lower_spine',
      child: 'upper_spine',
      anchorParent: [0, 0.09, 0],
      anchorChild: [0, -0.09, 0],
      limits: {
        swingX: [-0.35, 0.35],
        swingY: [-0.25, 0.25],
        twist: [-0.3, 0.3],
      },
    },
    {
      parent: 'upper_spine',
      child: 'head',
      anchorParent: [0, 0.11, 0],
      anchorChild: [0, -0.08, 0],
      limits: {
        swingX: [-0.45, 0.45],
        swingY: [-0.45, 0.45],
        twist: [-0.5, 0.5],
      },
    },
    {
      parent: 'upper_spine',
      child: 'upper_arm.L',
      anchorParent: [-0.12, 0.08, 0],
      anchorChild: [0, 0.1, 0],
      limits: { swingX: [-1.1, 1.1], swingY: [-0.9, 0.9], twist: [-1, 1] },
    },
    {
      parent: 'upper_arm.L',
      child: 'lower_arm.L',
      anchorParent: [0, -0.1, 0],
      anchorChild: [0, 0.09, 0],
      limits: { swingX: [0, 1.5], swingY: [0, 0.15], twist: [-0.15, 0.15] },
    },
    {
      parent: 'upper_spine',
      child: 'upper_arm.R',
      anchorParent: [0.12, 0.08, 0],
      anchorChild: [0, 0.1, 0],
      limits: { swingX: [-1.1, 1.1], swingY: [-0.9, 0.9], twist: [-1, 1] },
    },
    {
      parent: 'upper_arm.R',
      child: 'lower_arm.R',
      anchorParent: [0, -0.1, 0],
      anchorChild: [0, 0.09, 0],
      limits: { swingX: [0, 1.5], swingY: [0, 0.15], twist: [-0.15, 0.15] },
    },
    {
      parent: 'pelvis',
      child: 'upper_leg.L',
      anchorParent: [-0.08, -0.09, 0],
      anchorChild: [0, 0.12, 0],
      limits: { swingX: [-1, 0.7], swingY: [-0.4, 0.4], twist: [-0.35, 0.35] },
    },
    {
      parent: 'upper_leg.L',
      child: 'lower_leg.L',
      anchorParent: [0, -0.13, 0],
      anchorChild: [0, 0.12, 0],
      limits: { swingX: [0, 1.6], swingY: [0, 0.15], twist: [-0.2, 0.2] },
    },
    {
      parent: 'pelvis',
      child: 'upper_leg.R',
      anchorParent: [0.08, -0.09, 0],
      anchorChild: [0, 0.12, 0],
      limits: { swingX: [-1, 0.7], swingY: [-0.4, 0.4], twist: [-0.35, 0.35] },
    },
    {
      parent: 'upper_leg.R',
      child: 'lower_leg.R',
      anchorParent: [0, -0.13, 0],
      anchorChild: [0, 0.12, 0],
      limits: { swingX: [0, 1.6], swingY: [0, 0.15], twist: [-0.2, 0.2] },
    },
  ],
};
