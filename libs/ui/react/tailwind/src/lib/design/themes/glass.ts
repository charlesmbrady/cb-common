import type { Config } from 'tailwindcss';
import { corePreset } from './core';
import { shadow } from '../tokens';

export const glassTheme: Partial<Config> = {
  presets: [corePreset],
  theme: {
    extend: {
      boxShadow: {
        glass: shadow.glass,
      },
    },
  },
};
