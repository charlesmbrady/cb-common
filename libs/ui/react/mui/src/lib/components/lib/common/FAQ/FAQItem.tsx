import * as React from 'react';

import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '../../../../core';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type FAQItemData = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

export type FAQItemProps = {
  item: FAQItemData;
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

export function FAQItem({ item, expanded, onChange }: FAQItemProps) {
  return (
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${item.id}-content`}
        id={`${item.id}-header`}
      >
        <Typography component="span" variant="subtitle2">
          {item.question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          variant="body2"
          gutterBottom
          sx={{ maxWidth: { sm: '100%', md: '70%' } }}
        >
          {item.answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
