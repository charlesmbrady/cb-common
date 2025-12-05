import { useTheme, useMediaQuery } from '@mui/material';
import {
  Code as CodeIcon,
  People as PeopleIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import {
  Container,
  Divider,
  Typography,
  Box,
  Paper,
} from '@cb-common/ui-react-mui';
import portrait from '../../assets/portrait-small.jpeg';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';

export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sections = [
    {
      icon: <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Technical Expertise',
      content:
        'With a background spanning from QA Engineering to Senior Software Engineering, I bring a comprehensive understanding of software development. My experience includes building robust applications, implementing best practices, and ensuring code quality at every step.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'User-Centric Approach',
      content:
        'Having worked in customer-facing roles like Technical Support and Customer Success, I understand the importance of building software that truly serves its users. I focus on creating intuitive, accessible, and meaningful experiences.',
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Innovative Problem Solving',
      content:
        "I thrive on turning complex challenges into elegant solutions. Whether it's optimizing performance, improving user experience, or implementing new features, I approach each problem with creativity and technical precision.",
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Collaborative Mindset',
      content:
        'I believe the best solutions come from diverse perspectives. I enjoy working in teams, sharing knowledge, and creating an environment where everyone can contribute their best work.',
    },
  ];

  return (
    <PageContainer>
      <PageHeader title="Hello!" />
      <Box
        sx={{
          width: { xs: '60%', sm: '50%', md: '35%' },
          maxWidth: 280,
          borderRadius: '50%',
          mx: 'auto',
          mt: 6,
          mb: 4,
          border: '4px solid',
          borderColor: 'primary.light',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        <img
          src={portrait}
          alt="Portrait of Charles Brady"
          style={{ width: '100%', display: 'block' }}
        />
      </Box>

      <Paper
        // elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 2,
          // background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h3" sx={{ textAlign: 'center', m: 0 }}>
          About Me
        </Typography>

        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 6,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          Crafting Seamless Experiences Through Code & Collaboration
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'text.primary',
          }}
        >
          I'm a passionate problem solver who loves turning ideas into
          real-world applications. My background spans a unique blend of
          customer-facing roles—like Technical Support and Customer Success—and
          highly technical positions as a QA Engineer, Software Engineer, and
          eventually a Senior Software Engineer.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 6,
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'text.primary',
          }}
        >
          Over the years, I've discovered that the key to building
          transformative software is a deep respect for the people who use it. I
          strive for code that's both clean and purposeful, ensuring that each
          feature adds value (and maybe a little joy) to someone's day.
        </Typography>

        <Divider sx={{ my: 6 }} />

        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
          gap={4}
        >
          {sections.map((section, index) => (
            <Box key={index}>
              <Box
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {section.icon}
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    mb: 2,
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  {section.content}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Typography
          variant="body1"
          sx={{
            mt: 6,
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'text.primary',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          When I'm not busy engineering the next big solution, you might find me
          brainstorming visionary concepts, refining user experiences, or adding
          a playful dash of humor to keep team morale high.
        </Typography>
      </Paper>
    </PageContainer>
  );
}
