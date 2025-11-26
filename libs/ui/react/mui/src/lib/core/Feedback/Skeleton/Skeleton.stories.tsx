// Skeleton.stories.tsx
import type { Meta } from '@storybook/react';
import { Skeleton } from './Skeleton';
import React from 'react';
import { Button } from '../../Inputs/Button/Button';
import { CircularProgress } from '../Progress/CircularProgress';
import { Stack } from '../../Layout/Stack/Stack';

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
};
export default meta;

export function Variants() {
  return (
    <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} />
    </Stack>
  );
}
