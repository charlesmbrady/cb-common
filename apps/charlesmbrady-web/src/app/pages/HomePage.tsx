import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const projects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description:
      'A full-stack e-commerce platform built with Next.js and Node.js. Features include user authentication, product management, shopping cart, and payment processing.',
    thumbnail: '/images/projects/ecommerce-thumbnail.jpg',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Material-UI'],
  },
  {
    id: '2',
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time updates and team collaboration features.',
    thumbnail: '/images/projects/task-manager-thumbnail.jpg',
    tags: ['React', 'Firebase', 'Redux', 'Material-UI'],
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description:
      'A weather dashboard that displays current weather conditions and forecasts using multiple weather APIs.',
    thumbnail: '/images/projects/weather-dashboard-thumbnail.jpg',
    tags: ['React', 'OpenWeather API', 'Chart.js', 'Tailwind CSS'],
  },
];

const technologies = [
  { name: 'React', logo: '/images/tech/react.svg' },
  { name: 'Next.js', logo: '/images/tech/nextjs.svg' },
  { name: 'TypeScript', logo: '/images/tech/typescript.svg' },
  { name: 'Material-UI', logo: '/images/tech/material-ui.svg' },
  { name: 'Node.js', logo: '/images/tech/nodejs.svg' },
  { name: 'AWS Lambda', logo: '/images/tech/aws-lambda.svg' },
  { name: 'Docker', logo: '/images/tech/docker.svg' },
  { name: 'AWS', logo: '/images/tech/aws.svg' },
  { name: 'Terraform', logo: '/images/tech/terraform.svg' },
  { name: 'GitHub Actions', logo: '/images/tech/github-actions.svg' },
  { name: 'Auth0', logo: '/images/tech/auth0.svg' },
  { name: 'Okta', logo: '/images/tech/okta.svg' },
];

export default function HomePage() {
  const yearsOfExperience = Math.floor(
    (new Date().getTime() - new Date('2018-01-01').getTime()) /
      (1000 * 60 * 60 * 24 * 365)
  );
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #111827, #1F2937)',
          position: 'relative',
          overflow: 'hidden',
          pt: 8,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: '20px',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              mb: 4,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'white',
                mb: 1,
              }}
            >
              {yearsOfExperience}
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'white', textAlign: 'center', px: 2 }}
            >
              Years of Experience
            </Typography>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: '4rem',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 2,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Charles Brady
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: 'center', mb: 4, maxWidth: '600px', mx: 'auto' }}
          >
            Full Stack Developer | Problem Solver | Team Player
          </Typography>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: { xs: '1.5rem', md: '2.5rem' },
            }}
          >
            Senior Software Engineer
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, maxWidth: '600px', color: 'text.secondary' }}
          >
            Crafting seamless experiences through code & collaboration
          </Typography>
          <Stack direction="column" spacing={2}>
            <Button
              variant="outlined"
              size="large"
              href="CharlesBrady_resume.pdf"
              target="_blank"
            >
              View Resume
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmailIcon />}
              href="mailto:your.email@example.com"
            >
              Get in Touch
            </Button>
          </Stack>
        </motion.div>
      </Box>
      {/* About Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{ textAlign: 'center', mb: 6 }}
            >
              About Me
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
              gap={4}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
                >
                  I'm a passionate problem solver who loves turning ideas into
                  real-world applications that solve problems. My background
                  spans a unique blend of customer-facing roles and highly
                  technical positions.
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
                >
                  Over the years, I've discovered that the key to building
                  transformative software is a deep respect for the people who
                  use it. I strive for code that's both clean and purposeful.
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
      {/* Projects Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{ textAlign: 'center', mb: 6 }}
            >
              Featured Projects
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
              gap={4}
            >
              {projects.slice(0, 3).map((project) => (
                <Card
                  key={project.id}
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>
      {/* Technologies Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{ textAlign: 'center', mb: 6 }}
            >
              Technologies
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: '1fr 1fr',
                sm: '1fr 1fr 1fr',
                md: 'repeat(6, 1fr)',
              }}
              gap={2}
              justifyContent="center"
            >
              {technologies.slice(0, 12).map((tech) => (
                <Box
                  key={tech.name}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={tech.logo}
                    alt={tech.name}
                    sx={{ width: 40, height: 40, objectFit: 'contain', mb: 1 }}
                  />
                  <Typography variant="caption" align="center">
                    {tech.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>
      {/* Contact Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(145deg, #1F2937, #111827)',
              }}
            >
              <Typography variant="h3" gutterBottom>
                Let's Connect
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                I'm always open to discussing new projects, creative ideas, or
                opportunities to be part of your visions.
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                <IconButton
                  href="https://www.linkedin.com/in/charlesmbrady/"
                  target="_blank"
                  size="large"
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  href="https://github.com/charlesmbrady"
                  target="_blank"
                  size="large"
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton href="mailto:charlesmbrady@gmail.com" size="large">
                  <EmailIcon />
                </IconButton>
              </Stack>
              <Button
                variant="contained"
                size="large"
                startIcon={<EmailIcon />}
                href="mailto:charlesmbrady@gmail.com"
              >
                Send me an email
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
