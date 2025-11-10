// Popover.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { Popover } from './Popover';
import { Typography } from '../../DataDisplay/Typography/Typography';
import { Button } from '../../Inputs/Button/Button';
import React from 'react';

const meta: Meta<typeof Popover> = {
  title: 'Utils/Popover',
  component: Popover,
};
export default meta;

export const BasicPopover: StoryFn = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </div>
  );
};
