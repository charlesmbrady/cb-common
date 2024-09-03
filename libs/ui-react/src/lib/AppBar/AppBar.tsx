import MuiAppBar from '@mui/material/AppBar';

export type AppBarProps = React.ComponentProps<typeof MuiAppBar>;

export function AppBar(props: AppBarProps) {
  return <MuiAppBar {...props} />;
}

export default AppBar;
