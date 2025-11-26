// Paper.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { Paper } from './Paper';
import { Box } from '../../Layout/Box/Box';

const meta: Meta<typeof Paper> = {
  title: 'Surfaces/Paper',
  component: Paper,
};
export default meta;

export const PaperVariants: StoryFn = () => (
  <Box>
    <Paper> Default </Paper>
    <Paper elevation={0}>Raw no style just elevation 0</Paper>
    <Paper elevation={0} sx={{ mb: 2, p: 2 }}>
      Elevation 0
    </Paper>
    <Paper elevation={1} sx={{ mb: 2, p: 2 }}>
      Elevation 1
    </Paper>
    <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
      Elevation 2
    </Paper>
    <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
      Elevation 3
    </Paper>
    <Paper elevation={4} sx={{ mb: 2, p: 2 }}>
      Elevation 4
    </Paper>
  </Box>
);
