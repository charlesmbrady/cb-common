import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { colors, radius, shadow } from '../tokens';

export const corePreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        accent: colors.accent,
        surface: colors.surface,
        success: colors.success,
        danger: colors.danger,
      },
      borderRadius: {
        xs: radius.xs.toString(),
        sm: radius.sm.toString(),
        md: radius.md.toString(),
        lg: radius.lg.toString(),
        xl: radius.xl.toString(),
      },
      boxShadow: shadow,
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('hocus', ['&:hover', '&:focus']);
    }),
  ],
};
