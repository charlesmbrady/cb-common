// pages/about/index.tsx
import React from 'react';
import { Box, Typography, Link, useTheme, List, ListItem } from '@mui/material';

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
      <List sx={{ color: theme.palette.text.primary, mt: 0, mb: 2 }}>
        <ListItem>
          Generate data for common business objects (Accounts, Contacts, Leads,
          Opportunities, and more)
        </ListItem>
        <ListItem>Customizable fields and record types</ListItem>
        <ListItem>Preview generated data before export</ListItem>
        <ListItem>Export data in CSV or JSON format</ListItem>
        <ListItem>Modern, step-by-step wizard interface</ListItem>
        <ListItem>Dark mode and responsive design</ListItem>
      </List>
      <Typography
        variant="body1"
        paragraph
        sx={{ color: theme.palette.text.primary }}
      >
        <strong>How to Use:</strong>
      </Typography>
      <List
        sx={{
          color: theme.palette.text.primary,
          mt: 0,
          mb: 2,
          listStyleType: 'decimal',
          pl: 3,
        }}
        component="ol"
      >
        <ListItem component="li" sx={{ display: 'list-item' }}>
          Choose a record type or select "Generic" to access every available
          field.
        </ListItem>
        <ListItem component="li" sx={{ display: 'list-item' }}>
          Select the fields you want to include in your mock data.
        </ListItem>
        <ListItem component="li" sx={{ display: 'list-item' }}>
          Specify the number of records to generate.
        </ListItem>
        <ListItem component="li" sx={{ display: 'list-item' }}>
          Preview your data and make adjustments as needed.
        </ListItem>
        <ListItem component="li" sx={{ display: 'list-item' }}>
          Download your data in the desired format.
        </ListItem>
      </List>
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
          <List sx={{ pl: 2, color: theme.palette.text.primary }}>
            {commits.map((commit) => (
              <ListItem key={commit.sha} sx={{ display: 'list-item', mb: 1 }}>
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
              </ListItem>
            ))}
          </List>
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
