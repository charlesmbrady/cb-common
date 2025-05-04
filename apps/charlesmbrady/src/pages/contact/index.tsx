import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Contact: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 2,
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            mb: 4,
          }}
        >
          Get in Touch
        </Typography>

        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 6,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </Typography>

        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 6 }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<EmailIcon />}
            href="mailto:charlesmbrady@gmail.com"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Send me an email
          </Button>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            mt: 4,
          }}
        >
          <IconButton
            href="https://www.linkedin.com/in/charlesmbrady/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              '&:hover': {
                transform: 'scale(1.1)',
                color: 'primary.dark',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <LinkedInIcon fontSize="large" />
          </IconButton>
          <IconButton
            href="https://github.com/charlesmbrady"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              '&:hover': {
                transform: 'scale(1.1)',
                color: 'primary.dark',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <GitHubIcon fontSize="large" />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact;
