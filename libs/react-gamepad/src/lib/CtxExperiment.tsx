import React, { useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';

export interface CtxExperimentProps {
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  width?: number;
  height?: number;
}

export const CtxExperiment: React.FC<CtxExperimentProps> = ({
  draw,
  width: canvasWidth = 800,
  height: canvasHeight = 600,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    const canvas = canvasRef.current;
    if (ctx && canvas && draw) {
      draw(ctx, canvas);
    }
    // Optionally, you could add animation frame logic here if needed
  }, [draw, canvasWidth, canvasHeight]);

  return (
    <Paper
      elevation={1}
      sx={{
        width: canvasWidth,
        height: canvasHeight,
        mx: 'auto',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        tabIndex={0}
        style={{ outline: 'none', display: 'block' }}
      />
    </Paper>
  );
};

export default CtxExperiment;
