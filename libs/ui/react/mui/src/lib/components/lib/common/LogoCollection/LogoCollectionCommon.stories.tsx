import type { Meta, StoryObj } from '@storybook/react';
import { LogoCollectionCommon } from './LogoCollectionCommon';
import { logosData } from './logosData';

const meta: Meta<typeof LogoCollectionCommon> = {
  title: 'Common/LogoCollection/LogoCollectionCommon',
  component: LogoCollectionCommon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    logos: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTitle: Story = {
  args: {
    title: 'Our Amazing Partners',
  },
};

export const CustomLogos: Story = {
  args: {
    title: 'Technology Partners',
    logos: logosData.slice(0, 3),
  },
};
