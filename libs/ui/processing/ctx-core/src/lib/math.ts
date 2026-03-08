/* ------------------------------------------------------------------ */
/*  math – interpolation & basic helpers                               */
/* ------------------------------------------------------------------ */

export function lerp(A: number, B: number, t: number): number {
  return A + (B - A) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
