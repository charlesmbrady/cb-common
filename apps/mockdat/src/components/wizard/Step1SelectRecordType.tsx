// components/wizard/Step1SelectRecordType.tsx
import React, { useContext } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

const Step1SelectRecordType: React.FC = () => {
  const ctx = useContext(MockdatContext);
  if (!ctx) return null; // or throw

  const {
    recordType,
    setRecordType,
    selectedFields,
    setSelectedFields,
    step,
    setStep,
  } = ctx;

  const handleChange = (e: any) => {
    setRecordType(e.target.value);
    setSelectedFields([]); // reset fields if user changes record type
  };

  // Set 'Generic' as the default value
  React.useEffect(() => {
    if (!recordType) {
      setRecordType('Generic');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
          Choose which type of record you want to generate.
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="record-type-label" sx={{ color: 'text.primary' }}>
            Record Type
          </InputLabel>
          <Select
            labelId="record-type-label"
            value={recordType}
            label="Record Type"
            onChange={handleChange}
          >
            <MenuItem value="Generic">Generic</MenuItem>
            <MenuItem value="Accounts">Accounts</MenuItem>
            <MenuItem value="Contacts">Contacts</MenuItem>
            <MenuItem value="Leads">Leads</MenuItem>
            <MenuItem value="Opportunities">Opportunities</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Step1SelectRecordType;
