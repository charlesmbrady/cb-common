// components/wizard/Step5SelectOutput.tsx
import React, { useContext, useState } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import InstructionsText from '../InstructionsText';
import { toCSV } from '../../utils/utils';
import { useAppConfig, useUser } from '@cb-common/ui-react-auth';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

const Step5SelectOutput: React.FC = () => {
  const ctx = useContext(MockdatContext);
  const { data: appConfig } = useAppConfig();
  const [userState, { getAuthToken }] = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  if (!ctx || !appConfig) return null;

  const {
    step,
    setStep,
    previewData,
    outputFormat,
    setOutputFormat,
    setRecordType,
    setSelectedFields,
    setRecordCount,
    setPreviewData,
    recordType,
    selectedFields,
    recordCount,
  } = ctx;

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleDownload = () => {
    if (previewData.length === 0) return;

    let fileContent: string;
    let mimeType: string;
    let fileName: string;

    if (outputFormat === 'csv') {
      fileContent = toCSV(previewData);
      mimeType = 'text/csv';
      fileName = 'mockdat_data.csv';
    } else {
      fileContent = JSON.stringify(previewData, null, 2);
      mimeType = 'application/json';
      fileName = 'mockdat_data.json';
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    // Clear entire wizard state
    setRecordType('');
    setSelectedFields([]);
    setRecordCount(10);
    setPreviewData([]);
    setOutputFormat('csv');
    setStep(1);
  };

  const handleSaveScenario = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const idToken = await getAuthToken();
      // Generate a random id for the scenario
      const scenarioId = `scn_${Math.random().toString(36).substr(2, 9)}`;
      const scenario = {
        id: scenarioId,
        name: scenarioName,
        userId: '', // backend will fill from token
        status: 'saved',
        type: recordType,
        data: {
          mainObjectType: recordType,
          totalRecords: recordCount,
          fieldsData: selectedFields.map((field) => ({ type: field })),
        },
      };
      const res = await fetch(`${appConfig.apiUrl}/services/mockdat/scenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: idToken } : {}),
        },
        body: JSON.stringify(scenario),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save scenario');
      }
      setSaveSuccess(true);
      setScenarioName('');
      setModalOpen(false);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save scenario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        mb: 2,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <InstructionsText sx={{ mb: 2 }}>
        Choose your output format and download your mock data.
      </InstructionsText>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Output Format</FormLabel>
        <RadioGroup
          row
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
        >
          <FormControlLabel value="csv" control={<Radio />} label="CSV" />
          <FormControlLabel value="json" control={<Radio />} label="JSON" />
        </RadioGroup>
      </FormControl>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          mt: 2,
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          disabled={previewData.length === 0}
        >
          Download
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setModalOpen(true)}
          disabled={previewData.length === 0}
        >
          Save Scenario
        </Button>
      </Box>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Save Scenario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Scenario Name"
            fullWidth
            required
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            disabled={saving}
          />
          {saveError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {saveError}
            </Alert>
          )}
          {saveSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Scenario saved!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveScenario}
            disabled={!scenarioName || saving}
            variant="contained"
            color="primary"
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Step5SelectOutput;
