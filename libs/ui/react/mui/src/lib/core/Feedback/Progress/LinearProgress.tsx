// ui/mui/core/src/LinearProgress.tsx
import {
  LinearProgress as MUILinearProgress,
  LinearProgressProps,
} from '@mui/material';
export const LinearProgress = (props: LinearProgressProps) => (
  <MUILinearProgress data-testid="linearProgress" {...props} />
);
