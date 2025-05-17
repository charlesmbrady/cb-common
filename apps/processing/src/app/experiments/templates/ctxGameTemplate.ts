let player = { x: 200, y: 150 };

export function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2ecc40';
  ctx.beginPath();
  ctx.arc(player.x, player.y, 30, 0, Math.PI * 2);
  ctx.fill();
  // Add more game logic here
}
