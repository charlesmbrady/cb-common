// ui/mui/core/src/Step.tsx
import { Step as MUIStep, StepProps } from '@mui/material';
export const Step = (props: StepProps) => (
  <MUIStep data-testid="step" {...props} />
);
