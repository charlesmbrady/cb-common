import p5 from 'p5';

export function setup(p: p5) {
  // Setup your sketch here
  p.background(240);
}

export function draw(p: p5) {
  // Draw your sketch here
  p.background(240);
  p.fill('#3498db');
  p.ellipse((p as any).width / 2, (p as any).height / 2, 80, 80);
}
