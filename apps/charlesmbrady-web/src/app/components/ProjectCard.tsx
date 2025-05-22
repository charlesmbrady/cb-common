import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
}

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'translateY(-8px)',
        transition: 'transform 0.3s ease-in-out',
      },
    }}
  >
    <CardMedia
      component="img"
      height="200"
      image={project.thumbnail}
      alt={project.title}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="h2">
        {project.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {project.description}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {project.tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" />
        ))}
      </Box>
    </CardContent>
  </Card>
);
