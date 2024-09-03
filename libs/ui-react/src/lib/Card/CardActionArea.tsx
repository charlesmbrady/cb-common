import MuiCardActionArea from '@mui/material/CardActionArea';

export type CardActionAreaProps = React.ComponentProps<typeof MuiCardActionArea>;

export function CardActionArea(props: CardActionAreaProps) {
  return <MuiCardActionArea {...props} />;
}

export default CardActionArea;
