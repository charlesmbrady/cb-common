import type { Meta, StoryObj } from '@storybook/react';
import { FooterNewsletter } from './FooterNewsletter';

const meta: Meta<typeof FooterNewsletter> = {
  title: 'Common/Footer/FooterNewsletter',
  component: FooterNewsletter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    emailPlaceholder: {
      control: 'text',
    },
    buttonText: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomContent: Story = {
  args: {
    title: 'Stay Connected',
    description:
      'Subscribe to our newsletter for the latest updates and exclusive offers.',
    emailPlaceholder: 'Your email address',
    buttonText: 'Join Now',
  },
};
