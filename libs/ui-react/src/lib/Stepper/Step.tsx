import MuiStep from '@mui/material/Step';

export type StepProps = React.ComponentProps<typeof MuiStep>;

export function Step(props: StepProps) {
  return <MuiStep {...props} />;
}

export default Step;
