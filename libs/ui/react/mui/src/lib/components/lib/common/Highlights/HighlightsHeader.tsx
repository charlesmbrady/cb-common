import * as React from 'react';
import { Box, Typography } from '../../../../core';

export type HighlightsHeaderProps = {
  title?: string;
  description?: string;
  textAlign?: 'left' | 'center' | 'right';
};

export function HighlightsHeader({
  title = 'Highlights',
  description = 'Explore why our product stands out: adaptability, durability, user-friendly design, and innovation. Enjoy reliable customer support and precision in every detail.',
  textAlign = 'center',
}: HighlightsHeaderProps) {
  return (
    <Box
      sx={{
        width: { sm: '100%', md: '60%' },
        textAlign: { sm: 'left', md: textAlign },
      }}
    >
      <Typography component="h2" variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'grey.400' }}>
        {description}
      </Typography>
    </Box>
  );
}
