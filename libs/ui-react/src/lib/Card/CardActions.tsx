import MuiCardActions from '@mui/material/CardActions';

export type CardActionsProps = React.ComponentProps<typeof MuiCardActions>;

export function CardActions(props: CardActionsProps) {
  return <MuiCardActions {...props} />;
}

export default CardActions;
