// ui/mui/core/src/TableContainer.tsx
import {
  TableContainer as MUITableContainer,
  TableContainerProps as MUITableContainerProps,
} from '@mui/material';

export type TableContainerProps = MUITableContainerProps;

export const TableContainer = (props: TableContainerProps) => (
  <MUITableContainer data-testid="tableContainer" {...props} />
);
