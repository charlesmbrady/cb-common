class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, size = 18, color = 'black') {
    ctx.beginPath();
    const radius = size / 2;
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}
