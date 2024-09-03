import MuiCardMedia from '@mui/material/CardMedia';

export type CardMediaProps = React.ComponentProps<typeof MuiCardMedia>;

export function CardMedia(props: CardMediaProps) {
  return <MuiCardMedia {...props} />;
}

export default CardMedia;
