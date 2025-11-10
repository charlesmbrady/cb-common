// Step4PreviewData.tsx
import React, { useContext, useEffect } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import InstructionsText from '../InstructionsText';
import { useAppConfig } from 'ui-react-auth';
import { useUser } from 'ui-react-auth';

const Step4PreviewData: React.FC = () => {
  const ctx = useContext(MockdatContext);
  const { data: appConfig } = useAppConfig();
  const [userState, { getAuthToken }] = useUser();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  if (!ctx || !appConfig) return null;

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

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    const idToken = await getAuthToken();
    fetch(`${appConfig.apiUrl}/services/mockdat/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: idToken } : {}),
      },
      body: JSON.stringify({
        recordType,
        selectedFields,
        quantity: recordCount,
        userId: '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPreviewData(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to preview data');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (step === 4 && selectedFields.length > 0 && recordType) {
      const scenario = {
        id: '',
        name: 'Preview',
        userId: '',
        status: 'preview',
        type: recordType,
        data: {
          mainObjectType: recordType,
          totalRecords: recordCount,
          fieldsData: selectedFields.map((field) => ({ type: field })),
        },
      };
      (async () => {
        const idToken = await getAuthToken();
        fetch(`${appConfig.apiUrl}/services/mockdat/data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: idToken } : {}),
          },
          body: JSON.stringify(scenario),
        })
          .then((res) => res.json())
          .then((data) => {
            setPreviewData(data.data || []);
          })
          .catch(() => setPreviewData([]));
      })();
    }
  }, [
    step,
    recordType,
    selectedFields,
    recordCount,
    setPreviewData,
    getAuthToken,
    appConfig.apiUrl,
  ]);

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
            paginationModel={{ page: 0, pageSize: 25 }}
            // pageSize={25}
            // rowsPerPageOptions={[25, 50, 100]}
          />
        </Box>
      )}
    </Box>
  );
};

export default Step4PreviewData;
