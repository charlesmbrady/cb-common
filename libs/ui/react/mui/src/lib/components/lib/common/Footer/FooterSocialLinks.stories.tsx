import type { Meta, StoryObj } from '@storybook/react';
import { FooterSocialLinks } from './FooterSocialLinks';
import { defaultSocialLinks } from './footerData';

const meta: Meta<typeof FooterSocialLinks> = {
  title: 'Common/Footer/FooterSocialLinks',
  component: FooterSocialLinks,
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
    links: defaultSocialLinks,
  },
};

export const FewLinks: Story = {
  args: {
    links: defaultSocialLinks.slice(0, 3),
  },
};
