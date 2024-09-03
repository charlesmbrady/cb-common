// New react component
import { AppBar, Box, Button, Step, StepContent, StepLabel, Stepper, Toolbar, Typography } from '@cb-common/ui-react';
import { useState } from 'react';

export default function Wizard(): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MockDat
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Stepper activeStep={activeStep} orientation="horizontal">
        <Step>
          <StepLabel>Step One</StepLabel>
          <StepContent>
            <Box sx={{ pt: 2 }}>yo yo</Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Step 2</StepLabel>
          <StepContent>
            <Box sx={{ pt: 2 }}>step 2 content</Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>step 3</StepLabel>
          <StepContent>
            <Box sx={{ pt: 2 }}>step 3 content</Box>
          </StepContent>
        </Step>
      </Stepper>
    </>
  );
}
