import MuiAccordian from '@mui/material/Accordion';

export type AccordianProps = React.ComponentProps<typeof MuiAccordian>;

export function Accordian(props: AccordianProps) {
  return <MuiAccordian {...props} />;
}

export default Accordian;
