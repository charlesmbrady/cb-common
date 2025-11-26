// ui/mui/core/src/Chip.tsx
import { Chip as MUIChip, ChipProps } from '@mui/material';
export const Chip = (props: ChipProps) => (
  <MUIChip data-testid="chip" {...props} />
);
