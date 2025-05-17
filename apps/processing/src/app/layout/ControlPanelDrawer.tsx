import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const bottomDrawerHeight = 220;

export interface ControlPanelDrawerProps {
  open: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const ControlPanelDrawer: React.FC<ControlPanelDrawerProps> = ({
  open,
  children,
}) => (
  <Drawer
    sx={{
      height: bottomDrawerHeight,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        height: bottomDrawerHeight,
        maxHeight: '60vh',
        width: '100%',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        p: 0,
      },
    }}
    variant="persistent"
    anchor="bottom"
    open={open}
  >
    {children}
  </Drawer>
);
