import * as React from 'react';
import Grid from '@mui/material/Grid';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Card,
  CardActions,
  CardContent,
} from '../../../../core';
import type { PricingTier } from './pricingData';

export type PricingCardProps = {
  tier: PricingTier;
};

export function PricingCard({ tier }: PricingCardProps) {
  const isProfessional = tier.title === 'Professional';

  return (
    <Grid
      size={{ xs: 12, sm: tier.title === 'Enterprise' ? 12 : 6, md: 4 }}
      key={tier.title}
    >
      <Card
        sx={[
          {
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          },
          isProfessional &&
            ((theme) => ({
              border: 'none',
              background:
                'radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))',
              boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
              ...theme.applyStyles('dark', {
                background:
                  'radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))',
                boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`,
              }),
            })),
        ]}
      >
        <CardContent>
          <Box
            sx={[
              {
                mb: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              },
              isProfessional ? { color: 'grey.100' } : { color: '' },
            ]}
          >
            <Typography component="h3" variant="h6">
              {tier.title}
            </Typography>
            {isProfessional && tier.subheader && (
              <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
            )}
          </Box>
          <Box
            sx={[
              {
                display: 'flex',
                alignItems: 'baseline',
              },
              isProfessional ? { color: 'grey.50' } : { color: null },
            ]}
          >
            <Typography component="h3" variant="h2">
              ${tier.price}
            </Typography>
            <Typography component="h3" variant="h6">
              &nbsp; per month
            </Typography>
          </Box>
          <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
          {tier.description.map((line) => (
            <Box
              key={line}
              sx={{
                py: 1,
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              <CheckCircleRoundedIcon
                sx={[
                  {
                    width: 20,
                  },
                  isProfessional
                    ? { color: 'primary.light' }
                    : { color: 'primary.main' },
                ]}
              />
              <Typography
                variant="subtitle2"
                component={'span'}
                sx={[isProfessional ? { color: 'grey.50' } : { color: null }]}
              >
                {line}
              </Typography>
            </Box>
          ))}
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            variant={tier.buttonVariant}
            color={tier.buttonColor}
          >
            {tier.buttonText}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
