// Typography.stories.tsx
import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Typography } from './Typography';
import { Box } from '../../Layout/Box/Box';

const meta: Meta<typeof Typography> = {
  title: 'Data Display/Typography',
  component: Typography,
};
export default meta;
type Story = StoryObj<typeof Typography>;

const typographyText = 'The quick brown fox jumps over the lazy dog';

export const TypographyBase: Story = {
  args: { children: typographyText },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = await canvas.getByTestId('typography');
    expect(text).toHaveTextContent(typographyText);
  },
};

const variants = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'overline',
  'button',
] as const;

export const TypographyVariants: StoryFn = () => (
  <Box>
    {variants.map((variant) => (
      <Typography
        sx={{ display: 'flex' }}
        key={variant}
        variant={variant}
        gutterBottom
      >
        {variant}. {typographyText}
      </Typography>
    ))}
  </Box>
);
