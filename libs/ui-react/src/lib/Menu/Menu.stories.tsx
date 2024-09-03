import { Story, Meta } from '@storybook/react';
import { Menu, MenuProps } from './Menu';
import { MenuItem } from '../MenuItem/MenuItem';

export default {
  component: Menu,
  title: 'Menu',
} as Meta;

const Template: Story<MenuProps> = (args) => <Menu {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: (
    <>
      <MenuItem>One</MenuItem>
      <MenuItem>One</MenuItem>
      <MenuItem>One</MenuItem>
    </>
  ),
  open: true,
};
