import { createTheme } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes, typography, shadows, shape } from '../themePrimitives';

/**
 * The base component customizations, exported so consuming apps can build
 * their own themes on top of the shared component styling.
 */
export const baseThemeComponents = {
  ...inputsCustomizations,
  ...dataDisplayCustomizations,
  ...feedbackCustomizations,
  ...navigationCustomizations,
  ...surfacesCustomizations,
};

export const baseTheme = createTheme({
  // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
    cssVarPrefix: 'template',
  },
  colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
  typography,
  shadows,
  shape,
  components: baseThemeComponents,
});
