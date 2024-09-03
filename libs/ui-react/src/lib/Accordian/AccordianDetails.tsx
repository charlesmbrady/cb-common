import MuiAccordianDetails from '@mui/material/Accordion';

export type AccordianDetailsProps = React.ComponentProps<typeof MuiAccordianDetails>;

export function AccordianDetails(props: AccordianDetailsProps) {
  return <MuiAccordianDetails {...props} />;
}

export default AccordianDetails;
