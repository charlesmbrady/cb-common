// ui/mui/core/src/ListItemButton.tsx
import {
  ListItemButton as MUIListItemButton,
  ListItemButtonProps as MUIListItemButtonProps,
} from '@mui/material';

export type ListItemButtonProps = MUIListItemButtonProps;

export const ListItemButton = (props: ListItemButtonProps) => (
  <MUIListItemButton data-testid="listItemButton" {...props} />
);
