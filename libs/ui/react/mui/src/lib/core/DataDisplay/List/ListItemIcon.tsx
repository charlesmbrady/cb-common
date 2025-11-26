// ui/mui/core/src/ListItemIcon.tsx
import {
  ListItemIcon as MUIListItemIcon,
  ListItemIconProps as MUIListItemIconProps,
} from '@mui/material';

export type ListItemIconProps = MUIListItemIconProps;

export const ListItemIcon = (props: ListItemIconProps) => (
  <MUIListItemIcon data-testid="listItemIcon" {...props} />
);
