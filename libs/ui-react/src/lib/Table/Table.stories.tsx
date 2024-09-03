import { Story, Meta } from '@storybook/react';
import { Table, TableProps } from './Table';
import { Typography } from '../Typography/Typography';
import { TableFooter } from './TableFooter';
import { TableCell } from './TableCell';
import { TableRow } from './TableRow';

export default {
  component: Table,
  title: 'Table',
} as Meta;

const Template: Story<TableProps> = (args) => <Table {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  headers: [
    { label: 'One', name: 'one' },
    { label: 'Two', name: 'two' },
    { label: 'One Two', name: 'oneTwo' },
  ],
  rows: [
    {
      one: 'Yo',
      two: 'Cool',
      oneTwo: '5/11/1001',
    },
    {
      one: 'yo',
      two: 'Cool',
      oneTwo: '5/11/1001',
    },
  ],
};

export const WithFooter = Template.bind({});

WithFooter.args = {
  headers: [
    { label: 'One', name: 'one' },
    { label: 'Two', name: 'two' },
    { label: 'One Two', name: 'oneTwo' },
  ],
  rows: [
    {
      one: 'Yo',
      two: 'Cool',
      oneTwo: '5/11/1001',
    },
    {
      one: 'yo',
      two: 'Cool',
      oneTwo: '5/11/1001',
    },
  ],
  footer: (
    <TableFooter>
      <TableRow>
        <TableCell align="right" colSpan={5}>
          <Typography>Total: $1000</Typography>
        </TableCell>
      </TableRow>
    </TableFooter>
  ),
};
