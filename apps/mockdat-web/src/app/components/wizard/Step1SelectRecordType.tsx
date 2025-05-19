// components/wizard/Step1SelectRecordType.tsx
import React, { useContext, useEffect, useState } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import InstructionsText from '../InstructionsText';

const Step1SelectRecordType: React.FC = () => {
  const ctx = useContext(MockdatContext);
  const [recordTypes, setRecordTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  if (!ctx) return null; // or throw

  const {
    recordType,
    setRecordType,
    selectedFields,
    setSelectedFields,
    step,
    setStep,
  } = ctx;

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3333/services/mockdat/data/object-types')
      .then((res) => res.json())
      .then((data) => {
        const types = data.data || [];
        setRecordTypes(['Generic', ...types]);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load record types');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: any) => {
    setRecordType(e.target.value);
    setSelectedFields([]); // reset fields if user changes record type
  };

  // Set first record type as default value
  useEffect(() => {
    if (!recordType && recordTypes.length > 0) {
      setRecordType(recordTypes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordTypes]);

  return (
    <Box
      sx={{ mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <InstructionsText>
          Choose which type of record you want to generate.
        </InstructionsText>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="record-type-label" sx={{ color: 'text.primary' }}>
            Record Type
          </InputLabel>
          <Select
            labelId="record-type-label"
            value={recordType}
            label="Record Type"
            onChange={handleChange}
            disabled={loading}
          >
            {recordTypes.map((type) => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </Box>
    </Box>
  );
};

export default Step1SelectRecordType;
