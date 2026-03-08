import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import {
  BasicR3FPhysicsSceneTemplate,
  BasicUnit,
} from '@cb-common/ui-processing-three-core';

type MoveState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

function FpsControls() {
  const { camera, gl } = useThree();
  const controls = useMemo(
    () => new PointerLockControls(camera, gl.domElement),
    [camera, gl.domElement]
  );
  const moveStateRef = useRef<MoveState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    camera.position.set(0, 1.7, 6);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyW') moveStateRef.current.forward = true;
      if (event.code === 'KeyS') moveStateRef.current.backward = true;
      if (event.code === 'KeyA') moveStateRef.current.left = true;
      if (event.code === 'KeyD') moveStateRef.current.right = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyW') moveStateRef.current.forward = false;
      if (event.code === 'KeyS') moveStateRef.current.backward = false;
      if (event.code === 'KeyA') moveStateRef.current.left = false;
      if (event.code === 'KeyD') moveStateRef.current.right = false;
    };

    const onCanvasClick = () => {
      if (!controls.isLocked) {
        controls.lock();
      }
    };

    controls.connect(gl.domElement);
    gl.domElement.addEventListener('click', onCanvasClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      controls.unlock();
      controls.disconnect();
      gl.domElement.removeEventListener('click', onCanvasClick);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [camera, controls, gl.domElement]);

  useFrame((_, delta) => {
    const speed = 4;
    if (!controls.isLocked) return;

    if (moveStateRef.current.forward) controls.moveForward(speed * delta);
    if (moveStateRef.current.backward) controls.moveForward(-speed * delta);
    if (moveStateRef.current.left) controls.moveRight(-speed * delta);
    if (moveStateRef.current.right) controls.moveRight(speed * delta);

    camera.position.y = 1.7;
  });

  return null;
}

function SceneBody() {
  const unit = useMemo(
    () => new BasicUnit({ position: [0, 2, 0], color: '#8dc3ff' }),
    []
  );

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

export default function FpsScene() {
  return (
    <BasicR3FPhysicsSceneTemplate
      camera={{ position: [0, 1.7, 6], fov: 75, near: 0.1, far: 1000 }}
      controls={<FpsControls />}
    >
      <SceneBody />
    </BasicR3FPhysicsSceneTemplate>
  );
}
