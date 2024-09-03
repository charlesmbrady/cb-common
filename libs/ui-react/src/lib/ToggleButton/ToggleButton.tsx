import MuiToggleButton from '@mui/material/ToggleButton';

export type ToggleButtonProps = React.ComponentProps<typeof MuiToggleButton>;

export function ToggleButton(props: ToggleButtonProps) {
  return <MuiToggleButton {...props} />;
}

export default ToggleButton;
