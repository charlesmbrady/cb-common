// Step4PreviewData.tsx
import React, { useContext, useEffect } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import InstructionsText from '../InstructionsText';

const Step4PreviewData: React.FC = () => {
  const ctx = useContext(MockdatContext);
  if (!ctx) return null;

  const {
    step,
    setStep,
    recordType,
    selectedFields,
    recordCount,
    previewData,
    setPreviewData,
  } = ctx;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  useEffect(() => {
    if (step === 4 && selectedFields.length > 0 && recordType) {
      const generated: Array<Record<string, any>> = [];
      for (let i = 0; i < recordCount; i++) {
        const row: Record<string, any> = {};
        selectedFields.forEach((field) => {
          row[field] = `Fake_${field}_${i}`;
        });
        generated.push(row);
      }
      setPreviewData(generated);
    }
  }, [step, recordType, selectedFields, recordCount, setPreviewData]);

  const columns: GridColDef[] = selectedFields.map((field) => ({
    field,
    headerName: field,
    minWidth: Math.max(120, field.length * 16),
  }));
  const rows: GridRowsProp = previewData.map((dataRow, idx) => ({
    id: idx,
    ...dataRow,
  }));

  return (
    <Box sx={{ mb: 2 }} data-cy="step4Container">
      <InstructionsText sx={{ mb: 1 }}>
        Preview your mock data below.
      </InstructionsText>

      {previewData.length === 0 ? (
        <Typography color="text.secondary" data-cy="noDataMessage">
          No data generated yet.
        </Typography>
      ) : (
        // We wrap the DataGrid in a wider container
        <Box
          sx={{
            width: '100%',
            height: 500,
            mb: 2,
          }}
          data-cy="dataGridContainer"
        >
          <DataGrid
            rows={rows}
            columns={columns}
            sx={{
              '& .MuiDataGrid-cell': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaders': {
                color: 'text.primary',
              },
            }}
            autoHeight={false}
            pageSize={25}
            rowsPerPageOptions={[25, 50, 100]}
          />
        </Box>
      )}
    </Box>
  );
};

export default Step4PreviewData;
