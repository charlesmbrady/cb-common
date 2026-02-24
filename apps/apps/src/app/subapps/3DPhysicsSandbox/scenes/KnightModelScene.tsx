import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { BasicR3FPhysicsSceneTemplate } from '@cb-common/ui-processing-three-core';
import OrbitCameraControls from './controls/OrbitCameraControls';
import HumanoidBlockCharacter from './characters/HumanoidBlockCharacter';

export default function KnightModelScene() {
  return (
    <BasicR3FPhysicsSceneTemplate
      camera={{ position: [7, 6, 7], fov: 60 }}
      controls={<OrbitCameraControls />}
    >
      <RigidBody type="fixed" colliders={false}>
        <HumanoidBlockCharacter />
      </RigidBody>
    </BasicR3FPhysicsSceneTemplate>
  );
}
