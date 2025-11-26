// ui/mui/core/src/Radio.tsx
import { Radio as MUIRadio, RadioProps } from '@mui/material';
export const Radio = (props: RadioProps) => (
  <MUIRadio data-testid="radio" {...props} />
);
