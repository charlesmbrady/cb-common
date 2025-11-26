// ui/mui/core/src/CircularProgress.tsx
import {
  CircularProgress as MUICircularProgress,
  CircularProgressProps,
} from '@mui/material';
export const CircularProgress = (props: CircularProgressProps) => (
  <MUICircularProgress data-testid="circularProgress" {...props} />
);
