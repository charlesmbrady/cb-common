// components/wizard/Step5SelectOutput.tsx
import React, { useContext } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

/** Simple CSV converter function */
function toCSV(data: Array<Record<string, any>>): string {
  if (data.length === 0) return '';
  const header = Object.keys(data[0]).join(',');
  const rows = data.map((row) =>
    Object.keys(row)
      .map((key) => row[key])
      .join(',')
  );
  return [header, ...rows].join('\n');
}

const Step5SelectOutput: React.FC = () => {
  const ctx = useContext(MockdatContext);
  if (!ctx) return null;

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

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
        Choose your output format and download your data.
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend" sx={{ color: 'text.primary' }}>
          Output Format
        </FormLabel>
        <RadioGroup
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
        >
          <FormControlLabel
            value="csv"
            control={<Radio />}
            label="CSV"
            sx={{ color: 'text.primary' }}
          />
          <FormControlLabel
            value="json"
            control={<Radio />}
            label="JSON"
            sx={{ color: 'text.primary' }}
          />
        </RadioGroup>
      </FormControl>

      <Box>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={previewData.length === 0}
        >
          Download
        </Button>
        <Button variant="outlined" onClick={handleReset} sx={{ ml: 1 }}>
          Start Over
        </Button>
      </Box>
    </Box>
  );
};

export default Step5SelectOutput;
