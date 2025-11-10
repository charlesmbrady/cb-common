// ui/mui/core/src/Stepper.tsx
import { Stepper as MUIStepper, StepperProps } from '@mui/material';
export const Stepper = (props: StepperProps) => (
  <MUIStepper data-testid="stepper" {...props} />
);
