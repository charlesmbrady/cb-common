// ui/mui/core/src/List.tsx
import { List as MUIList, ListProps as MUIListProps } from '@mui/material';

export type ListProps = MUIListProps;

export const List = (props: ListProps) => (
  <MUIList data-testid="list" {...props} />
);
