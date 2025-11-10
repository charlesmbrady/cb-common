import type { Config } from 'tailwindcss';
import { corePreset } from './core';
import { shadow } from '../tokens';

export const sharpTheme: Partial<Config> = {
  presets: [corePreset],
  theme: {
    extend: {
      boxShadow: {
        sharp: shadow.sharp,
      },
    },
  },
};
