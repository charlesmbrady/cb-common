import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  selected: number;
  onSelect: (index: number) => void;
  experiments: { name: string }[];
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  open,
  onClose,
  selected,
  onSelect,
  experiments,
}) => (
  <Drawer
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
      },
    }}
    variant="persistent"
    anchor="right"
    open={open}
  >
    <DrawerHeader>
      <IconButton onClick={onClose}>
        <ChevronRightIcon />
      </IconButton>
    </DrawerHeader>
    <Divider />
    <List>
      {experiments.map((exp, index) => (
        <ListItem key={exp.name} disablePadding>
          <ListItemButton
            selected={selected === index}
            onClick={() => onSelect(index)}
          >
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={exp.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Drawer>
);
