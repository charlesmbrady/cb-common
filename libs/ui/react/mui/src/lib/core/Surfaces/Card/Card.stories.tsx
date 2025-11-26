// Card.stories.tsx
import type { Meta } from '@storybook/react';
import React from 'react';
import { Card } from './Card';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { CardActions } from './CardActions';
import { CardActionArea } from './CardActionArea';
import { Button } from '../../Inputs/Button/Button';
import { Box } from '../../Layout/Box/Box';
import { Typography } from '../../DataDisplay';

const meta: Meta<typeof Card> = {
  title: 'Feedback/Card',
  component: Card,
};
export default meta;

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export function BasicCard() {
  return (
    <Card sx={{ minWidth: 275 }} title={''}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
