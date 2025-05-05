// pages/settings/index.tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import {
  Box,
  FormControlLabel,
  Switch,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const Settings: NextPage = () => {
  // Example states
  const [darkMode, setDarkMode] = useState(false);
  const [apiToken, setApiToken] = useState('');

  const handleSave = () => {
    // e.g., persist settings
  };

  return (
    <Box sx={{ p: 3 }} data-cy="settingsPage">
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
        Settings
      </Typography>

      {/* Example: Dark Mode Toggle */}
      <FormControlLabel
        data-cy="darkModeToggle"
        control={
          <Switch
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            color="primary"
          />
        }
        label="Dark Mode"
        sx={{ display: 'block', mb: 2, color: 'text.primary' }}
      />

      {/* Example: API Token */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="API Token"
          fullWidth
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          data-cy="apiTokenInput"
          InputLabelProps={{ sx: { color: 'text.primary' } }}
          InputProps={{ sx: { color: 'text.primary' } }}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        data-cy="saveSettingsBtn"
      >
        Save Settings
      </Button>
    </Box>
  );
};

export default Settings;
