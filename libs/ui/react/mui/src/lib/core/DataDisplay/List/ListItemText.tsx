// ui/mui/core/src/ListItemText.tsx
import {
  ListItemText as MUIListItemText,
  ListItemTextProps as MUIListItemTextProps,
} from '@mui/material';

export type ListItemTextProps = MUIListItemTextProps;

export const ListItemText = (props: ListItemTextProps) => (
  <MUIListItemText data-testid="listItemText" {...props} />
);
