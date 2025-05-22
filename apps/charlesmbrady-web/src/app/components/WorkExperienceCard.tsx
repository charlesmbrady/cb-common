import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  duration: string;
  description: string;
  tags: string[];
}

export const WorkExperienceCard: React.FC<{ experience: WorkExperience }> = ({
  experience,
}) => (
  <Card sx={{ width: '100%', mb: 2 }}>
    <CardContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {experience.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {experience.duration}
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
        {experience.company}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {experience.description}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {experience.tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" />
        ))}
      </Box>
    </CardContent>
  </Card>
);
