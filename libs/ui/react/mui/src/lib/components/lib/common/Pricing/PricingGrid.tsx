import * as React from 'react';
import Grid from '@mui/material/Grid';
import { PricingCard } from './PricingCard';
import type { PricingTier } from './pricingData';

export type PricingGridProps = {
  tiers?: PricingTier[];
};

export function PricingGrid({ tiers = [] }: PricingGridProps) {
  return (
    <Grid
      container
      spacing={3}
      sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
    >
      {tiers.map((tier) => (
        <PricingCard key={tier.title} tier={tier} />
      ))}
    </Grid>
  );
}
