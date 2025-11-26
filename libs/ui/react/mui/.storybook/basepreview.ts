import type { Preview } from '@storybook/react';

//For Tailwind, your tailwindDecorator can set data-theme and dark class, or rely on the withThemeByClassName decorator and CSS vars in your presets.

export const basePreview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Intro', 'Foundations', 'Components', 'Patterns', 'Kits'],
      },
    },
  },
  // globals is not a valid key in ProjectAnnotations<ReactRenderer>; remove it to fix lint error
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Visual theme',
      defaultValue: 'base',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [{ value: 'base', title: 'Base Theme' }],
        dynamicTitle: true,
      },
    },
  },
  // A generic theme switcher (adds class to body/html). Useful for Tailwind data-themes.
  decorators: [],
};
