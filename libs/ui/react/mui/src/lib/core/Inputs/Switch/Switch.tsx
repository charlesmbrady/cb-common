// ui/mui/core/src/Switch.tsx
import {
  Switch as MUISwitch,
  SwitchProps as MUISwitchProps,
} from '@mui/material';

export type SwitchProps = MUISwitchProps;

export const Switch = (props: SwitchProps) => (
  <MUISwitch data-testid="switch" {...props} />
);
