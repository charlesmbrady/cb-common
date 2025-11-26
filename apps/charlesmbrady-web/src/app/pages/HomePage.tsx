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
import { HeroCommon } from '@cb-common/ui-react-mui';
import { technologies, projects } from '../data';
import { MultiCarousel } from '@cb-common/ui-react-mui';
import 'react-multi-carousel/lib/styles.css';
import { TechnologyCard } from '../components/TechnologyCard';
import { ProjectsCardGrid, OTHER_PROJECTS_SECTION_ID } from './ProjectsPage';
import { ContactSection } from './ContactPage';

export default function HomePage() {
  const yearsOfExperience = Math.floor(
    (new Date().getTime() - new Date('2018-01-01').getTime()) /
      (1000 * 60 * 60 * 24 * 365)
  );
  const featuredProjects = projects.filter((project) => project.featured);
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <Box>
      {/* Hero Section using shared UI */}
      <HeroCommon
        primaryTextProps={{
          mainText: 'Charles',
          highlightedText: `Brady`,
        }}
        secondaryTextProps={{
          text: 'Full-stack Developer | Problem Solver | Team Player',
        }}
        callToActionContent={
          <Box
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                size="large"
                href="/CharlesBrady_resume.pdf"
                target="_blank"
                sx={{ minWidth: 'fit-content', textAlign: 'center' }}
              >
                Resume
              </Button>
              <IconButton
                component="a"
                href="https://github.com/charlesmbrady"
                target="_blank"
                aria-label="GitHub"
                size="large"
              >
                <GitHubIcon />
              </IconButton>
              <Button
                variant="outlined"
                size="large"
                href="mailto:charlesmbrady@gmail.com"
                startIcon={<EmailIcon />}
                sx={{ minWidth: 'fit-content', textAlign: 'center' }}
              >
                Email
              </Button>
            </Stack>
          </Box>
        }
      />
      {/* Technologies Section */}
      <Box sx={{ py: 7, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <MultiCarousel
            autoPlay={true}
            autoPlaySpeed={100}
            infinite={true}
            transitionDuration={1800}
            arrows={false}
          >
            {technologies.slice(0, 12).map((tech) => (
              <TechnologyCard technology={tech} />
            ))}
          </MultiCarousel>
        </Container>
      </Box>
      {/* <LogoCollectionCommon title="Trusted by engineering leaders at" /> */}
      {/* About Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            gutterBottom
            sx={{ textAlign: 'center', mb: 6 }}
          >
            About Me
          </Typography>
          <Box gap={4}>
            <Box>
              <Typography
                variant="body1"
                sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
              >
                Highly skilled and adaptable Senior Software Engineer with 7+
                years of full‑stack JavaScript/TypeScript development. I
                specialize in serverless architecture, React development,
                cloud‑based security, and CI/CD pipelines. I thrive in both
                startup and enterprise environments and love building scalable,
                durable systems with great developer and user experience.
              </Typography>
            </Box>
            {/* <Box>
                <Typography
                  variant="body1"
                  sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
                >
                  Recent highlights: led a secure AWS-powered Risk Assessment
                  app; architected a broker quoting tool; designed CI/CD with
                  GitHub Actions; migrated identity to Cognito then Auth0; and
                  built an AI agent with AWS Bedrock to support underwriting.
                </Typography>
              </Box> */}
          </Box>
        </Container>
      </Box>

      {/* Projects Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            gutterBottom
            sx={{ textAlign: 'center', mb: 6 }}
          >
            Featured Projects
          </Typography>
          <ProjectsCardGrid projectsList={featuredProjects} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              href={`/projects#${OTHER_PROJECTS_SECTION_ID}`}
            >
              View More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <ContactSection />
        </Container>
      </Box>
    </Box>
  );
}
