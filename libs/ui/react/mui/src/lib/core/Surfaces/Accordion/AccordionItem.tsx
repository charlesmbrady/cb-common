import { ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion } from './Accordion';
import { AccordionDetails } from './AccordionDetails';
import { AccordionSummary } from './AccordionSummary';

export type AccordionItemProps = {
  index?: number;
  title: ReactNode;
  description: ReactNode;
};

export const AccordionItem = ({
  index = 0,
  title,
  description,
}: AccordionItemProps) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${index}-content`}
        id={`panel${index}-header`}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails>{description}</AccordionDetails>
    </Accordion>
  );
};
