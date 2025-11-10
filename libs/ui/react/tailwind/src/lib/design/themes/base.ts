import type { Config } from 'tailwindcss';
import { corePreset } from './core';

export const baseTheme: Partial<Config> = {
  presets: [corePreset],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1d4ed8, #9333ea)',
      },
    },
  },
};
