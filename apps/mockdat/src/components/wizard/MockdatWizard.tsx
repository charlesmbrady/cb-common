// components/wizard/MockdatWizard.tsx
import React, { useContext } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  useTheme,
} from '@mui/material';

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

  if (!context) {
    throw new Error('MockdatWizard must be used within a MockdatProvider');
  }

  const { step } = context;
  const activeStep = step - 1; // MUI Stepper is 0-based

  return (
    <Box
      sx={{
        maxWidth: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        p: 3,
      }}
      data-cy="mockdatWizardContainer"
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((s, index) => (
          <Step key={s.label} data-cy={`step-${index + 1}`}>
            <StepLabel>{s.label}</StepLabel>
            <StepContent>{activeStep === index && s.component}</StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default MockdatWizard;
