import MuiButtonGroup from '@mui/material/ButtonGroup';

export type ButtonGroupProps = React.ComponentProps<typeof MuiButtonGroup>;

export function ButtonGroup(props: ButtonGroupProps) {
  return <MuiButtonGroup {...props} />;
}

export default ButtonGroup;
