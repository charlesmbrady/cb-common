// ui/mui/core/src/Accordion.tsx
// Accordion: the wrapper for grouping related components.
// Visit https://mui.com/material-ui/react-accordion/ for more examples and documentation.

import {
  Accordion as MUIAccordion,
  AccordionProps as MuiAccordionProps,
} from '@mui/material';

export type AccordionProps = MuiAccordionProps;

export const Accordion = (props: AccordionProps) => (
  <MUIAccordion data-testid="accordion" {...props}>
    {props.children}
  </MUIAccordion>
);
