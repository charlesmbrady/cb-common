// Popper.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { Popper } from './Popper';
import React from 'react';
import { Box } from '../../Layout/Box/Box';

const meta: Meta<typeof Popper> = {
  title: 'Utils/Popper',
  component: Popper,
};
export default meta;

export const BasicPopper: StoryFn = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={handleClick}>
        Toggle Popper
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          The content of the Popper.
        </Box>
      </Popper>
    </div>
  );
};
