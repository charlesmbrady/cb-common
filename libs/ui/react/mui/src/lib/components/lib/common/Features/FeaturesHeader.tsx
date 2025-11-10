import * as React from 'react';
import { Box, Typography } from '../../../../core';

export type FeaturesHeaderProps = {
  title?: string;
  description?: string;
};

export function FeaturesHeader({
  title = 'Product features',
  description = 'Provide a brief overview of the key features of the product. For example, you could list the number of features, their types or benefits, and add-ons.',
}: FeaturesHeaderProps) {
  return (
    <Box sx={{ width: { sm: '100%', md: '60%' } }}>
      <Typography
        component="h2"
        variant="h4"
        gutterBottom
        sx={{ color: 'text.primary' }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
      >
        {description}
      </Typography>
    </Box>
  );
}
