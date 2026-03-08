import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SDCSimulation3D } from './simulation3d';
import type { SDC3DSettings } from './storage3d';

export interface SDCSimulation3DControllerProps {
  settings: SDC3DSettings;
  paused: boolean;
  onReady?: (sim: SDCSimulation3D) => void;
  onTrainingStateChange?: (active: boolean) => void;
}

export interface SDCSimulation3DCanvasProps {
  settings: SDC3DSettings;
  paused?: boolean;
  onReady?: (sim: SDCSimulation3D) => void;
  onTrainingStateChange?: (active: boolean) => void;
}

export function SDCSimulation3DCanvas({
  settings,
  paused = false,
  onReady,
  onTrainingStateChange,
}: SDCSimulation3DCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const simRef = useRef<SDCSimulation3D | null>(null);
  const pausedRef = useRef(paused);
  const settingsRef = useRef(settings);

  pausedRef.current = paused;
  settingsRef.current = settings;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();

    const sim = new SDCSimulation3D(
      scene,
      settingsRef.current,
      onTrainingStateChange
    );
    sim.setupLighting(scene);
    sim.setupCamera(camera);
    sim.paused = pausedRef.current;
    simRef.current = sim;
    onReady?.(sim);

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const timer = new THREE.Timer();
    let raf = 0;
    const loop = () => {
      timer.update();
      const delta = timer.getDelta();

      const current = simRef.current;
      if (current) {
        current.paused = pausedRef.current;
        current.settings = { ...settingsRef.current };
        current.setSensorsVisible(settingsRef.current.showSensors);
        current.tick(delta);
        current.updateCamera(camera, delta);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      sim.dispose();
      simRef.current = null;
      renderer.dispose();
      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [onReady, onTrainingStateChange]);

  return <div ref={hostRef} style={{ width: '100%', height: '100%' }} />;
}
