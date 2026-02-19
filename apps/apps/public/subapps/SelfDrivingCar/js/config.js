export const CAR_CONFIG = {
  width: 30,
  height: 50,
  maxSpeed: 3,
  acceleration: 0.2,
  friction: 0.05,
  angleStep: 0.03,
};

export const SENSOR_CONFIG = {
  rayCount: 11,
  rayLength: 500,
  raySpread: Math.PI / 2,
};

export const ROAD_CONFIG = {
  laneCount: 3,
  lineWidth: 5,
  dash: [20, 20],
  infinity: 100000,
};

export const SIM_CONFIG = {
  carCount: 400,
  followRatio: 0.7, //how much of the road ahead we see / how closely we follow the focused car (0-1)
};

export const STORAGE_KEYS = {
  bestBrain: 'bestBrain',
  instructionsSeen: 'instructionsSeen',
  settings: 'sdcSettings',
};
