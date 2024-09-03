import MuiGlobalStyles, { GlobalStylesProps as MuiGlobalStylesProps } from '@mui/material/GlobalStyles';
import globalStyles from './index.module.css';

export type GlobalStylesProps = MuiGlobalStylesProps;

export function GlobalStyles(props: GlobalStylesProps) {
  return <MuiGlobalStyles {...props} styles={globalStyles} />;
}

export default GlobalStyles;
