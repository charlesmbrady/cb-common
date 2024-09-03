import MuiCssBaseline from '@mui/material/CssBaseline';

export type CssBaselineProps = React.ComponentProps<typeof MuiCssBaseline>;

export function CssBaseline(props: CssBaselineProps) {
  return <MuiCssBaseline {...props} />;
}

export default CssBaseline;
