import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { technologies, projects } from '../data';
import { MultiCarousel } from '@cb-common/ui-react-mui';
import 'react-multi-carousel/lib/styles.css';
import { TechnologyCard } from '../components/TechnologyCard';
import { PageHeader, DiamondRule } from '../components/PageHeader';
import { GlassPanel } from '../components/GlassPanel';
import { ProjectsCardGrid, OTHER_PROJECTS_SECTION_ID } from './ProjectsPage';
import { ContactSection } from './ContactPage';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function HomePage() {
  const yearsOfExperience = Math.floor(
    (new Date().getTime() - new Date('2018-01-01').getTime()) /
      (1000 * 60 * 60 * 24 * 365)
  );
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <Box>
      {/* ---- Hero ---- */}
      <Box
        sx={{
          minHeight: { xs: '78vh', md: '84vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: 4,
                fontSize: '0.85rem',
              }}
            >
              Senior Software Engineer
            </Typography>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Typography
              variant="h1"
              sx={{
                mt: 1.5,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                lineHeight: 1.15,
              }}
            >
              Charles Brady
            </Typography>
            <DiamondRule width={220} />
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Typography
              variant="h6"
              sx={{
                mt: 3,
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: 620,
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              I build full-stack TypeScript systems — serverless AWS backends,
              polished React frontends, and the CI/CD pipelines that keep them
              shipping.
            </Typography>
          </motion.div>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ mt: 5 }}
            >
              <Button
                variant="contained"
                size="large"
                href="/projects"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                View Projects
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Resume
              </Button>
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="GitHub">
                  <IconButton
                    component="a"
                    href="https://github.com/charlesmbrady"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <GitHubIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="LinkedIn">
                  <IconButton
                    component="a"
                    href="https://www.linkedin.com/in/charlesmbrady/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Email">
                  <IconButton
                    component="a"
                    href="mailto:charlesmbrady@gmail.com"
                    aria-label="Email"
                  >
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Typography
              variant="body2"
              sx={{
                mt: 6,
                color: 'text.secondary',
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontSize: '0.72rem',
              }}
            >
              {yearsOfExperience}+ years shipping production software
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* ---- Technologies strip ---- */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <GlassPanel sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
            <MultiCarousel
              autoPlay={true}
              autoPlaySpeed={100}
              infinite={true}
              transitionDuration={1800}
              arrows={false}
            >
              {technologies.slice(0, 12).map((tech) => (
                <TechnologyCard key={tech.name} technology={tech} />
              ))}
            </MultiCarousel>
          </GlassPanel>
        </Container>
      </Box>

      {/* ---- About ---- */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <GlassPanel corners sx={{ p: { xs: 4, md: 6 } }}>
            <PageHeader title="About Me" overline="Who I Am" mb={4} />
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.15rem',
                lineHeight: 1.9,
                color: 'text.secondary',
                textAlign: 'center',
                maxWidth: 760,
                mx: 'auto',
              }}
            >
              Highly skilled and adaptable Senior Software Engineer with{' '}
              {yearsOfExperience}+ years of full‑stack JavaScript/TypeScript
              development. I specialize in serverless architecture, React
              development, cloud‑based security, and CI/CD pipelines. I thrive
              in both startup and enterprise environments and love building
              scalable, durable systems with great developer and user
              experience.
            </Typography>
          </GlassPanel>
        </Container>
      </Box>

      {/* ---- Projects ---- */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <PageHeader title="Featured Projects" overline="Selected Work" />
          <ProjectsCardGrid projectsList={featuredProjects} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              href="https://apps.charlesmbrady.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
              }}
            >
              View More Projects
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ---- Contact ---- */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <ContactSection />
        </Container>
      </Box>
    </Box>
  );
}
