import MuiStepper from '@mui/material/Stepper';

export type StepperProps = React.ComponentProps<typeof MuiStepper>;

export function Stepper(props: StepperProps) {
  return <MuiStepper {...props} />;
}

export default Stepper;
