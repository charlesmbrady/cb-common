import { Story, Meta } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';

export default {
  component: Breadcrumbs,
  title: 'Breadcrumbs',
} as Meta;

const Template: Story = (args) => <Breadcrumbs {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  links: [
    {
      text: 'Home',
      link: '/',
    },
    {
      text: 'Services',
      link: '/services',
    },
    {
      text: 'Website Development',
    },
  ],
};
