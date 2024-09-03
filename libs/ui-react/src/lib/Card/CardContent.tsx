import MuiCardContent from '@mui/material/CardContent';

export type CardContentProps = React.ComponentProps<typeof MuiCardContent>;

export function CardContent(props: CardContentProps) {
  return <MuiCardContent {...props} />;
}

export default CardContent;
