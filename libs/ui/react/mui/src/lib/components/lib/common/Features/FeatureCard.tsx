import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Chip, Card } from '../../../../core';

export type FeatureItemData = {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageLight: string;
  imageDark: string;
};

export type FeatureCardProps = {
  feature: FeatureItemData;
  selected?: boolean;
  onClick?: () => void;
};

interface ChipProps {
  selected?: boolean;
}

const StyledChip = styled(Chip)<ChipProps>(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => !!selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

export function FeatureCard({
  feature,
  selected = false,
  onClick,
}: FeatureCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              backgroundColor: 'action.hover',
              borderRadius: 1,
            }
          : {},
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 'var(--items-image-height)',
          mb: 2,
          border: '1px solid',
          borderColor: selected ? 'primary.light' : 'divider',
          borderRadius: 1,
          backgroundColor: selected ? 'action.selected' : 'background.paper',
        }}
      >
        <Box
          sx={{
            px: 2,
            pb: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              color: selected ? 'primary.main' : 'text.secondary',
              fontSize: '2rem',
            }}
          >
            {feature.icon}
          </Box>
          <Typography
            sx={{
              color: 'text.primary',
              fontWeight: 'medium',
              textAlign: 'center',
            }}
          >
            {feature.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            {feature.description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function FeatureChip({
  feature,
  selected = false,
  onClick,
}: FeatureCardProps) {
  return (
    <StyledChip
      size="medium"
      label={feature.title}
      onClick={onClick}
      selected={selected}
    />
  );
}
