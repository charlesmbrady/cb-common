/* ------------------------------------------------------------------ */
/*  Road – lane geometry, border segments, and drawing                 */
/* ------------------------------------------------------------------ */

import { SDC_ROAD_CONFIG } from './config';
import { lerp } from '../math';
import type { Point, Segment } from '../geometry';

export class Road {
  x: number;
  width: number;
  laneCount: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  borders: Segment[];

  private roadPattern: CanvasPattern | null = null;
  private grassPattern: CanvasPattern | null = null;

  constructor(x: number, width: number, laneCount = SDC_ROAD_CONFIG.laneCount) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;
    this.left = x - width / 2;
    this.right = x + width / 2;

    const inf = SDC_ROAD_CONFIG.infinity;
    this.top = -inf;
    this.bottom = inf;

    const topLeft: Point = { x: this.left, y: this.top };
    const topRight: Point = { x: this.right, y: this.top };
    const bottomLeft: Point = { x: this.left, y: this.bottom };
    const bottomRight: Point = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex: number): number {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.roadPattern) {
      this.roadPattern = Road.createAsphaltPattern(ctx);
    }
    if (!this.grassPattern) {
      this.grassPattern = Road.createGrassPattern(ctx);
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

    ctx.lineWidth = SDC_ROAD_CONFIG.lineWidth;
    ctx.strokeStyle = 'white';

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const lx = lerp(this.left, this.right, i / this.laneCount);
      ctx.setLineDash(SDC_ROAD_CONFIG.dash as unknown as number[]);
      ctx.beginPath();
      ctx.moveTo(lx, this.top);
      ctx.lineTo(lx, this.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const border of this.borders) {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    }
  }

  /* ---------- Pattern factories ---------------------------------- */

  private static createAsphaltPattern(
    ctx: CanvasRenderingContext2D
  ): CanvasPattern | null {
    const tile = document.createElement('canvas');
    tile.width = 64;
    tile.height = 64;
    const tCtx = tile.getContext('2d');
    if (!tCtx) return null;

    tCtx.fillStyle = '#4d4d4d';
    tCtx.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * 64;
      const y = Math.random() * 64;
      const shade = 70 + Math.floor(Math.random() * 60);
      tCtx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.35)`;
      tCtx.fillRect(x, y, 1, 1);
    }
    return ctx.createPattern(tile, 'repeat');
  }

  private static createGrassPattern(
    ctx: CanvasRenderingContext2D
  ): CanvasPattern | null {
    const tile = document.createElement('canvas');
    tile.width = 96;
    tile.height = 96;
    const tCtx = tile.getContext('2d');
    if (!tCtx) return null;

    tCtx.fillStyle = '#2f6b2f';
    tCtx.fillRect(0, 0, 96, 96);
    for (let i = 0; i < 140; i++) {
      const x = Math.random() * 96;
      const y = Math.random() * 96;
      const lightness = 40 + Math.floor(Math.random() * 25);
      tCtx.fillStyle = `hsl(120, 40%, ${lightness}%)`;
      tCtx.fillRect(x, y, 2, 2);
    }
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 96;
      const y = Math.random() * 96;
      tCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      tCtx.beginPath();
      tCtx.moveTo(x, y);
      tCtx.lineTo(x + 6 - Math.random() * 12, y + 6 - Math.random() * 12);
      tCtx.stroke();
    }
    return ctx.createPattern(tile, 'repeat');
  }
}
