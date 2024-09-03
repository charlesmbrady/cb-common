import MuiCard from '@mui/material/Card';

export type CardProps = React.ComponentProps<typeof MuiCard>;

export function Card(props: CardProps) {
  return <MuiCard {...props} />;
}

export default Card;
