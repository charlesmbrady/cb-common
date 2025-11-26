import * as React from 'react';

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from '../../../../core';

export type TestimonialData = {
  avatar: React.ReactNode;
  name: string;
  occupation: string;
  testimonial: string;
};

export type TestimonialCardProps = {
  testimonial: TestimonialData;
  logo?: string;
  logoAlt?: string;
};

const logoStyle = {
  width: '64px',
  opacity: 0.3,
};

export function TestimonialCard({
  testimonial,
  logo,
  logoAlt,
}: TestimonialCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
      }}
    >
      <CardContent>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: 'text.secondary' }}
        >
          {testimonial.testimonial}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <CardHeader
          avatar={testimonial.avatar}
          title={testimonial.name}
          subheader={testimonial.occupation}
        />
        {logo && (
          <img src={logo} alt={logoAlt || 'Company logo'} style={logoStyle} />
        )}
      </Box>
    </Card>
  );
}
