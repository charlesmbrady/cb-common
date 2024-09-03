import MuiCardHeader from '@mui/material/CardHeader';

export type CardHeaderProps = React.ComponentProps<typeof MuiCardHeader>;

export function CardHeader(props: CardHeaderProps) {
  return <MuiCardHeader {...props} />;
}

export default CardHeader;
