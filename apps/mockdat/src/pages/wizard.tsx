import React from 'react';
import MockdatWizard from '../components/wizard/MockdatWizard';
import { Box, useTheme } from '@mui/material';

export default function WizardPage() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <MockdatWizard />
    </Box>
  );
}
