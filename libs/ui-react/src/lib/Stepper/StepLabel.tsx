import MuiStepLabel from '@mui/material/StepLabel';

export type StepLabelProps = React.ComponentProps<typeof MuiStepLabel>;

export function StepLabel(props: StepLabelProps) {
  return <MuiStepLabel data-test="stepper-step-label" {...props} />;
}

export default StepLabel;
