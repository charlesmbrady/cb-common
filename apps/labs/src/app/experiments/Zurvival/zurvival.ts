import p5 from 'p5';

const PLAYER_KEY = Symbol('player');

type Player = { x: number; y: number };

declare global {
  interface p5 {
    [PLAYER_KEY]?: Player;
  }
}

export function setup(p: p5, _gamepad?: any) {
  // Initialize game state for zurvival (Matter.js based)
  (p as any)[PLAYER_KEY] = {
    x: (p as any).width / 2,
    y: (p as any).height / 2,
  };
  p.background(30);
}

export function update(p: p5, gamepad?: any, followCam?: boolean) {
  // Main game loop for zurvival
  const player = (p as any)[PLAYER_KEY] as Player | undefined;
  if (!player) return;
  if (gamepad) {
    // Use left stick (axes 0 and 1) to move player
    const speed = 4;
    const dx = (gamepad.axes[0] || 0) * speed;
    const dy = (gamepad.axes[1] || 0) * speed;
    player.x += dx;
    player.y += dy;
  }
  p.background(30);
  if (followCam) {
    const w = (p as any).width;
    const h = (p as any).height;
    p.translate(w / 2 - player.x, h / 2 - player.y, 0);
  }
  p.fill('#0f0');
  p.ellipse(player.x, player.y, 40, 40); // Player
  // Add zurvival game logic here (Matter.js integration, etc.)
}
