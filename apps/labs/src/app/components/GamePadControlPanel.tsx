import React from 'react';
import { useGamepad, useGamepadContext } from '@cb-common/react-gamepad'; // TODO: Update to Nx alias when available
import {
  ControlPanelToolbar,
  ControlPanelSettingsModal,
} from '@cb-common/ui-react';
import { PSControllerDisplay } from '@cb-common/react-gamepad';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useCamera } from '../contexts/CameraContext';

export const GamePadControlPanel: React.FC = () => {
  const { gamepads } = useGamepadContext();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { followCam, toggleFollowCam } = useCamera();

  const firstPad = gamepads[0] ?? null;

  const theme = useTheme();

  if (!firstPad)
    return <div style={{ color: '#888' }}>No gamepad connected</div>;
  return (
    <div style={{ color: '#0f0', fontFamily: 'monospace', width: '100%' }}>
      <ControlPanelToolbar onSettingsClick={() => setSettingsOpen(true)}>
        <button
          onClick={toggleFollowCam}
          title="Toggle Follow Cam"
          style={{
            width: 20,
            height: 20,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: followCam ? '#4caf50' : '#555',
          }}
        >
          <CenterFocusStrongIcon style={{ fontSize: 16 }} />
        </button>
      </ControlPanelToolbar>
      <Container
        maxWidth="lg"
        sx={{ color: theme.palette.primary.main, mt: 1 }}
      >
        <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <PSControllerDisplay gamepad={firstPad} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <div>Gamepad: {firstPad.id}</div>
            <div style={{ marginTop: 8 }}>
              Buttons:{' '}
              {firstPad.buttons.map((b: { pressed: boolean }, i: number) => (
                <span
                  key={i}
                  style={{
                    marginRight: 6,
                    color: b.pressed ? theme.palette.primary.main : '#888',
                    display: 'inline-block',
                    width: 28,
                    height: 28,
                    lineHeight: '28px',
                    borderRadius: '50%',
                    background: '#222',
                    textAlign: 'center',
                    fontSize: 14,
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          </Box>
          <Box sx={{ flex: 1 }}>
            <div>Axes:</div>
            {firstPad.axes.map((a: number, i: number) => (
              <div key={i}>
                Axis {i}: {a.toFixed(2)}
              </div>
            ))}
          </Box>
        </Box>
      </Container>
      <ControlPanelSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <p>Follow Cam: {followCam ? 'On' : 'Off'}</p>
        {/* additional settings can go here */}
      </ControlPanelSettingsModal>
    </div>
  );
};
