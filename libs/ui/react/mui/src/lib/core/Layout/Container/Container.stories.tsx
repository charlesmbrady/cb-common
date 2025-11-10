// Container.stories.tsx
import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
};
export default meta;
type Story = StoryObj<typeof Container>;

export const ContainerBase: Story = {
  args: {
    children: 'Inside Container',
    style: { border: '1px solid black' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId('container');
    await expect(container).toBeInTheDocument();
  },
};

const variants = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const baseStyle = { border: '1px dashed white' };

export const ContainerVariants: StoryFn = () => (
  <>
    {variants.map((variant) => (
      <Container key={variant} maxWidth={variant} style={baseStyle}>
        {variant.charAt(0).toUpperCase() + variant.slice(1)} Container
      </Container>
    ))}

    <Container disableGutters style={baseStyle}>
      No Gutters default maxwidth Container
    </Container>

    <Container style={baseStyle} maxWidth={false}>
      No max width Container
    </Container>
  </>
);
