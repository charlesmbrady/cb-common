import * as React from 'react';
import { Box, Typography, Card } from '../../../../core';

export type FeatureImageDisplayProps = {
  imageLight: string;
  imageDark: string;
  title?: string;
  description: string;
  variant?: 'desktop' | 'mobile';
};

export function FeatureImageDisplay({
  imageLight,
  imageDark,
  title,
  description,
  variant = 'desktop',
}: FeatureImageDisplayProps) {
  if (variant === 'mobile') {
    return (
      <Card variant="outlined">
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 280,
            backgroundImage: 'var(--items-imageLight)',
            ...theme.applyStyles('dark', {
              backgroundImage: 'var(--items-imageDark)',
            }),
          })}
          style={
            {
              '--items-imageLight': imageLight,
              '--items-imageDark': imageDark,
            } as any
          }
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 'medium' }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {description}
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        width: '100%',
        display: { xs: 'none', sm: 'flex' },
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={(theme) => ({
          m: 'auto',
          width: 420,
          height: 500,
          backgroundSize: 'contain',
          backgroundImage: 'var(--items-imageLight)',
          ...theme.applyStyles('dark', {
            backgroundImage: 'var(--items-imageDark)',
          }),
        })}
        style={
          {
            '--items-imageLight': imageLight,
            '--items-imageDark': imageDark,
          } as any
        }
      />
    </Card>
  );
}
