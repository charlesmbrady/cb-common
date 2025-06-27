import * as React from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

export interface CustomAppbarProps {
  open: boolean;
  onMenuClick: () => void;
  onBottomDrawerClick: () => void;
  bottomDrawerOpen: boolean;
  title: string;
}

export const Appbar: React.FC<CustomAppbarProps> = ({
  open,
  onMenuClick,
  onBottomDrawerClick,
  bottomDrawerOpen,
  title,
}) => (
  <StyledAppBar position="fixed" open={open}>
    <Toolbar>
      <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
        {title}
      </Typography>
      <IconButton
        color="inherit"
        aria-label="toggle bottom drawer"
        edge="end"
        onClick={onBottomDrawerClick}
        sx={{ mr: 1 }}
      >
        {bottomDrawerOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={onMenuClick}
        sx={open ? { display: 'none' } : {}}
      >
        <MenuIcon />
      </IconButton>
    </Toolbar>
  </StyledAppBar>
);
