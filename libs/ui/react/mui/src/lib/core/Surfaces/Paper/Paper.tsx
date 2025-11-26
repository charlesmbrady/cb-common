// ui/mui/core/src/Paper.tsx
import { Paper as MUIPaper, PaperProps } from '@mui/material';
export const Paper = (props: PaperProps) => (
  <MUIPaper data-testid="paper" {...props} />
);
