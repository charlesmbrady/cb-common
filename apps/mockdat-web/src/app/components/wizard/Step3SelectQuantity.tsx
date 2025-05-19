// components/wizard/Step3SelectQuantity.tsx
import React, { useContext } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import { Box, Button, TextField } from '@mui/material';
import InstructionsText from '../InstructionsText';

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
    <Box
      sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <InstructionsText sx={{ mb: 2 }}>
          How many records do you want to generate?
        </InstructionsText>
        <TextField
          type="number"
          label="Record Count"
          value={recordCount}
          onChange={(e) => {
            let val = Number(e.target.value);
            if (val > 2000000) val = 2000000;
            if (val < 1) val = 1;
            setRecordCount(val);
          }}
          inputProps={{ min: 1, max: 2000000 }}
          sx={{ mb: 2, width: '300px' }}
          InputLabelProps={{ sx: { color: 'text.primary' } }}
          InputProps={{ sx: { color: 'text.primary' } }}
        />
      </Box>
    </Box>
  );
};

export default Step3SelectQuantity;
