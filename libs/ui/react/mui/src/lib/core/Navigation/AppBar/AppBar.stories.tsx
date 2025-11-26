// AppBar.stories.tsx
import type { Meta } from '@storybook/react';
import { AppBar } from './AppBar';
import { Button } from '../../Inputs/Button/Button';
import { Toolbar } from '../Toolbar/Toolbar';
import { Box } from '../../Layout/Box/Box';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { Typography } from '../../DataDisplay';

const meta: Meta<typeof AppBar> = {
  title: 'Navigation/AppBar',
  component: AppBar,
};
export default meta;

export function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
