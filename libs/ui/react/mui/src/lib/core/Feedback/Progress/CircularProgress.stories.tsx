// CircularProgress.stories.tsx
// https://mui.com/material-ui/react-progress/
import type { Meta } from '@storybook/react';
import { CircularProgress } from './CircularProgress';

const meta: Meta<typeof CircularProgress> = {
  title: 'Feedback/CircularProgress',
  component: CircularProgress,
};
export default meta;

export function SimpleCircularProgress() {
  return <CircularProgress color="inherit" />;
}
