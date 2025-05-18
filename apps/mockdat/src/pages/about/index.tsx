// pages/about/index.tsx
import React from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';

export async function getStaticProps() {
  const res = await fetch(
    'https://api.github.com/repos/charlesmbrady/cb-common/commits?path=apps/mockdat&per_page=10'
  );
  const commits = await res.json();
  return { props: { commits } };
}

const About = ({ commits = [] }) => {
  const theme = useTheme();
  return (
    <Box sx={{ p: 3 }} data-cy="aboutPage">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        About Mockdat
      </Typography>
      <Typography
        variant="body1"
        paragraph
        sx={{ color: theme.palette.text.primary }}
      >
        Mockdat is a powerful tool for generating large sets of realistic mock
        data for testing, demos, and development. Whether you need to populate a
        database, test an application, or create sample data for a demo, Mockdat
        makes it easy and flexible.
      </Typography>
      <Typography
        variant="body1"
        paragraph
        sx={{ color: theme.palette.text.primary }}
      >
        <strong>Key Features:</strong>
      </Typography>
      <ul
        style={{
          color: theme.palette.text.primary,
          marginTop: 0,
          marginBottom: 16,
        }}
      >
        <li>
          Generate data for common business objects (Accounts, Contacts, Leads,
          Opportunities, and more)
        </li>
        <li>Customizable fields and record types</li>
        <li>Preview generated data before export</li>
        <li>Export data in CSV or JSON format</li>
        <li>Modern, step-by-step wizard interface</li>
        <li>Dark mode and responsive design</li>
      </ul>
      <Typography
        variant="body1"
        paragraph
        sx={{ color: theme.palette.text.primary }}
      >
        <strong>How to Use:</strong>
      </Typography>
      <ol
        style={{
          color: theme.palette.text.primary,
          marginTop: 0,
          marginBottom: 16,
        }}
      >
        <li>
          Choose a record type or select "All" to access every available field.
        </li>
        <li>Select the fields you want to include in your mock data.</li>
        <li>Specify the number of records to generate.</li>
        <li>Preview your data and make adjustments as needed.</li>
        <li>Download your data in the desired format.</li>
      </ol>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        {/* DotMLogo component removed as per instructions */}
      </Box>
      <Typography
        variant="body1"
        sx={{ mb: 2, color: theme.palette.text.primary }}
      >
        Version: <strong data-cy="appVersion">1.0.0</strong>
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 2, color: theme.palette.text.primary }}
      >
        Created by the Mockdat team. Learn more at:{' '}
        <Link
          href="https://github.com/charlesmbrady/cb-common/tree/main/apps/mockdat"
          target="_blank"
          rel="noopener"
          sx={{ color: theme.palette.primary.main }}
        >
          GitHub
        </Link>
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Changelog
        </Typography>
        {commits && Array.isArray(commits) && commits.length > 0 ? (
          <Box component="ul" sx={{ pl: 2, color: theme.palette.text.primary }}>
            {commits.map((commit) => (
              <li key={commit.sha} style={{ marginBottom: 12 }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  <strong>{commit.commit.message.split('\n')[0]}</strong>
                  <br />
                  <span style={{ color: theme.palette.text.secondary }}>
                    {commit.commit.author.name} &mdash;{' '}
                    {new Date(commit.commit.author.date).toLocaleDateString()}
                  </span>
                </Typography>
              </li>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No recent changes found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default About;
