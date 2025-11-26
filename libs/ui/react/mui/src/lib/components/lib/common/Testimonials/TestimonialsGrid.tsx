import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useColorScheme } from '@mui/material/styles';
import { TestimonialCard, TestimonialData } from './TestimonialCard';
import {
  defaultTestimonials,
  lightModeLogos,
  darkModeLogos,
} from './testimonialsData';

export type TestimonialsGridProps = {
  testimonials?: TestimonialData[];
  lightLogos?: string[];
  darkLogos?: string[];
  showLogos?: boolean;
};

export function TestimonialsGrid({
  testimonials = defaultTestimonials,
  lightLogos = lightModeLogos,
  darkLogos = darkModeLogos,
  showLogos = true,
}: TestimonialsGridProps) {
  const { mode, systemMode } = useColorScheme();

  let logos: string[] = [];
  if (showLogos) {
    if (mode === 'system') {
      logos = systemMode === 'light' ? lightLogos : darkLogos;
    } else if (mode === 'light') {
      logos = lightLogos;
    } else {
      logos = darkLogos;
    }
  }

  return (
    <Grid container spacing={2}>
      {testimonials.map((testimonial, index) => (
        <Grid
          size={{ xs: 12, sm: 6, md: 4 }}
          key={index}
          sx={{ display: 'flex' }}
        >
          <TestimonialCard
            testimonial={testimonial}
            logo={showLogos ? logos[index] : undefined}
            logoAlt={`Logo ${index + 1}`}
          />
        </Grid>
      ))}
    </Grid>
  );
}
