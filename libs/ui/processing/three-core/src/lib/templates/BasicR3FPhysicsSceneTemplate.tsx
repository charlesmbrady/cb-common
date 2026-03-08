import React, { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import {
  BasicPhysicsScene,
  type BasicPhysicsSceneConfig,
} from '../basic-physics-scene';

export interface BasicR3FPhysicsSceneTemplateProps {
  camera: {
    position: [number, number, number];
    fov: number;
    near?: number;
    far?: number;
  };
  sceneConfig?: Partial<BasicPhysicsSceneConfig>;
  gravity?: [number, number, number];
  controls?: React.ReactNode;
  children?: React.ReactNode;
}

function SceneContent({
  sceneConfig,
  gravity,
  controls,
  children,
}: Pick<
  BasicR3FPhysicsSceneTemplateProps,
  'sceneConfig' | 'gravity' | 'controls' | 'children'
>) {
  const sceneBuilder = useMemo(() => new BasicPhysicsScene(sceneConfig), [sceneConfig]);
  const sceneObjects = useMemo(
    () => sceneBuilder.createSceneObjects(),
    [sceneBuilder]
  );

  useEffect(() => {
    return () => {
      sceneObjects.ground.geometry.dispose();
      sceneObjects.ground.material.dispose();
    };
  }, [sceneObjects]);

  return (
    <>
      <color attach="background" args={[sceneBuilder.config.backgroundColor]} />
      <primitive object={sceneObjects.ambientLight} />
      <primitive object={sceneObjects.directionalLight} />
      <primitive object={sceneObjects.grid} />

      <Physics gravity={gravity ?? [0, -9.81, 0]}>
        <RigidBody type="fixed" colliders="cuboid">
          <primitive object={sceneObjects.ground} />
        </RigidBody>
        {children}
      </Physics>

      {controls}
    </>
  );
}

export function BasicR3FPhysicsSceneTemplate({
  camera,
  sceneConfig,
  gravity,
  controls,
  children,
}: BasicR3FPhysicsSceneTemplateProps) {
  return (
    <Canvas
      shadows
      camera={{
        position: camera.position,
        fov: camera.fov,
        near: camera.near ?? 0.1,
        far: camera.far ?? 1000,
      }}
    >
      <SceneContent
        sceneConfig={sceneConfig}
        gravity={gravity}
        controls={controls}
      >
        {children}
      </SceneContent>
    </Canvas>
  );
}

export default BasicR3FPhysicsSceneTemplate;
