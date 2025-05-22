import React from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';

type Project = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  githubLink?: string;
  demoLink?: string;
  youtubeLink?: string;
};

const projects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description:
      'A full-stack e-commerce platform built with Next.js and Node.js. Features include user authentication, product management, shopping cart, and payment processing.',
    thumbnail: '/images/projects/ecommerce-thumbnail.jpg',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Material-UI'],
    githubLink: 'https://github.com/username/ecommerce',
    demoLink: 'https://ecommerce-demo.com',
    youtubeLink: 'https://youtu.be/AGJjvxJdOjs?si=uYtQfpaKdibSzNTe',
  },
  {
    id: '2',
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time updates and team collaboration features.',
    thumbnail: '/images/projects/task-manager-thumbnail.jpg',
    tags: ['React', 'Firebase', 'Redux', 'Material-UI'],
    githubLink: 'https://github.com/username/task-manager',
    demoLink: 'https://task-manager-demo.com',
    youtubeLink: 'https://youtu.be/CaAn4yNo-t8?si=ky_zgELflCfQJO4q',
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description:
      'A weather dashboard that displays current weather conditions and forecasts using multiple weather APIs.',
    thumbnail: '/images/projects/weather-dashboard-thumbnail.jpg',
    tags: ['React', 'OpenWeather API', 'Chart.js', 'Tailwind CSS'],
    githubLink: 'https://github.com/username/weather-dashboard',
    demoLink: 'https://weather-dashboard-demo.com',
    youtubeLink: 'https://youtu.be/AGJjvxJdOjs?si=uYtQfpaKdibSzNTe',
  },
];

function ProjectCard({ project }: { project: Project }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const videoId = project.youtubeLink
    ? getYouTubeId(project.youtubeLink)
    : null;
  return (
    <Card sx={{ mb: 3, '&:hover': { boxShadow: 6 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: isMobile ? '100%' : 300,
            height: isMobile ? 200 : 'auto',
            minHeight: isMobile ? 200 : 300,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
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
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
          <Typography variant="h5" component="div" gutterBottom>
            {project.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {project.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {project.tags.map((tag: string) => (
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
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 'auto',
              justifyContent: isMobile ? 'flex-start' : 'flex-end',
            }}
          >
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
}

export default function ProjectsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Projects
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: 'center', mb: 6, maxWidth: 700, mx: 'auto' }}
      >
        Here are some of the projects I've worked on, showcasing a range of
        skills from full-stack development to UI/UX design and cloud
        integration.
      </Typography>
      <Box>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Box>
    </Container>
  );
}
