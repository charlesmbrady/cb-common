import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import { Project } from './types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = project.youtubeLink ? getYouTubeId(project.youtubeLink) : null;

  return (
    <Card sx={{ 
      mb: 3,
      '&:hover': {
        boxShadow: 6,
      },
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%',
      }}>
        {/* Video/Thumbnail Section */}
        <Box sx={{ 
          width: isMobile ? '100%' : 300,
          height: isMobile ? 200 : 'auto',
          minHeight: isMobile ? 200 : 300,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={project.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <Box
              component="img"
              src={project.thumbnail}
              alt={project.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1,
          p: 2,
        }}>
          <Typography variant="h5" component="div" gutterBottom>
            {project.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {project.description}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            mb: 2,
          }}>
            {project.tags.map((tag) => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small"
                sx={{ 
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                }}
              />
            ))}
          </Box>

          <Box sx={{ 
            display: 'flex',
            gap: 1,
            mt: 'auto',
            justifyContent: isMobile ? 'flex-start' : 'flex-end',
          }}>
            {project.githubLink && (
              <IconButton 
                href={project.githubLink} 
                target="_blank"
                sx={{ color: 'text.primary' }}
              >
                <GitHubIcon />
              </IconButton>
            )}
            {project.demoLink && (
              <Button
                variant="contained"
                endIcon={<LaunchIcon />}
                href={project.demoLink}
                target="_blank"
                size="small"
              >
                Demo
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}; 