// Alert.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const AlertEmpty: Story = {
  args: { children: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = await canvas.getByTestId('alert');
    await userEvent.click(alert);
    expect(alert).toBeVisible();
  },
};

export const AlertWithTitle: Story = {
  args: { title: 'Alert Title', children: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = await canvas.getByTestId('alert');
    expect(alert).toBeVisible();
    const alertTitle = await canvas.getByTestId('alert-title');
    expect(alertTitle).toBeVisible();
    expect(alertTitle).toHaveTextContent('Alert Title');
  },
};

export const AlertWithTitleAndMessage: Story = {
  args: { title: 'Alert Title', children: 'Alert Message' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = await canvas.getByTestId('alert');
    expect(alert).toBeVisible();
    const alertTitle = await canvas.getByTestId('alert-title');
    expect(alertTitle).toBeVisible();
    expect(alertTitle).toHaveTextContent('Alert Title');
    expect(alert).toHaveTextContent('Alert Message');
  },
};

//Alert with no title but with message
export const AlertWithMessageOnly: Story = {
  args: { children: 'Alert Message Only' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = await canvas.getByTestId('alert');
    expect(alert).toBeVisible();
    expect(alert).toHaveTextContent('Alert Message Only');
  },
};
