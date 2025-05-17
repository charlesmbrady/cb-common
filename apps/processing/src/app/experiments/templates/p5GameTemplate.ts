import p5 from 'p5';

let player: { x: number; y: number };

export function setup(p: p5) {
  // Initialize game state
  player = { x: (p as any).width / 2, y: (p as any).height / 2 };
  p.background(30);
}

export function draw(p: p5) {
  // Main game loop
  p.background(30);
  p.fill('#0f0');
  p.ellipse(player.x, player.y, 40, 40); // Player
  // Add more game logic here
}
