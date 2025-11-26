import * as React from 'react';
import { Typography, Box } from '../../../../core';

export type PricingHeaderProps = {
  title?: string;
  description?: string;
};

export function PricingHeader({
  title = 'Pricing',
  description = "Quickly build an effective pricing table for your potential customers with this layout. It's built with default Material UI components with little customization.",
}: PricingHeaderProps) {
  return (
    <Box
      sx={{
        width: { sm: '100%', md: '60%' },
        textAlign: { sm: 'left', md: 'center' },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        gutterBottom
        sx={{ color: 'text.primary' }}
      >
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Box>
  );
}
