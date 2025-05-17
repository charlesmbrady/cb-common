import React, { useState, useEffect } from 'react';
import { ArrowPad } from './ArrowPad';
import { WASDPad } from './WASDPad';
import { Joystick } from './Joystick';
import { LeftJoystick } from './LeftJoystick';
import { ControllerButton } from './ControllerButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export interface GameControlPanelProps {
  showJoystick?: boolean;
  onArrow?: (dir: string) => void;
  onWASD?: (key: string) => void;
  onJoystick?: (x: number, y: number) => void;
  onLeftJoystick?: (x: number, y: number) => void;
  paused?: boolean;
  onPauseToggle?: () => void;
  onSpace?: () => void;
  onL1?: () => void;
  onL2?: () => void;
  onR1?: () => void;
  onR2?: () => void;
  onStart?: () => void;
  onOptions?: () => void;
}

export const GameControlPanel: React.FC<GameControlPanelProps> = ({
  showJoystick = true,
  onArrow,
  onWASD,
  onJoystick,
  onLeftJoystick,
  paused = false,
  onPauseToggle,
  onSpace,
  onL1,
  onL2,
  onR1,
  onR2,
  onStart,
  onOptions,
}) => {
  const [spaceActive, setSpaceActive] = useState(false);
  const [pauseActive, setPauseActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpaceActive(true);
        onSpace?.();
      }
      if (e.key.toLowerCase() === 'p') {
        setPauseActive(true);
        onPauseToggle?.();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceActive(false);
      if (e.key.toLowerCase() === 'p') setPauseActive(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onPauseToggle, onSpace]);

  // PlayStation-like proportions
  const joystickSize = isMobile ? 56 : 72;
  const padSize = isMobile ? 44 : 56;
  const shoulderBtnSize = isMobile ? 32 : 40;
  const mainBtnSize = isMobile ? 36 : 48;

  return (
    <Box
      className={'game-control-panel-root'}
      sx={{
        width: '100%',
        minHeight: 100,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        px: 2,
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 1,
        overflowY: 'auto',
      }}
    >
      {/* Row 1: Settings, Pause/Play */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        <IconButton color="default" aria-label="settings">
          <SettingsIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="pause/play"
          onClick={onPauseToggle}
        >
          {paused ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
      </Box>
      {/* Row 2: Controls, flexible and wrapping */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100%',
        }}
      >
        {/* Each control can have a flex or colSpan prop for width */}
        <Box
          sx={{
            flex: '1 1 120px',
            minWidth: 80,
            maxWidth: 160,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Joystick onMove={onLeftJoystick} label="L" />
        </Box>
        <Box
          sx={{
            flex: '1 1 120px',
            minWidth: 80,
            maxWidth: 160,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ArrowPad onArrow={onArrow} />
        </Box>
        <Box
          sx={{
            flex: '1 1 120px',
            minWidth: 80,
            maxWidth: 160,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <WASDPad onWASD={onWASD} />
        </Box>
        <Box
          sx={{
            flex: '1 1 80px',
            minWidth: 60,
            maxWidth: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ControllerButton label="Start" shape="rectangle" onClick={onStart} />
          <ControllerButton
            label="Options"
            shape="rectangle"
            onClick={onOptions}
          />
        </Box>
        <Box
          sx={{
            flex: '1 1 120px',
            minWidth: 80,
            maxWidth: 160,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Joystick onMove={onJoystick} label="R" />
        </Box>
        <Box
          sx={{
            flex: '1 1 80px',
            minWidth: 60,
            maxWidth: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ControllerButton label="L2" shape="circle" onClick={onL2} />
          <ControllerButton label="L1" shape="circle" onClick={onL1} />
        </Box>
        <Box
          sx={{
            flex: '1 1 80px',
            minWidth: 60,
            maxWidth: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ControllerButton label="R1" shape="circle" onClick={onR1} />
          <ControllerButton label="R2" shape="circle" onClick={onR2} />
        </Box>
      </Box>
    </Box>
  );
};

export default GameControlPanel;
