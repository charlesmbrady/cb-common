import * as React from 'react';
import Grid from '@mui/material/Grid';
import { HighlightCard, HighlightItemData } from './HighlightCard';

export type HighlightsGridProps = {
  items: HighlightItemData[];
};

export function HighlightsGrid({ items }: HighlightsGridProps) {
  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <HighlightCard item={item} />
        </Grid>
      ))}
    </Grid>
  );
}
