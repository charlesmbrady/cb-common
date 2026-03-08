import React, { useMemo, useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import OrbitScene from './scenes/OrbitScene';
import FpsScene from './scenes/FpsScene';
import KnightModelScene from './scenes/KnightModelScene';

type SceneId = 'orbit' | 'fps' | 'knight';

type SceneOption = {
  id: SceneId;
  title: string;
  description: string;
};

const SCENE_OPTIONS: SceneOption[] = [
  {
    id: 'orbit',
    title: 'Basic Orbit Scene',
    description: 'Ground + cube with orbital camera controls (pan/zoom/orbit).',
  },
  {
    id: 'fps',
    title: 'Basic FPS Scene',
    description:
      'Ground + cube with first-person controls (click canvas, then WASD + mouse).',
  },
  {
    id: 'knight',
    title: 'Knight Model Scene',
    description:
      'Ground + cube plus a loaded knight model from public assets (orbit controls).',
  },
];

function SceneHome({ onSelect }: { onSelect: (scene: SceneId) => void }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">3D Physics Sandbox</Typography>
      <Typography variant="body2" color="text.secondary">
        Choose a scene to launch.
      </Typography>

      <Stack spacing={1.5}>
        {SCENE_OPTIONS.map((scene) => (
          <Paper key={scene.id} variant="outlined" sx={{ p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography variant="subtitle1">{scene.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {scene.description}
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => onSelect(scene.id)}>
                Open
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

export default function PhysicsSandboxBasic() {
  const [activeScene, setActiveScene] = useState<SceneId | null>(null);

  const sceneComponent = useMemo(() => {
    if (activeScene === 'orbit') return <OrbitScene />;
    if (activeScene === 'fps') return <FpsScene />;
    if (activeScene === 'knight') return <KnightModelScene />;
    return null;
  }, [activeScene]);

  if (!activeScene) {
    return <SceneHome onSelect={setActiveScene} />;
  }

  const title =
    SCENE_OPTIONS.find((scene) => scene.id === activeScene)?.title ?? 'Scene';

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{title}</Typography>
        <Button variant="outlined" onClick={() => setActiveScene(null)}>
          Back to scenes
        </Button>
      </Stack>

      <Box sx={{ width: '100%', height: '70vh', minHeight: 420 }}>
        {sceneComponent}
      </Box>
    </Stack>
  );
}
