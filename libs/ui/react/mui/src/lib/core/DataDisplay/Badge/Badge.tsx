// ui/mui/core/src/Badge.tsx
import { Badge as MUIBadge, BadgeProps } from '@mui/material';
export const Badge = (props: BadgeProps) => (
  <MUIBadge data-testid="badge" {...props} />
);
