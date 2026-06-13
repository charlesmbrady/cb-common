import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useColorScheme, useMediaQuery } from '@mui/material';
import { Box, ThreeStage } from '@cb-common/ui-react-mui';

/* ------------------------------------------------------------------ */
/*  Palette per color scheme                                           */
/* ------------------------------------------------------------------ */

type ScenePalette = {
  background: string;
  fog: string;
  shard: string[];
  edge: string;
  ember: string;
  emberOpacity: number;
  shardOpacity: number;
  keyLight: string;
  rimLight: string;
  ambient: number;
};

const DARK_PALETTE: ScenePalette = {
  background: 'hsl(222, 32%, 4%)',
  fog: 'hsl(222, 32%, 4%)',
  shard: ['#2a3550', '#3d4a6b', '#54431f', '#243047'],
  edge: '#c8a85a',
  ember: '#e3c277',
  emberOpacity: 0.65,
  shardOpacity: 0.45,
  keyLight: '#e8c87a',
  rimLight: '#4a6fb5',
  ambient: 0.25,
};

const LIGHT_PALETTE: ScenePalette = {
  background: 'hsl(40, 24%, 98%)',
  fog: 'hsl(40, 24%, 98%)',
  shard: ['#d8d2c2', '#cfc6ae', '#d6cdb8', '#c9cdd6'],
  edge: '#a8852e',
  ember: '#a8852e',
  emberOpacity: 0.22,
  shardOpacity: 0.4,
  keyLight: '#ffffff',
  rimLight: '#b8c4dd',
  ambient: 0.85,
};

/* ------------------------------------------------------------------ */
/*  Scroll camera path                                                 */
/* ------------------------------------------------------------------ */

// Large "waypoint" shards the camera travels between as the page scrolls.
const WAYPOINT_SHARDS = [
  { pos: new THREE.Vector3(0, 0.4, -3), radius: 1.6 },
  { pos: new THREE.Vector3(-5.5, 1.6, -7), radius: 2.1 },
  { pos: new THREE.Vector3(5.5, -1.2, -11), radius: 2.4 },
  { pos: new THREE.Vector3(-1, 2.2, -16), radius: 2.8 },
];

// The camera glides along this spline as scroll progress goes 0 → 1…
const CAMERA_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(2.8, 0.6, 3.5),
    new THREE.Vector3(-2.6, 1.4, -2.5),
    new THREE.Vector3(2.8, -0.4, -7),
    new THREE.Vector3(1.2, 1.6, -9.5),
  ],
  false,
  'centripetal'
);

// …while its gaze eases from one waypoint shard to the next, so there is
// always a subject in frame.
const LOOK_PATH = new THREE.CatmullRomCurve3(
  WAYPOINT_SHARDS.map((w) => w.pos.clone()),
  false,
  'centripetal'
);

const _camTarget = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Full-viewport ambient 3D backdrop: slowly drifting faceted glass shards
 * with hairline gold edges and rising ember particles. Sits behind all page
 * content. Honors prefers-reduced-motion by rendering a static frame.
 */
