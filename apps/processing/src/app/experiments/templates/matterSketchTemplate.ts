import p5 from 'p5';

export function setup(p: p5) {
  // Setup your Matter.js sketch here
  p.background(220);
}

export function update(p: p5) {
  // Update your Matter.js sketch here
  p.background(220);
  p.fill('#888');
  p.ellipse((p as any).width / 2, (p as any).height / 2, 80, 80);
}
