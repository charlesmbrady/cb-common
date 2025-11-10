import * as React from 'react';
import { Typography, Box } from '../../../../core';

export type FAQHeaderProps = {
  title?: string;
  textAlign?: 'left' | 'center' | 'right';
};

export function FAQHeader({
  title = 'Frequently asked questions',
  textAlign = 'center',
}: FAQHeaderProps) {
  return (
    <Typography
      component="h2"
      variant="h4"
      sx={{
        color: 'text.primary',
        width: { sm: '100%', md: '60%' },
        textAlign: { sm: 'left', md: textAlign },
      }}
    >
      {title}
    </Typography>
  );
}
