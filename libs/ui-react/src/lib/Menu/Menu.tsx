import MuiMenu from '@mui/material/Menu';

export type MenuProps = React.ComponentProps<typeof MuiMenu>;

export function Menu(props: MenuProps) {
  return <MuiMenu {...props} />;
}

export default Menu;
