import * as React from 'react';
import { Typography } from '../../../../core';

export type HeroSecondaryTextProps = {
  text: string;
};

export function HeroSecondaryText({ text }: HeroSecondaryTextProps) {
  return (
    <Typography
      sx={{
        textAlign: 'center',
        color: 'text.secondary',
        width: { sm: '100%', md: '80%' },
      }}
    >
      {text}
    </Typography>
  );
}
