export type Direction = 'up' | 'down' | 'left' | 'right';

export class Circle {
  x: number;
  y: number;
  r: number;
  direction: Direction;

  constructor(x: number, y: number, r: number, direction: Direction = 'up') {
    this.x = x;
    this.y = y;
    this.r = r;
    this.direction = direction;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw main circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    // Draw forward arrow
    this.drawArrow(ctx);
  }

  getForwardVector(): { dx: number; dy: number } {
    switch (this.direction) {
      case 'up':
        return { dx: 0, dy: -1 };
      case 'down':
        return { dx: 0, dy: 1 };
      case 'left':
        return { dx: -1, dy: 0 };
      case 'right':
        return { dx: 1, dy: 0 };
      default:
        return { dx: 0, dy: -1 };
    }
  }

  drawArrow(ctx: CanvasRenderingContext2D) {
    const { dx, dy } = this.getForwardVector();
    const startX = this.x;
    const startY = this.y;
    const endX = this.x + dx * (this.r + 1);
    const endY = this.y + dy * (this.r + 1);
    ctx.save();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
  }

  drawHand(
    ctx: CanvasRenderingContext2D,
    angle: number,
    handRadius: number,
    handDistance: number
  ) {
    // handDistance is from center (should be >= this.r)
    const hx = this.x + Math.cos(angle) * handDistance;
    const hy = this.y + Math.sin(angle) * handDistance;
    ctx.save();
    ctx.beginPath();
    ctx.arc(hx, hy, handRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f55';
    ctx.fill();
    ctx.restore();
  }
}
