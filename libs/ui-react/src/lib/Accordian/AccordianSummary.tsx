import MuiAccordianSummary from '@mui/material/Accordion';

export type AccordianSummaryProps = React.ComponentProps<typeof MuiAccordianSummary>;

export function AccordianSummary(props: AccordianSummaryProps) {
  return <MuiAccordianSummary {...props} />;
}

export default AccordianSummary;
