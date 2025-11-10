// LinearProgress.stories.tsx
// https://mui.com/material-ui/react-progress/
import type { Meta } from '@storybook/react';
import { LinearProgress } from './LinearProgress';

const meta: Meta<typeof LinearProgress> = {
  title: 'Feedback/LinearProgress',
  component: LinearProgress,
};
export default meta;

export function SimpleLinearProgress() {
  return <LinearProgress color="inherit" />;
}
