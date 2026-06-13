//Common code for each main page header with title and optional subtitle
import React from 'react';
import { Box, Typography } from '@cb-common/ui-react-mui';

interface PageHeaderProps {
  title: string;
  overline?: string;
  subtitle?: string;
  mb?: number;
}

/** Thin gradient rule with a small diamond at its center. */
export const DiamondRule: React.FC<{ width?: number }> = ({ width = 180 }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.25,
      mx: 'auto',
      mt: 2,
      width,
    }}
  >
    <Box
      sx={{
        flex: 1,
        height: '1px',
        background: (theme: any) =>
          `linear-gradient(90deg, transparent, ${theme.palette.primary.main})`,
      }}
    />
    <Box
      sx={{
        width: 7,
        height: 7,
        transform: 'rotate(45deg)',
        border: '1px solid',
        borderColor: 'primary.main',
        flexShrink: 0,
      }}
    />
    <Box
      sx={{
        flex: 1,
        height: '1px',
        background: (theme: any) =>
          `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
      }}
    />
  </Box>
);

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  overline,
  subtitle,
  mb = 6,
}) => {
  return (
    <Box sx={{ textAlign: 'center', mb }}>
      {overline && (
        <Typography
          variant="overline"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            letterSpacing: 3,
            display: 'block',
            mb: 0.5,
          }}
        >
          {overline}
        </Typography>
      )}
      <Typography variant="h3" component="h1" sx={{ m: 0 }}>
        {title}
      </Typography>
      <DiamondRule />
      {subtitle && (
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: 640,
            mx: 'auto',
            mt: 2,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
