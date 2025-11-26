// ui/mui/core/src/ListItem.tsx
import {
  ListItem as MUIListItem,
  ListItemProps as MUIListItemProps,
} from '@mui/material';

export type ListItemProps = MUIListItemProps;

export const ListItem = (props: ListItemProps) => (
  <MUIListItem data-testid="listItem" {...props} />
);
