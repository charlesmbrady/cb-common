import * as React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CanvasStageHandle {
  /** The underlying HTMLCanvasElement (null until mounted). */
  canvas: HTMLCanvasElement | null;
  /** The 2D rendering context (null until mounted). */
  ctx: CanvasRenderingContext2D | null;
}

export interface CanvasStageProps {
  /**
   * Called once after mount with the 2D context.
   * Use it to initialise textures, patterns, etc.
   */
  onSetup?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;

  /**
   * Called every animation frame while the stage is not paused.
   * `time` is the DOMHighResTimeStamp from `requestAnimationFrame`.
   */
  onDraw?: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number
  ) => void;

  /**
   * Called on window / container resize so you can adjust world coords.
   * Width and height are the *new* pixel dimensions of the canvas.
   */
  onResize?: (width: number, height: number) => void;

  /** When `true` the rAF loop still runs but `onDraw` is skipped. */
  paused?: boolean;

  /** Fixed width in px — pass `undefined` to auto-fill the container. */
  width?: number;

  /** Fixed height in px — pass `undefined` to auto-fill the container. */
  height?: number;

  /** MUI sx applied to the outer Box wrapper. */
  sx?: SxProps<Theme>;

  /** MUI sx applied to the canvas element itself. */
  canvasSx?: SxProps<Theme>;

  /** Optional HTML id for the canvas element. */
  id?: string;

  /** Whether the canvas should auto-resize to its container. Default true. */
  autoResize?: boolean;

  /** CSS background colour applied directly to the canvas. */
  background?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const CanvasStage = React.forwardRef<
  CanvasStageHandle,
  CanvasStageProps
>(function CanvasStage(
  {
    onSetup,
    onDraw,
    onResize,
    paused = false,
    width: fixedWidth,
    height: fixedHeight,
    sx,
    canvasSx,
    id,
    autoResize = true,
    background,
  },
  ref
) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const rafId = React.useRef<number>(0);
  const setupCalled = React.useRef(false);

  // Keep latest callbacks in refs so the rAF loop never goes stale.
  const drawRef = React.useRef(onDraw);
  drawRef.current = onDraw;
  const pausedRef = React.useRef(paused);
  pausedRef.current = paused;

  /* ---------- Imperative handle --------------------------------- */
  React.useImperativeHandle(ref, () => ({
    get canvas() {
      return canvasRef.current;
    },
    get ctx() {
      return ctxRef.current;
    },
  }));

  /* ---------- Resize helper ------------------------------------- */
  const syncSize = React.useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = fixedWidth ?? container.clientWidth;
    const h = fixedHeight ?? container.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      onResize?.(w, h);
    }
  }, [fixedWidth, fixedHeight, onResize]);

  /* ---------- Setup + animation loop ---------------------------- */
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    syncSize();

    if (!setupCalled.current) {
      onSetup?.(ctx, canvas);
      setupCalled.current = true;
    }

    const loop = (time: number) => {
      if (!pausedRef.current) {
        drawRef.current?.(ctx, canvas, time);
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId.current);
    };
    // We intentionally run this effect only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Resize observer ----------------------------------- */
  React.useEffect(() => {
    if (!autoResize) return;
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => syncSize());
    ro.observe(container);
    return () => ro.disconnect();
  }, [autoResize, syncSize]);

  /* ---------- Render -------------------------------------------- */
  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: fixedWidth ?? '100%',
        height: fixedHeight ?? '100%',
        ...((sx ?? {}) as Record<string, unknown>),
      }}
    >
      <Box
        component="canvas"
        ref={canvasRef}
        id={id}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          background: background ?? 'transparent',
          ...((canvasSx ?? {}) as Record<string, unknown>),
        }}
      />
    </Box>
  );
});

export default CanvasStage;
