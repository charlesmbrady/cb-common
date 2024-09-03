import { ReactNode } from 'react';
import MuiTableContainer, {TableContainerProps as MuiTableContainerProps} from '@mui/material/TableContainer';

export type TableContainerProps = MuiTableContainerProps & {
  component?: ReactNode;
};

export function TableContainer(props: TableContainerProps) {
  return <MuiTableContainer {...props} />;
}

export default TableContainer;
