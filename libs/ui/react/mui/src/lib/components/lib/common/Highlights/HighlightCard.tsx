import * as React from 'react';
import { Stack, Typography, Box, Card } from '../../../../core';

export type HighlightItemData = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type HighlightCardProps = {
  item: HighlightItemData;
};

export function HighlightCard({ item }: HighlightCardProps) {
  return (
    <Stack
      direction="column"
      component={Card}
      spacing={1}
      useFlexGap
      sx={{
        color: 'inherit',
        p: 3,
        height: '100%',
        borderColor: 'hsla(220, 25%, 25%, 0.3)',
        backgroundColor: 'grey.800',
      }}
    >
      <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
      <div>
        <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
          {item.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.400' }}>
          {item.description}
        </Typography>
      </div>
    </Stack>
  );
}
