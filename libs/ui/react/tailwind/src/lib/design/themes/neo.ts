import type { Config } from 'tailwindcss';
import { corePreset } from './core';
import { shadow } from '../tokens';

export const neoTheme: Partial<Config> = {
  presets: [corePreset],
  theme: {
    extend: {
      boxShadow: {
        neo: shadow.neo,
      },
    },
  },
};
