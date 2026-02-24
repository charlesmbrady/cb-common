import * as React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ThreeStageHandle {
  /** The underlying HTMLDivElement container. */
  container: HTMLDivElement | null;
  /** The Three.js WebGLRenderer instance. */
  renderer: THREE.WebGLRenderer | null;
  /** The Three.js Scene. */
  scene: THREE.Scene | null;
  /** The Three.js Camera. */
  camera: THREE.PerspectiveCamera | null;
}

export interface ThreeStageProps {
  /**
   * Called once after mount. Set up scene objects, lights, etc.
   * Return an optional cleanup function.
   */
  onSetup?: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => void | (() => void);

  /**
   * Called every animation frame while not paused.
   * `delta` is the time in seconds since the last frame.
   */
  onAnimate?: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    delta: number
  ) => void;

  /**
   * Called when the container resizes.
   */
  onResize?: (width: number, height: number) => void;

  /** When `true` the rAF loop still runs but `onAnimate` is skipped. */
  paused?: boolean;

  /** Fixed width in px — pass `undefined` to auto-fill the container. */
  width?: number;

  /** Fixed height in px — pass `undefined` to auto-fill the container. */
  height?: number;

  /** MUI sx applied to the outer Box wrapper. */
  sx?: SxProps<Theme>;

  /** Whether the canvas should auto-resize to its container. Default true. */
  autoResize?: boolean;

  /** CSS background colour applied via scene. Default '#000'. */
  background?: string;

  /** Camera field of view. Default 60. */
  fov?: number;

  /** Camera near plane. Default 0.1. */
  near?: number;

  /** Camera far plane. Default 2000. */
  far?: number;

  /** Enable antialiasing. Default true. */
  antialias?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ThreeStage = React.forwardRef<ThreeStageHandle, ThreeStageProps>(
  function ThreeStage(
    {
      onSetup,
      onAnimate,
      onResize,
      paused = false,
      width: fixedWidth,
      height: fixedHeight,
      sx,
      autoResize = true,
      background = '#000',
      fov = 60,
      near = 0.1,
      far = 2000,
      antialias = true,
    },
    ref
  ) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = React.useRef<THREE.Scene | null>(null);
    const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
    const timerRef = React.useRef<THREE.Timer | null>(null);
    const rafId = React.useRef<number>(0);
    const setupCalled = React.useRef(false);
    const cleanupRef = React.useRef<(() => void) | null>(null);

    // Keep latest callbacks in refs so the rAF loop never goes stale.
    const animateRef = React.useRef(onAnimate);
    animateRef.current = onAnimate;
    const pausedRef = React.useRef(paused);
    pausedRef.current = paused;

    /* ---------- Imperative handle --------------------------------- */
    React.useImperativeHandle(ref, () => ({
      get container() {
        return containerRef.current;
      },
      get renderer() {
        return rendererRef.current;
      },
      get scene() {
        return sceneRef.current;
      },
      get camera() {
        return cameraRef.current;
      },
    }));

    /* ---------- Resize helper ------------------------------------- */
    const syncSize = React.useCallback(() => {
      const container = containerRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      if (!container || !renderer || !camera) return;

      const w = fixedWidth ?? container.clientWidth;
      const h = fixedHeight ?? container.clientHeight;

      if (renderer.domElement.width !== w || renderer.domElement.height !== h) {
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        onResize?.(w, h);
      }
    }, [fixedWidth, fixedHeight, onResize]);

    /* ---------- Setup + animation loop ---------------------------- */
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const w = fixedWidth ?? (container.clientWidth || 800);
      const h = fixedHeight ?? (container.clientHeight || 600);

      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias, alpha: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(background);
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(fov, w / h, near, far);
      cameraRef.current = camera;

      // Timer (replaces deprecated Clock)
      const timer = new THREE.Timer();
      timerRef.current = timer;

      if (!setupCalled.current) {
        const cleanupFn = onSetup?.(scene, camera, renderer);
        if (typeof cleanupFn === 'function') {
          cleanupRef.current = cleanupFn;
        }
        setupCalled.current = true;
      }

      const loop = () => {
        timer.update();
        const delta = timer.getDelta();
        if (!pausedRef.current) {
          animateRef.current?.(scene, camera, renderer, delta);
        }
        renderer.render(scene, camera);
        rafId.current = requestAnimationFrame(loop);
      };
      rafId.current = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(rafId.current);
        cleanupRef.current?.();
        cleanupRef.current = null;
        setupCalled.current = false;
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
      // We intentionally run this effect only on mount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- Resize observer ----------------------------------- */
    React.useEffect(() => {
      if (!autoResize) return;
      const container = containerRef.current;
      if (!container) return;

      const ro = new ResizeObserver(() => syncSize());
      ro.observe(container);
      return () => ro.disconnect();
    }, [autoResize, syncSize]);

    /* ---------- Render -------------------------------------------- */
    return (
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: fixedWidth ?? '100%',
          height: fixedHeight ?? '100%',
          '& canvas': { display: 'block' },
          ...((sx ?? {}) as Record<string, unknown>),
        }}
      />
    );
  }
);

export default ThreeStage;
