// ui/mui/core/src/AccordionSummary.tsx
// Accordion Summary: the wrapper for the Accordion header, which expands or collapses the content when clicked.
// Visit https://mui.com/material-ui/react-accordion/ for more examples and documentation.

import {
  AccordionSummary as MUIAccordionSummary,
  AccordionSummaryProps as MuiAccordionSummaryProps,
} from '@mui/material';

export type AccordionSummaryProps = MuiAccordionSummaryProps;

export const AccordionSummary = (props: AccordionSummaryProps) => (
  <MUIAccordionSummary data-testid="accordion-summary" {...props} />
);
