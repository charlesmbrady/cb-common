import MuiStepButton from '@mui/material/StepButton';

export type StepButtonProps = React.ComponentProps<typeof MuiStepButton>;

export function StepButton(props: StepButtonProps) {
  return <MuiStepButton data-test="stepper-step-button" {...props} />;
}

export default StepButton;
