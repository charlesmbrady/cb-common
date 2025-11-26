// ui/mui/core/src/RadioGroup.tsx
import { RadioGroup as MUIRadioGroup, RadioGroupProps } from '@mui/material';
export const RadioGroup = (props: RadioGroupProps) => (
  <MUIRadioGroup data-testid="radioGroup" {...props} />
);
