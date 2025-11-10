import type { Meta, StoryObj } from '@storybook/react';
import { FooterLegalLinks } from './FooterLegalLinks';
import { defaultFooterLegalLinks } from './footerData';

const meta: Meta<typeof FooterLegalLinks> = {
  title: 'Common/Footer/FooterLegalLinks',
  component: FooterLegalLinks,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    links: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    links: defaultFooterLegalLinks,
  },
};

export const CustomLinks: Story = {
  args: {
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
};
