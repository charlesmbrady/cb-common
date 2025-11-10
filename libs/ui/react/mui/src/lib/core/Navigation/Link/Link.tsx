// ui/mui/core/src/Link.tsx
import { Link as MUILink, LinkProps } from '@mui/material';
export const Link = (props: LinkProps) => (
  <MUILink data-testid="link" {...props} />
);
