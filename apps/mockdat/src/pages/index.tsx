import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import DotMLogo from '../components/DotMLogo';
import { features } from '../utils/features';
import { initStreamAnimation } from '../utils/streamAnimation';

// Typing animation for record types
const recordTypes = [
  'Generic',
  'Accounts',
  'Contacts',
  'Leads',
  'Opportunities',
];

function useTypingRecordType(
  types: string[],
  typingSpeed = 80,
  pause = 1200,
  eraseSpeed = 40
) {
  const [index, setIndex] = React.useState(0);
  const [display, setDisplay] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(true);
  const [isErasing, setIsErasing] = React.useState(false);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = types[index];
    if (isTyping) {
      if (display.length < current.length) {
        timeout = setTimeout(() => {
          setDisplay(current.slice(0, display.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setIsTyping(false), pause);
      }
    } else if (!isTyping && !isErasing) {
      timeout = setTimeout(() => setIsErasing(true), 400);
    } else if (isErasing) {
      if (display.length > 0) {
        timeout = setTimeout(() => {
          setDisplay(current.slice(0, display.length - 1));
        }, eraseSpeed);
      } else {
        setIsErasing(false);
        setIsTyping(true);
        setIndex((prev) => (prev + 1) % types.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [
    display,
    isTyping,
    isErasing,
    index,
    types,
    typingSpeed,
    pause,
    eraseSpeed,
  ]);

  return display;
}

export default function LandingPage() {
  const theme = useTheme();
  const typedRecordType = useTypingRecordType(recordTypes);

  React.useEffect(() => {
    const canvas = document.getElementById(
      'datastream-canvas'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const { stop } = initStreamAnimation(canvas);
    return () => stop && stop();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: 0,
        pt: { xs: 2, md: 4 },
      }}
    >
      {/* Techy animated background with floating faded data streams */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 0%, #6366f133 0%, transparent 70%), linear-gradient(120deg, #6366f122 0%, #34D39922 100%)`,
        }}
      >
        {/* Canvas-based animated data streams (starfield effect) */}
        <canvas
          id="datastream-canvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.18,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          // This script is for static export fallback. The real animation is in useEffect below.
        `,
          }}
        />
      </Box>
      {/* Towering M logo, vignette, and hero section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'relative',
          width: '100%',
          height: 'auto',
          zIndex: 1,
          marginTop: 72,
          marginBottom: 48,
        }}
      >
        {/* Vignette/glow behind logo */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: { xs: 520, md: 900 },
            height: { xs: 310, md: 500 },
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #6366F1 0%, #34D39933 60%, transparent 100%)',
            filter: 'blur(64px)',
            zIndex: 1,
            opacity: 0.38,
          }}
        />
        {/* Hero text and button, layered above logo */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pb: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              letterSpacing: 2,
              mt: 0,
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            Welcome to Mockdat
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 2, color: theme.palette.text.primary }}
          >
            The easiest way to generate, preview, and export realistic mock data
            for your apps.
          </Typography>
          <Link href="/wizard" passHref legacyBehavior>
            <Button
              variant="contained"
              size="large"
              sx={{
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                boxShadow: 3,
                background: 'linear-gradient(90deg, #6366F1 0%, #34D399 100%)',
                color: '#fff',
                textTransform: 'none',
                transition: 'background 0.2s',
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #4F46E5 0%, #10B981 100%)',
                },
              }}
            >
              Get Started
            </Button>
          </Link>
        </Box>
      </motion.div>
      {/* Typing animation section - now above the cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.8, ease: 'easeOut' }}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 0,
          marginBottom: 40,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: { xs: '1.5rem', md: '2.2rem' },
            letterSpacing: 1,
          }}
        >
          Generate{' '}
          <Box
            component="span"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              borderRight: '2px solid',
              borderColor: theme.palette.primary.main,
              pr: 0.5,
              minWidth: 60,
              display: 'inline-block',
              transition: 'color 0.2s',
            }}
          >
            {typedRecordType}
          </Box>{' '}
          data
        </Typography>
      </motion.div>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ zIndex: 1, mb: 1, mt: 0, maxWidth: 1200, mx: 'auto' }}
      >
        {features.map((feature, i) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.9 + i * 0.2,
                duration: 0.7,
                ease: 'easeOut',
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: theme.palette.background.paper,
                  boxShadow: 2,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontFamily: 'Orbitron, sans-serif',
                      color: theme.palette.primary.main,
                      mb: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
