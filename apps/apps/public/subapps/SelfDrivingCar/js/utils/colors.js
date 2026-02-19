export function getRGBA(value) {
  const alpha = Math.min(1, Math.abs(value));
  const isPositive = value > 0;
  const red = isPositive ? 255 : 0;
  const blue = isPositive ? 0 : 255;
  return `rgba(${red}, ${red}, ${blue}, ${alpha})`;
}

export function getRandomColor() {
  const hue = 290 + Math.random() * 260; // avoid blue hues
  return `hsl(${hue}, 100%, 60%)`;
}
