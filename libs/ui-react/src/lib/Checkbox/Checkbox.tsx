import MuiCheckbox, {
  CheckboxProps as MuiCheckboxProps,
} from '@mui/material/Checkbox';

import FormControlLabel from '../FormControlLabel/FormControlLabel';

export type CheckboxProps = MuiCheckboxProps & {
  label?: React.ReactNode;
};

export function Checkbox({ label, ...checkboxProps }: CheckboxProps) {
  const checkbox = <MuiCheckbox data-test="checkbox" {...checkboxProps} />;

  if (label) {
    return <FormControlLabel control={checkbox} label={label} />;
  }

  return checkbox;
}

export default Checkbox;
