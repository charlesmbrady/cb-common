import React, { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  BasicR3FPhysicsSceneTemplate,
  BasicUnit,
} from '@cb-common/ui-processing-three-core';

function FreeCameraControls() {
  const { camera, gl } = useThree();
  const controls = useMemo(
    () => new OrbitControls(camera, gl.domElement),
    [camera, gl.domElement]
  );

  useEffect(() => {
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.5, 0);
    controls.update();

    return () => {
      controls.dispose();
    };
  }, [controls]);

  useFrame(() => {
    controls.update();
  });

  return null;
}

function SceneBody() {
  const unit = useMemo(() => new BasicUnit({ position: [0, 2, 0] }), []);

  useEffect(() => {
    return () => {
      unit.disposeResources();
    };
  }, [unit]);

  return (
    <>
      <RigidBody colliders="cuboid" restitution={0.2} friction={0.9}>
        <primitive object={unit} />
      </RigidBody>
    </>
  );
}

export default function OrbitScene() {
  return (
    <BasicR3FPhysicsSceneTemplate
      camera={{ position: [6, 5, 6], fov: 60, near: 0.1, far: 1000 }}
      controls={<FreeCameraControls />}
    >
      <SceneBody />
    </BasicR3FPhysicsSceneTemplate>
  );
}
