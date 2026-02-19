import { ROAD_CONFIG } from '../config.js';
import { lerp } from '../utils/math.js';

export class Road {
  constructor(x, width, laneCount = ROAD_CONFIG.laneCount) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = ROAD_CONFIG.infinity;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];

    this.roadPattern = null;
    this.grassPattern = null;
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  draw(ctx) {
    if (!this.roadPattern) {
      this.roadPattern = createAsphaltPattern(ctx);
    }
    if (!this.grassPattern) {
      this.grassPattern = createGrassPattern(ctx);
    }

    const grassWidth = this.width * 4;
    const grassLeft = this.x - grassWidth / 2;
    if (this.grassPattern) {
      ctx.fillStyle = this.grassPattern;
      ctx.fillRect(grassLeft, this.top, grassWidth, this.bottom - this.top);
    }

    if (this.roadPattern) {
      ctx.fillStyle = this.roadPattern;
      ctx.fillRect(this.left, this.top, this.width, this.bottom - this.top);
    }

    ctx.lineWidth = ROAD_CONFIG.lineWidth;
    ctx.strokeStyle = 'white';

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      ctx.setLineDash(ROAD_CONFIG.dash);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}

function createAsphaltPattern(ctx) {
  const tile = document.createElement('canvas');
  tile.width = 64;
  tile.height = 64;
  const tCtx = tile.getContext('2d');

  tCtx.fillStyle = '#4d4d4d';
  tCtx.fillRect(0, 0, tile.width, tile.height);

  for (let i = 0; i < 180; i++) {
    const x = Math.random() * tile.width;
    const y = Math.random() * tile.height;
    const shade = 70 + Math.floor(Math.random() * 60);
    tCtx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.35)`;
    tCtx.fillRect(x, y, 1, 1);
  }

  return ctx.createPattern(tile, 'repeat');
}

function createGrassPattern(ctx) {
  const tile = document.createElement('canvas');
  tile.width = 96;
  tile.height = 96;
  const tCtx = tile.getContext('2d');

  tCtx.fillStyle = '#2f6b2f';
  tCtx.fillRect(0, 0, tile.width, tile.height);

  for (let i = 0; i < 140; i++) {
    const x = Math.random() * tile.width;
    const y = Math.random() * tile.height;
    const lightness = 40 + Math.floor(Math.random() * 25);
    tCtx.fillStyle = `hsl(120, 40%, ${lightness}%)`;
    tCtx.fillRect(x, y, 2, 2);
  }

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * tile.width;
    const y = Math.random() * tile.height;
    tCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    tCtx.beginPath();
    tCtx.moveTo(x, y);
    tCtx.lineTo(x + 6 - Math.random() * 12, y + 6 - Math.random() * 12);
    tCtx.stroke();
  }

  return ctx.createPattern(tile, 'repeat');
}
