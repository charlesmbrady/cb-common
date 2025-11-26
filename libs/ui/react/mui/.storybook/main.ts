import type { StorybookConfig } from '@storybook/react-vite';

export const baseConfig: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: [
    // libs typically put stories in src
    '../**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  core: { disableTelemetry: true },
};

export default baseConfig;
