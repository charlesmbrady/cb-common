// ui/mui/core/src/AccordionActions.tsx
// Accordion Actions: an optional wrapper that groups a set of buttons.
// Visit https://mui.com/material-ui/react-accordion/ for more examples and documentation.

import {
  AccordionActions as MUIAccordionActions,
  AccordionActionsProps as MuiAccordionActionsProps,
} from '@mui/material';

export type AccordionActionsProps = MuiAccordionActionsProps;

export const AccordionActions = (props: AccordionActionsProps) => (
  <MUIAccordionActions data-testid="accordion-actions" {...props} />
);
