import * as React from 'react';
import { Box } from '../../../../core';
import { FAQItem, FAQItemData } from './FAQItem';

export type FAQListProps = {
  items: FAQItemData[];
  allowMultiple?: boolean;
};

export function FAQList({ items, allowMultiple = false }: FAQListProps) {
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      if (allowMultiple) {
        setExpanded(
          isExpanded
            ? [...expanded, panel]
            : expanded.filter((item) => item !== panel)
        );
      } else {
        setExpanded(isExpanded ? [panel] : []);
      }
    };

  return (
    <Box sx={{ width: '100%' }}>
      {items.map((item) => (
        <FAQItem
          key={item.id}
          item={item}
          expanded={expanded.includes(item.id)}
          onChange={handleChange(item.id)}
        />
      ))}
    </Box>
  );
}
