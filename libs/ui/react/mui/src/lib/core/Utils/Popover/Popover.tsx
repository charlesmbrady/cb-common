// ui/mui/core/src/Popover.tsx
import { Popover as MUIPopover, PopoverProps } from '@mui/material';
export const Popover = (props: PopoverProps) => (
  <MUIPopover data-testid="popover" {...props} />
);
