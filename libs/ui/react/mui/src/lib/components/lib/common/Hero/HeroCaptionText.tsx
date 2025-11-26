import * as React from 'react';
import { Typography } from '../../../../core';

export type HeroCaptionTextProps = {
  text: string;
};

export function HeroCaptionText({ text }: HeroCaptionTextProps) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ textAlign: 'center' }}
    >
      {text}
    </Typography>
  );
}
