/* ------------------------------------------------------------------ */
/*  Self-Driving Car – localStorage helpers                            */
/* ------------------------------------------------------------------ */

import { SDC_STORAGE_KEYS } from './config';
import type { NeuralNetworkData } from '../neural-network';

export function loadBestBrain(): NeuralNetworkData | null {
  try {
    const raw = localStorage.getItem(SDC_STORAGE_KEYS.bestBrain);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBestBrain(brain: NeuralNetworkData | null): void {
  if (!brain) return;
  localStorage.setItem(SDC_STORAGE_KEYS.bestBrain, JSON.stringify(brain));
}

export function clearBestBrain(): void {
  localStorage.removeItem(SDC_STORAGE_KEYS.bestBrain);
}

export interface SDCSettings {
  carCount: number;
  followRatio: number;
  showNetwork: boolean;
  mutationRate: number;
  trainingIterations: number;
  trainingDurationSeconds: number;
}

export const SDC_DEFAULT_SETTINGS: SDCSettings = {
  carCount: 400,
  followRatio: 0.7,
  showNetwork: true,
  mutationRate: 0.1,
  trainingIterations: 5,
  trainingDurationSeconds: 10,
};

export function loadSettings(): SDCSettings {
  try {
    const raw = localStorage.getItem(SDC_STORAGE_KEYS.settings);
    if (!raw) return { ...SDC_DEFAULT_SETTINGS };
    return { ...SDC_DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...SDC_DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: SDCSettings): void {
  localStorage.setItem(SDC_STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function hasSeenInstructions(): boolean {
  return localStorage.getItem(SDC_STORAGE_KEYS.instructionsSeen) === 'true';
}

export function markInstructionsSeen(): void {
  localStorage.setItem(SDC_STORAGE_KEYS.instructionsSeen, 'true');
}
