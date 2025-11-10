import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Paper from '@mui/material/Paper';

export interface P5ExperimentProps {
  setup: (p: p5) => void;
  draw: (p: p5) => void;
  width?: number;
  height?: number;
}

export const P5Experiment: React.FC<P5ExperimentProps> = ({
  setup,
  draw,
  width: canvasWidth = 800,
  height: canvasHeight = 600,
}) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let canvas: p5 | null = null;
    const sketch = (p: p5) => {
      p.setup = () => {
        (p.createCanvas as any)(canvasWidth, canvasHeight);
        if (setup) setup(p);
      };
      p.draw = () => {
        if (draw) draw(p);
      };
    };
    if (sketchRef.current) {
      canvas = new p5(sketch, sketchRef.current);
    }
    return () => {
      if (canvas) canvas.remove();
    };
  }, [setup, draw, canvasWidth, canvasHeight]);

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
      <div ref={sketchRef} style={{ width: '100%', height: '100%' }} />
    </Paper>
  );
};

export default P5Experiment;
