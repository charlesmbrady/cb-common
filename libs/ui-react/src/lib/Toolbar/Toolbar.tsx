import MuiToolbar from '@mui/material/Toolbar';

export type ToolbarProps = React.ComponentProps<typeof MuiToolbar>;

export function Toolbar(props: ToolbarProps) {
  return <MuiToolbar {...props} />;
}

export default Toolbar;
