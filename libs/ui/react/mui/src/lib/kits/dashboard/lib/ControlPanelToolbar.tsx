import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

export interface ControlPanelToolbarProps {
  onSettingsClick?: () => void;
  children?: React.ReactNode;
}

export const ControlPanelToolbar: React.FC<ControlPanelToolbarProps> = ({
  onSettingsClick,
  children,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: 20,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        px: 1,
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        {children}
      </Box>
      <IconButton
        size="small"
        onClick={onSettingsClick}
        aria-label="open settings"
        sx={{ color: 'inherit' }}
      >
        <SettingsIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ControlPanelToolbar;
