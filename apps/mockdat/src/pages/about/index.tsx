// pages/about/index.tsx
import React from 'react';
import { NextPage } from 'next';
import { Box, Typography, Link } from '@mui/material';

const DotMLogo = () => (
  <svg
    width="1200"
    height="600"
    viewBox="0 0 1200 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#1976d2', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#64b5f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1976d2', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <style>
      {`
        /* Base styles */
        .base {
          stroke: url(#gradient1);
          stroke-width: 14;
          filter: drop-shadow(0 0 2px rgba(25, 118, 210, 0.3));
        }

        /* Row 1 - Pulse animations with varying speeds */
        @keyframes pulse1 { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }
        @keyframes pulse2 { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }
        @keyframes pulse3 { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }
        .pulse1 { stroke-dasharray: 20 980; stroke-dashoffset: 1000; animation: pulse1 1.5s linear infinite; stroke: white; stroke-width: 8; }
        .pulse2 { stroke-dasharray: 20 980; stroke-dashoffset: 1000; animation: pulse2 2s linear infinite; stroke: white; stroke-width: 8; }
        .pulse3 { stroke-dasharray: 20 980; stroke-dashoffset: 1000; animation: pulse3 3s linear infinite; stroke: white; stroke-width: 8; }

        /* Row 2 - Flash animations with different patterns */
        @keyframes flash1 { 
          0%, 100% { opacity: 0; }
          25% { opacity: 1; }
        }
        @keyframes flash2 { 
          0%, 100% { opacity: 0; }
          15% { opacity: 1; }
          30% { opacity: 0; }
          45% { opacity: 1; }
          60% { opacity: 0; }
        }
        @keyframes flash3 { 
          0%, 100% { opacity: 0; }
          10% { opacity: 1; }
          20% { opacity: 0; }
          30% { opacity: 1; }
          40% { opacity: 0; }
          50% { opacity: 1; }
          60% { opacity: 0; }
        }
        .flash { stroke: white; stroke-width: 14; opacity: 0; }
        .flash1 { animation: flash1 2s linear infinite; }
        .flash2 { animation: flash2 3s linear infinite; }
        .flash3 { animation: flash3 4s linear infinite; }

        /* Row 3 - Left to right pulse across single M */
        @keyframes ltrPulse1 { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }
        @keyframes ltrPulse2 { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }
        @keyframes ltrPulse3 { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }
        .ltrPulse1 { stroke-dasharray: 40 960; stroke-dashoffset: 1000; animation: ltrPulse1 2s linear infinite; stroke: white; stroke-width: 10; }
        .ltrPulse2 { stroke-dasharray: 40 960; stroke-dashoffset: 1000; animation: ltrPulse2 2s linear infinite 0.3s; stroke: white; stroke-width: 10; }
        .ltrPulse3 { stroke-dasharray: 40 960; stroke-dashoffset: 1000; animation: ltrPulse3 2s linear infinite 0.6s; stroke: white; stroke-width: 10; }
      `}
    </style>

    {/* Row 1 - Pulse animations with varying speeds */}
    <g transform="translate(0,0)">
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="base"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="pulse1"
        fill="none"
      />
    </g>
    <g transform="translate(200,0)">
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="base"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="pulse2"
        fill="none"
      />
    </g>
    <g transform="translate(400,0)">
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="base"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="pulse3"
        fill="none"
      />
    </g>

    {/* Row 2 - Flash animations with different patterns */}
    <g transform="translate(0,200)">
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="base"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="flash flash1"
        fill="none"
      />
    </g>
    <g transform="translate(200,200)">
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="base"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="flash flash2"
        fill="none"
      />
    </g>
    <g transform="translate(400,200)">
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="base"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="flash flash3"
        fill="none"
      />
    </g>

    {/* Row 3 - Left to right pulse across single M */}
    <g transform="translate(400,400)">
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="base"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="ltrPulse1"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="ltrPulse2"
        fill="none"
      />
      <path
        d="M 40 190 L 40 30 L 100 170 L 160 30 L 160 190"
        className="ltrPulse3"
        fill="none"
      />
    </g>
  </svg>
);

const About: NextPage = () => {
  return (
    <Box sx={{ p: 3 }} data-cy="aboutPage">
      <Typography variant="h4" gutterBottom>
        About Mockdat
      </Typography>
      <Typography variant="body1" paragraph>
        Mockdat is a powerful tool for generating mock data for your
        applications.
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        <DotMLogo />
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Version: <strong data-cy="appVersion">1.0.0</strong>
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Created by the Mockdat team. Learn more at:
        <Link href="https://example.com" sx={{ ml: 0.5 }} data-cy="aboutLink">
          https://example.com
        </Link>
      </Typography>
    </Box>
  );
};

export default About;
