import React, { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function OrbitCameraControls() {
  const { camera, gl } = useThree();
  const controls = useMemo(
    () => new OrbitControls(camera, gl.domElement),
    [camera, gl.domElement]
  );

  useEffect(() => {
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 1, 0);
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
