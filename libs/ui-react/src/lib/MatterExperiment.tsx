import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Paper from '@mui/material/Paper';

declare const module: { hot?: { dispose(callback: () => void): void } };

export interface MatterExperimentProps {
  setup: (p: p5, gamepad?: any) => void;
  update: (p: p5, gamepad?: any, followCam?: boolean) => void;
  width?: number;
  height?: number;
  gamepad?: any;
  followCam?: boolean;
}

export const MatterExperiment: React.FC<MatterExperimentProps> = ({
  setup,
  update,
  width: canvasWidth = 800,
  height: canvasHeight = 600,
  gamepad,
  followCam,
}) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const gamepadRef = React.useRef<any>(gamepad);

  React.useEffect(() => {
    gamepadRef.current = gamepad;
  }, [gamepad]);

  useEffect(() => {
    let canvas: p5 | null = null;
    const sketch = (p: p5) => {
      p.setup = () => {
        (p.createCanvas as any)(canvasWidth, canvasHeight);
        if (setup) setup(p, gamepad);
      };
      p.draw = () => {
        if (update) update(p, gamepadRef.current, followCam);
      };
    };
    if (sketchRef.current) {
      canvas = new p5(sketch, sketchRef.current);
    }
    return () => {
      if (canvas) canvas.remove();
    };
  }, [setup, update, canvasWidth, canvasHeight, followCam]);

  if (typeof module !== 'undefined' && module.hot) {
    module.hot.dispose(() => {
      window.location.reload();
    });
  }

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

export default MatterExperiment;
