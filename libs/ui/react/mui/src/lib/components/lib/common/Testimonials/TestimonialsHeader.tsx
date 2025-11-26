import * as React from 'react';
import { Box, Typography } from '../../../../core';

export type TestimonialsHeaderProps = {
  title?: string;
  description?: string;
};

export function TestimonialsHeader({
  title = 'Testimonials',
  description = 'See what our customers love about our products. Discover how we excel in efficiency, durability, and satisfaction. Join us for quality, innovation, and reliable support.',
}: TestimonialsHeaderProps) {
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
