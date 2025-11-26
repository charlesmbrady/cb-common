// ui/mui/core/src/AccordionDetails.tsx
// Accordion Details: the wrapper for the Accordion content.
// Visit https://mui.com/material-ui/react-accordion/ for more examples and documentation.

import {
  AccordionDetails as MUIAccordionDetails,
  AccordionDetailsProps as MuiAccordionDetailsProps,
} from '@mui/material';

export type AccordionDetailsProps = MuiAccordionDetailsProps;

export const AccordionDetails = (props: AccordionDetailsProps) => (
  <MUIAccordionDetails data-testid="accordion-details" {...props} />
);
