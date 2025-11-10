import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

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
        icon: 'paintbrush',
        items: ['base', 'glass', 'sharp', 'neo'],
      },
    },
  },
  // A generic theme switcher (adds class to body/html). Useful for Tailwind data-themes.
  decorators: [
    withThemeByClassName({
      themes: {
        base: 'theme-base',
        glass: 'theme-glass',
        sharp: 'theme-sharp',
        neo: 'theme-neo',
      },
      defaultTheme: 'base',
    }),
  ],
};
