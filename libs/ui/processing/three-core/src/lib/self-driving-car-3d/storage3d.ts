/* ------------------------------------------------------------------ */
/*  Self-Driving Car 3D – localStorage helpers                         */
/* ------------------------------------------------------------------ */

import type { NeuralNetworkData } from '../neural-network';
import { SDC3D_STORAGE_KEYS, SDC3D_SIM_CONFIG } from './config';

/* ---------- Brain persistence ------------------------------------ */

export function loadBestBrain3D(): NeuralNetworkData | null {
  try {
    const raw = localStorage.getItem(SDC3D_STORAGE_KEYS.bestBrain);
    return raw ? (JSON.parse(raw) as NeuralNetworkData) : null;
  } catch {
    return null;
  }
}

export function saveBestBrain3D(
  brain: NeuralNetworkData | null | undefined
): void {
  if (!brain) return;
  localStorage.setItem(SDC3D_STORAGE_KEYS.bestBrain, JSON.stringify(brain));
}

export function clearBestBrain3D(): void {
  localStorage.removeItem(SDC3D_STORAGE_KEYS.bestBrain);
}

/* ---------- Settings -------------------------------------------- */

export interface SDC3DSettings {
  carCount: number;
  mutationRate: number;
  showSensors: boolean;
  trainingIterations: number;
  trainingDurationSeconds: number;
}

export const SDC3D_DEFAULT_SETTINGS: SDC3DSettings = {
  carCount: SDC3D_SIM_CONFIG.carCount,
  mutationRate: 0.15,
  showSensors: true,
  trainingIterations: 5,
  trainingDurationSeconds: 12,
};

export function loadSettings3D(): SDC3DSettings {
  try {
    const raw = localStorage.getItem(SDC3D_STORAGE_KEYS.settings);
    if (!raw) return { ...SDC3D_DEFAULT_SETTINGS };
    return { ...SDC3D_DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...SDC3D_DEFAULT_SETTINGS };
  }
}

export function saveSettings3D(settings: SDC3DSettings): void {
  localStorage.setItem(SDC3D_STORAGE_KEYS.settings, JSON.stringify(settings));
}

/* ---------- Onboarding ------------------------------------------ */

export function hasSeenInstructions3D(): boolean {
  return localStorage.getItem(SDC3D_STORAGE_KEYS.instructionsSeen) === 'true';
}

export function markInstructionsSeen3D(): void {
  localStorage.setItem(SDC3D_STORAGE_KEYS.instructionsSeen, 'true');
}
