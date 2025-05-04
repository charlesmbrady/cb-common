// components/wizard/Step3SelectQuantity.tsx
import React, { useContext } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import { Box, Button, TextField, Typography } from '@mui/material';

const Step3SelectQuantity: React.FC = () => {
  const ctx = useContext(MockdatContext);
  if (!ctx) return null;

  const { recordCount, setRecordCount, step, setStep } = ctx;

  const handleNext = () => {
    setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
        How many records do you want to generate?
      </Typography>
      <TextField
        type="number"
        label="Record Count"
        value={recordCount}
        onChange={(e) => setRecordCount(Number(e.target.value))}
        inputProps={{ min: 1 }}
        sx={{ mb: 2 }}
        InputLabelProps={{ sx: { color: 'text.primary' } }}
        InputProps={{ sx: { color: 'text.primary' } }}
      />

      <Box>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={recordCount < 1}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step3SelectQuantity;
