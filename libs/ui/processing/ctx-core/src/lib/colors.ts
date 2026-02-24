/* ------------------------------------------------------------------ */
/*  colors – RGBA for network visualiser & random car hues             */
/* ------------------------------------------------------------------ */

/** Map a weight / activation value to a yellow-blue RGBA string. */
export function getRGBA(value: number): string {
  const alpha = Math.min(1, Math.abs(value));
  const isPositive = value > 0;
  const red = isPositive ? 255 : 0;
  const blue = isPositive ? 0 : 255;
  return `rgba(${red}, ${red}, ${blue}, ${alpha})`;
}

/** Random HSL avoiding blue hues so cars look distinct from the road. */
export function getRandomColor(): string {
  const hue = 290 + Math.random() * 260;
  return `hsl(${hue}, 100%, 60%)`;
}
