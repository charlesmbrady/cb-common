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
    elevation={0}
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      overflow: 'hidden',
      backgroundColor: (theme) =>
        theme.vars
          ? `rgba(${theme.vars.palette.background.paperChannel} / 0.55)`
          : theme.palette.background.paper,
      backdropFilter: 'blur(18px) saturate(1.4)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      transition:
        'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        borderColor: 'primary.main',
        boxShadow: (theme) =>
          `inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 16px 40px -16px ${theme.palette.primary.main}40`,
        '& .project-card-media': {
          transform: 'scale(1.04)',
        },
      },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: 200,
        flexShrink: 0,
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={project.thumbnail}
        alt={project.title}
        className="project-card-media"
        sx={{ transition: 'transform 0.4s ease', objectFit: 'cover' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, transparent 55%, rgba(10, 12, 20, 0.35))',
          pointerEvents: 'none',
        }}
      />
    </Box>
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Typography
        gutterBottom
        variant="h5"
        component="h2"
        sx={{ fontWeight: 700 }}
      >
        {project.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {project.description}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {project.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              fontSize: '0.72rem',
            }}
          />
        ))}
      </Box>
    </CardContent>
    {(project.appLink || project.demoLink || project.codeLink) && (
      <CardActions sx={{ mt: 'auto', px: 3, pb: 2.5, pt: 0, gap: 1 }}>
        {project.appLink && (
          <Button
            variant="contained"
            size="small"
            disableElevation
            href={project.appLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
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
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
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
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Source Code
          </Button>
        )}
      </CardActions>
    )}
  </Card>
);
