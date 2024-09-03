import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';

import FormControlLabel from '../FormControlLabel/FormControlLabel';

export type SwitchProps = MuiSwitchProps & {
  label?: React.ReactNode;
};

export function Switch({ label, ...switchProps }: SwitchProps) {
  const mySwitch = <MuiSwitch data-test="switch" {...switchProps} />;

  if (label) {
    return <FormControlLabel control={mySwitch} label={label} />;
  }

  return mySwitch;
}

export default Switch;
