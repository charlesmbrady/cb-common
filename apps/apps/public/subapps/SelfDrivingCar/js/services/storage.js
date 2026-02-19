import { STORAGE_KEYS } from '../config.js';

export function loadBestBrain() {
  const raw = localStorage.getItem(STORAGE_KEYS.bestBrain);
  return raw ? JSON.parse(raw) : null;
}

export function saveBestBrain(brain) {
  if (!brain) return;
  localStorage.setItem(STORAGE_KEYS.bestBrain, JSON.stringify(brain));
}

export function clearBestBrain() {
  localStorage.removeItem(STORAGE_KEYS.bestBrain);
}
