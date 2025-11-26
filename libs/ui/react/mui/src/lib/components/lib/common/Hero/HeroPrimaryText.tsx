import * as React from 'react';
import { Typography } from '../../../../core';

export type HeroPrimaryTextProps = {
  mainText: string;
  highlightedText?: string;
};

export function HeroPrimaryText({
  mainText,
  highlightedText,
}: HeroPrimaryTextProps) {
  return (
    <>
      <Typography
        variant="h1"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          fontSize: 'clamp(3rem, 10vw, 3.5rem)',
        }}
      >
        {mainText}
        <Typography
          component="span"
          variant="h1"
          sx={(theme) => ({
            fontSize: 'inherit',
            color: 'primary.main',
            // Add horizontal space only on small and up, and a small top gap on xs
            ml: { xs: 0, sm: 1 },
            mt: { xs: 0.5, sm: 0 },
            ...theme.applyStyles('dark', {
              color: 'primary.light',
            }),
          })}
        >
          {highlightedText}
        </Typography>
      </Typography>
    </>
  );
}
