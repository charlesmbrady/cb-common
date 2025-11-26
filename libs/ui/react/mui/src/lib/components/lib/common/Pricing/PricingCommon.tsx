import * as React from 'react';
import { Container } from '../../../../core';
import { PricingHeader } from './PricingHeader';
import { PricingGrid } from './PricingGrid';
import { pricingTiers } from './pricingData';
import type { PricingTier } from './pricingData';

export type PricingCommonProps = {
  id?: string;
  title?: string;
  description?: string;
  tiers?: PricingTier[];
};

export function PricingCommon({
  id = 'pricing',
  title,
  description,
  tiers = pricingTiers,
}: PricingCommonProps) {
  return (
    <Container
      id={id}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <PricingHeader title={title} description={description} />
      <PricingGrid tiers={tiers} />
    </Container>
  );
}
