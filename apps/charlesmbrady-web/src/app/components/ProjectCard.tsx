import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
} from '@mui/material';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  appLink?: string; // live deployed application
  demoLink?: string; // video demo (e.g. YouTube)
  codeLink?: string; // repository link
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
    {(project.appLink || project.demoLink || project.codeLink) && (
      <CardActions sx={{ mt: 'auto' }}>
        {project.appLink && (
          <Button
            variant="outlined"
            size="small"
            href={project.appLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Live App
          </Button>
        )}
        {project.demoLink && (
          <Button
            variant="outlined"
            size="small"
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo Video
          </Button>
        )}
        {project.codeLink && (
          <Button
            variant="outlined"
            size="small"
            href={project.codeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </Button>
        )}
      </CardActions>
    )}
  </Card>
);
