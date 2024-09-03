import MuiTypography, {
  TypographyProps as MuiTypographyProps,
} from '@mui/material/Typography';

export type TypographyProps = MuiTypographyProps;

export function Typography(props: TypographyProps) {
  return <MuiTypography {...props} />;
}

export default Typography;
