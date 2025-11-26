import type { Meta, StoryObj } from '@storybook/react';
import { FooterCopyright } from './FooterCopyright';

const meta: Meta<typeof FooterCopyright> = {
  title: 'Common/Footer/FooterCopyright',
  component: FooterCopyright,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    companyName: {
      control: 'text',
    },
    companyUrl: {
      control: 'text',
    },
    year: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    companyName: 'Your Company Name',
    companyUrl: 'https://yourcompany.com',
    year: 2025,
  },
};
