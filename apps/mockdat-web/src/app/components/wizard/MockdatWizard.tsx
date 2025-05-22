// components/wizard/MockdatWizard.tsx
import React, { useContext, useState, useEffect } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from 'react-router-dom';

import Step1SelectRecordType from './Step1SelectRecordType';
import Step2SelectFieldsTransferList from './Step2SelectFields';
import Step3SelectQuantity from './Step3SelectQuantity';
import Step4PreviewData from './Step4PreviewData';
import Step5SelectOutput from './Step5SelectOutput';

const steps = [
  { label: 'Select Record Type', component: <Step1SelectRecordType /> },
  { label: 'Select Fields', component: <Step2SelectFieldsTransferList /> },
  { label: 'Select Quantity', component: <Step3SelectQuantity /> },
  { label: 'Preview Data', component: <Step4PreviewData /> },
  { label: 'Select Output', component: <Step5SelectOutput /> },
];

const MockdatWizard: React.FC = () => {
  const context = useContext(MockdatContext);
  const theme = useTheme();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadedScenarioName, setLoadedScenarioName] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (location.state?.loadedScenarioName) {
      setLoadedScenarioName(location.state.loadedScenarioName);
    }
  }, [location.state?.loadedScenarioName]);

  if (!context) {
    throw new Error('MockdatWizard must be used within a MockdatProvider');
  }

  const {
    step,
    setStep,
    recordType,
    selectedFields,
    recordCount,
    previewData,
    outputFormat,
  } = context;
  const activeStep = step - 1; // MUI Stepper is 0-based

  // Validation for enabling/disabling Next button
  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !recordType;
      case 1:
        return selectedFields.length === 0;
      case 2:
        return recordCount < 1;
      case 3:
        return previewData.length === 0;
      default:
        return false;
    }
  };

  // Only show the current step's component
  const CurrentStepComponent = steps[activeStep]?.component;

  const handleNext = async () => {
    setLoading(true);
    // Simulate async work (replace with real async if needed)
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStep(step + 1);
    setLoading(false);
  };

  const handleBack = () => setStep(step - 1);

  // Add a reset handler for the wizard
  const handleReset = () => {
    context.setRecordType('');
    context.setSelectedFields([]);
    context.setRecordCount(10);
    context.setPreviewData([]);
    context.setOutputFormat('csv');
    context.setStep(1);
    setLoadedScenarioName(undefined);
  };

  return (
    <Box
      sx={{
        // maxWidth: 700,
        width: '100%',
        mx: 'auto',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
      }}
      data-cy="mockdatWizardContainer"
    >
      {/* Loaded Scenario Name */}
      {loadedScenarioName && (
        <Box sx={{ textAlign: 'center', mt: 1, mb: 0 }}>
          <span
            style={{
              fontSize: '0.95rem',
              color: theme.palette.secondary.main,
              opacity: 0.8,
              fontWeight: 500,
            }}
          >
            Loaded Scenario: {loadedScenarioName}
          </span>
        </Box>
      )}
      {/* Horizontal Stepper at the top */}
      <Box sx={{ pt: 0, pb: 1 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((s, index) => (
            <Step key={s.label} data-cy={`step-${index + 1}`}>
              <StepLabel>{s.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step content as a page */}
      <Box
        // elevation={1}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2, sm: 4 },
          mt: 2,
          mb: 10, // leave space for bottom nav
          minHeight: 400,
          background: theme.palette.background.default,
        }}
      >
        <Box sx={{ width: '100%', mx: 'auto' }}>{CurrentStepComponent}</Box>
      </Box>

      {/* Bottom navigation bar */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100vw',
          background: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          py: 2,
          px: 2,
          display: 'flex',
          justifyContent: 'end',
          zIndex: 1200,
        }}
      >
        <Box
          sx={{
            // maxWidth: 700,
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            sx={{ minWidth: 120, mr: 1 }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReset}
              sx={{ minWidth: 120 }}
            >
              Start Over
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                activeStep === steps.length - 1 || isNextDisabled() || loading
              }
              sx={{ minWidth: 120, position: 'relative' }}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginTop: '-10px',
                    marginLeft: '-10px',
                  }}
                />
              ) : activeStep === steps.length - 2 ? (
                'Finish'
              ) : (
                'Next'
              )}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MockdatWizard;
