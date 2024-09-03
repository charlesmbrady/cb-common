import { Story, Meta } from '@storybook/react';
import { useState } from 'react';

import { Stepper, StepperProps } from './Stepper';
import Box from '../Box/Box';
import Step from './Step';
import StepLabel from './StepLabel';
import StepContent from './StepContent';
import Button from '../Button/Button';
import Paper from '../Paper/Paper';
import Typography from '../Typography/Typography';

export default {
  component: Stepper,
  title: 'Stepper',
} as Meta;

const steps = [
  {
    label: 'StepOne',
    content: `Step one content`,
  },
  {
    label: 'step tow',
    content:
      'step two content',
  },
  {
    label: 'step three',
    content: `step 3 content`,
  },
];

const Template: Story<StepperProps> = (args) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical" {...args}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.content}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
            All steps completed - you&apos;re finished. Here is your MERN app
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
