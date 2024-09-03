import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export type ToggleButtonGroupProps = React.ComponentProps<typeof MuiToggleButtonGroup>;

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  return <MuiToggleButtonGroup {...props} />;
}

export default ToggleButtonGroup;
