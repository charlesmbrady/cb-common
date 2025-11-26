// ui/mui/core/src/ListSubheader.tsx
import {
  ListSubheader as MUIListSubheader,
  ListSubheaderProps as MUIListSubheaderProps,
} from '@mui/material';

export type ListSubheaderProps = MUIListSubheaderProps;

export const ListSubheader = (props: ListSubheaderProps) => (
  <MUIListSubheader data-testid="listSubheader" {...props} />
);
