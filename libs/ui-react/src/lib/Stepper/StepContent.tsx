import MuiStepContent from '@mui/material/StepContent';

export type StepContentProps = React.ComponentProps<typeof MuiStepContent>;

export function StepContent(props: StepContentProps) {
  return <MuiStepContent data-test="stepper-step-content" {...props} />;
}

export default StepContent;
