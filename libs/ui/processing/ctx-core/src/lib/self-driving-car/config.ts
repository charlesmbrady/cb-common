/* ------------------------------------------------------------------ */
/*  Self-Driving Car – shared configuration constants                  */
/* ------------------------------------------------------------------ */

export const SDC_CAR_CONFIG: {
  width: number;
  height: number;
  maxSpeed: number;
  acceleration: number;
  friction: number;
  angleStep: number;
} = {
  width: 30,
  height: 50,
  maxSpeed: 3,
  acceleration: 0.2,
  friction: 0.05,
  angleStep: 0.03,
};

export const SDC_SENSOR_CONFIG = {
  rayCount: 11,
  rayLength: 500,
  raySpread: Math.PI / 2,
} as const;

export const SDC_ROAD_CONFIG = {
  laneCount: 3,
  lineWidth: 5,
  dash: [20, 20] as readonly number[],
  infinity: 100_000,
} as const;

export const SDC_SIM_CONFIG = {
  carCount: 400,
  followRatio: 0.7,
} as const;

export const SDC_STORAGE_KEYS = {
  bestBrain: 'sdc_bestBrain',
  instructionsSeen: 'sdc_instructionsSeen',
  settings: 'sdc_settings',
} as const;
