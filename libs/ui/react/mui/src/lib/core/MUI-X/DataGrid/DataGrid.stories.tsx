// DataGrid.stories.tsx
import React from 'react';
import type { Meta } from '@storybook/react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from './DataGrid';
import { Stack } from '../../Layout/Stack/Stack';
import { Button } from '../../Inputs/Button/Button';
import { Box } from '../../Layout/Box/Box';
import { NoRowsOverlay } from './NoRowsOverlay';

const meta: Meta<typeof DataGrid> = {
  title: 'MUI X/DataGrid',
  component: DataGrid,
};
export default meta;

export function FlexGrid() {
  const [nbRows, setNbRows] = React.useState(3);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={removeRow}>
          Remove a row
        </Button>
        <Button size="small" onClick={addRow}>
          Add a row
        </Button>
      </Stack>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          {...data}
          rows={data.rows.slice(0, nbRows)}
          loading={loading}
        />
      </div>
    </Box>
  );
}

export function GridOverlayHeight() {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        columns={[
          { field: 'ID' },
          { field: 'First name' },
          { field: 'Last name' },
        ]}
        rows={[]}
        slots={{ noRowsOverlay: NoRowsOverlay }}
        sx={{ '--DataGrid-overlayHeight': '300px' }}
      />
    </Box>
  );
}
