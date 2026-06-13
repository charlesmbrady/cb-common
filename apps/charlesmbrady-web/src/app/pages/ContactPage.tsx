import React from 'react';
import { useTheme, useMediaQuery, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Typography, Box, Button, Stack } from '@cb-common/ui-react-mui';
import { PageContainer } from '../components/PageContainer';
import { GlassPanel } from '../components/GlassPanel';
import { DiamondRule } from '../components/PageHeader';

export const ContactSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <GlassPanel
      corners
      sx={{
        p: { xs: 4, md: 8 },
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" sx={{ textAlign: 'center', m: 0 }}>
        Get in Touch
      </Typography>
      <DiamondRule />

      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
          fontWeight: 400,
          mt: 2,
          mb: 5,
          maxWidth: '560px',
          mx: 'auto',
        }}
      >
        I'm always open to discussing new projects, creative ideas, or
        opportunities to be part of your visions.
      </Typography>

      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 4 }}
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
            fontWeight: 600,
            fontSize: '1.05rem',
            '&:hover': {
              transform: 'translateY(-2px)',
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
          gap: 2,
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
    </GlassPanel>
  );
};

export default function ContactPage() {
  return (
    <PageContainer>
      <ContactSection />
    </PageContainer>
  );
}
