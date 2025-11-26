// ui/mui/core/src/DataGrid.tsx
import { DataGrid as MUIDataGrid, DataGridProps } from '@mui/x-data-grid';
export const DataGrid = (props: DataGridProps) => (
  <MUIDataGrid data-testid="dataGrid" {...props} />
);
