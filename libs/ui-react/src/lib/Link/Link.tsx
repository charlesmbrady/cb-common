import MuiLink from '@mui/material/Link';

export type LinkProps = React.ComponentProps<typeof MuiLink>;

export function Link(props: LinkProps) {
  return <MuiLink {...props} />;
}

export default Link;