export function Backdrop3D() {
  const { mode, systemMode } = useColorScheme();
  const resolved = (mode === 'system' ? systemMode : mode) ?? 'dark';
  const palette = resolved === 'light' ? LIGHT_PALETTE : DARK_PALETTE;

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isSmall = useMediaQuery('(max-width: 900px)');

  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef({ target: 0, current: 0 });
  const stateRef = useRef<{
    shards: {
      mesh: THREE.Mesh;
      baseY: number;
      rotSpeed: { x: number; y: number };
      floatSpeed: number;
      floatPhase: number;
      floatAmp: number;
    }[];
    embers: THREE.Points | null;
    emberSpeeds: Float32Array | null;
    time: number;
    look: THREE.Vector3;
  }>({
    shards: [],
    embers: null,
    emberSpeeds: null,
    time: 0,
    look: WAYPOINT_SHARDS[0].pos.clone(),
  });

  const shardCount = isSmall ? 8 : 14;
  const emberCount = isSmall ? 120 : 240;

  // Deterministic pseudo-random so the scene composition is stable.
  const rand = useMemo(() => {
    let seed = 1337;
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }, []);

  const onSetup = useCallback(
    (
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer
    ) => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.shadowMap.enabled = false;

      // Place the camera at the current scroll position along its path so a
      // theme-change remount doesn't swing it across the scene.
      const sc = scroll.current;
      sc.current = sc.target;
      const p0 = THREE.MathUtils.clamp(sc.current, 0, 1);
      CAMERA_PATH.getPointAt(p0, camera.position);
      LOOK_PATH.getPointAt(p0, stateRef.current.look);
      camera.lookAt(stateRef.current.look);

      scene.fog = new THREE.Fog(palette.fog, 16, 34);

      /* ---- Lights ---- */
      const ambient = new THREE.AmbientLight('#ffffff', palette.ambient);
      const key = new THREE.DirectionalLight(palette.keyLight, 2.2);
      key.position.set(6, 8, 6);
      const rim = new THREE.DirectionalLight(palette.rimLight, 1.4);
      rim.position.set(-8, -2, -6);
      const glint = new THREE.PointLight(palette.keyLight, 14, 30);
      glint.position.set(-2, 3, 4);
      scene.add(ambient, key, rim, glint);

      /* ---- Glass shards ---- */
      const disposables: { dispose(): void }[] = [];
      const state = stateRef.current;
      state.shards = [];
      state.time = 0;

      for (let i = 0; i < shardCount; i++) {
        const anchor = i < WAYPOINT_SHARDS.length ? WAYPOINT_SHARDS[i] : null;
        const radius = anchor ? anchor.radius : 0.5 + rand() * 1.4;
        const geo = new THREE.IcosahedronGeometry(radius, 0);
        const mat = new THREE.MeshPhysicalMaterial({
          color: palette.shard[i % palette.shard.length],
          metalness: 0.3,
          roughness: 0.18,
          clearcoat: 1,
          clearcoatRoughness: 0.25,
          transparent: true,
          opacity: palette.shardOpacity,
          flatShading: true,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        let x: number;
        let y: number;
        let z: number;
        if (anchor) {
          ({ x, y, z } = anchor.pos);
        } else {
          x = (rand() - 0.5) * 30;
          y = (rand() - 0.5) * 16;
          z = -3 - rand() * 12;
          // Keep ambient shards out of the camera's travel corridor so the
          // waypoint shards stay the focal points.
          if (Math.abs(x) < 4.5 && z > -15) {
            x = (x < 0 ? -1 : 1) * (4.5 + rand() * 9);
          }
        }
        mesh.position.set(x, y, z);
        mesh.rotation.set(
          rand() * Math.PI * 2,
          rand() * Math.PI * 2,
          rand() * Math.PI * 2
        );
        scene.add(mesh);
        disposables.push(geo, mat);

        // Hairline gold edges on every waypoint shard and half the rest.
        if (anchor || i % 2 === 0) {
          const edges = new THREE.EdgesGeometry(geo);
          const lineMat = new THREE.LineBasicMaterial({
            color: palette.edge,
            transparent: true,
            opacity: resolved === 'light' ? 0.35 : 0.5,
          });
          const lines = new THREE.LineSegments(edges, lineMat);
          mesh.add(lines);
          disposables.push(edges, lineMat);
        }

        state.shards.push({
          mesh,
          baseY: y,
          rotSpeed: anchor
            ? {
                x: (rand() - 0.5) * 0.05,
                y: (rand() - 0.5) * 0.07,
              }
            : {
                x: (rand() - 0.5) * 0.12,
                y: (rand() - 0.5) * 0.16,
              },
          floatSpeed: 0.2 + rand() * 0.3,
          floatPhase: rand() * Math.PI * 2,
          floatAmp: anchor ? 0.15 : 0.4 + rand() * 0.8,
        });
      }

      /* ---- Ember particles ---- */
      const positions = new Float32Array(emberCount * 3);
      const speeds = new Float32Array(emberCount);
      for (let i = 0; i < emberCount; i++) {
        positions[i * 3] = (rand() - 0.5) * 34;
        positions[i * 3 + 1] = (rand() - 0.5) * 20;
        positions[i * 3 + 2] = -2 - rand() * 16;
        speeds[i] = 0.15 + rand() * 0.45;
      }
      const emberGeo = new THREE.BufferGeometry();
      emberGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      const emberMat = new THREE.PointsMaterial({
        color: palette.ember,
        size: 0.07,
        sizeAttenuation: true,
        transparent: true,
        opacity: palette.emberOpacity,
        depthWrite: false,
        blending:
          resolved === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
      });
      const embers = new THREE.Points(emberGeo, emberMat);
      scene.add(embers);
      disposables.push(emberGeo, emberMat);
      state.embers = embers;
      state.emberSpeeds = speeds;

      return () => {
        for (const d of disposables) d.dispose();
        state.shards = [];
        state.embers = null;
        state.emberSpeeds = null;
      };
    },
    [palette, rand, resolved, shardCount, emberCount]
  );

  const onAnimate = useCallback(
    (
      _scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      _renderer: THREE.WebGLRenderer,
      delta: number
    ) => {
      const state = stateRef.current;
      state.time += delta;
      const t = state.time;

      for (const s of state.shards) {
        s.mesh.rotation.x += s.rotSpeed.x * delta;
        s.mesh.rotation.y += s.rotSpeed.y * delta;
        s.mesh.position.y =
          s.baseY + Math.sin(t * s.floatSpeed + s.floatPhase) * s.floatAmp;
      }

      if (state.embers && state.emberSpeeds) {
        const pos = state.embers.geometry.getAttribute(
          'position'
        ) as THREE.BufferAttribute;
        for (let i = 0; i < state.emberSpeeds.length; i++) {
          let y = pos.getY(i) + state.emberSpeeds[i] * delta;
          if (y > 11) y = -11;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }

      // Scroll-driven travel: the camera glides along a spline between the
      // waypoint shards while its gaze eases from one to the next.
      const sc = scroll.current;
      sc.current += (sc.target - sc.current) * Math.min(1, delta * 1.8);
      const p = THREE.MathUtils.clamp(sc.current, 0, 1);
      CAMERA_PATH.getPointAt(p, _camTarget);
      _camTarget.x += pointer.current.x * 0.8;
      _camTarget.y += pointer.current.y * 0.5;
      camera.position.lerp(_camTarget, Math.min(1, delta * 3));
      LOOK_PATH.getPointAt(p, _lookTarget);
      state.look.lerp(_lookTarget, Math.min(1, delta * 3));
      camera.lookAt(state.look);
    },
    []
  );

  const handlePointerMove = useCallback((e: PointerEvent) => {
    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [handlePointerMove]);

  const handleScroll = useCallback(() => {
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    scroll.current.target = Math.min(1, window.scrollY / max);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <ThreeStage
        key={`${resolved}-${shardCount}`}
        onSetup={onSetup}
        onAnimate={onAnimate}
        paused={reducedMotion}
        background={palette.background}
        fov={55}
        sx={{ width: '100%', height: '100%' }}
      />
      {/* Soft vignette + gold haze so content reads cleanly over the scene */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(1200px 600px at 50% -10%, ${
            resolved === 'light'
              ? 'rgba(168, 133, 46, 0.08)'
              : 'rgba(200, 168, 90, 0.10)'
          }, transparent 65%), radial-gradient(ellipse at 50% 120%, ${
            resolved === 'light'
              ? 'rgba(40, 40, 50, 0.06)'
              : 'rgba(0, 0, 0, 0.5)'
          }, transparent 60%)`,
        }}
      />
    </Box>
  );
}
