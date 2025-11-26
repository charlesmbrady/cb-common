import * as React from 'react';
import { Stack } from '../../../../core';

export type HeroItemsProps = {
  children?: React.ReactNode;
};

export function HeroItems({ children }: HeroItemsProps) {
  return (
    <Stack
      spacing={2}
      useFlexGap
      sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
    >
      {children}
    </Stack>
  );
}
