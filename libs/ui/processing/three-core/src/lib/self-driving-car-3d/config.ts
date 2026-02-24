/* ------------------------------------------------------------------ */
/*  Self-Driving Car 3D – shared configuration constants               */
/* ------------------------------------------------------------------ */

export const SDC3D_CAR_CONFIG = {
  width: 2,
  height: 1,
  length: 4,
  maxSpeed: 30,
  acceleration: 15,
  friction: 0.92,
  turnRate: 2.0,
  dummySpeed: 20,
};

export const SDC3D_SENSOR_CONFIG = {
  rayCount: 9,
  rayLength: 40,
  raySpread: Math.PI / 2,
  rayHeight: 0.5,
};

export const SDC3D_ROAD_CONFIG = {
  laneCount: 3,
  laneWidth: 3.5,
  roadLength: 800,
  wallHeight: 1.2,
  wallThickness: 0.3,
};

export const SDC3D_SIM_CONFIG = {
  carCount: 200,
  followHeight: 12,
  followDistance: 18,
  cameraLerpSpeed: 4,
};

export const SDC3D_STORAGE_KEYS = {
  bestBrain: 'sdc3d_bestBrain',
  instructionsSeen: 'sdc3d_instructionsSeen',
  settings: 'sdc3d_settings',
} as const;
