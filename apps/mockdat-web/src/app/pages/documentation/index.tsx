// pages/documentation/index.tsx
// TS ignore this file //FIXME: fix this issue with the button instead of workaround
// @ts-nocheck

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';

/**
 * Documentation Page with Table of Contents
 * that links to distinct sections by anchor IDs.
 */

const changelog = [
  // Example static changelog entries; you can fetch dynamically if needed
  {
    message: 'Initial release of Mockdat',
    author: 'Mockdat Team',
    date: '2024-06-01',
  },
  {
    message: 'Added support for Opportunity and Generic record types',
    author: 'Mockdat Team',
    date: '2024-06-10',
  },
];

const helpTopics = [
  {
    title: 'How to create a scenario',
    description:
      'Use the wizard to select a record type, choose fields, set quantity, and preview/export your data.',
  },
  {
    title: 'How to use community scenarios',
    description:
      'Browse and import scenarios shared by the community from the Dashboard.',
  },
  {
    title: 'How to preview large data sets',
    description:
      'Use the Preview step in the wizard to see a sample of your generated data before exporting.',
  },
  {
    title: 'How to export data',
    description:
      'After previewing, select your desired output format (CSV or JSON) and click Download.',
  },
  {
    title: 'How to start over',
    description:
      'Click the Start Over button in the final step to reset the wizard and begin a new scenario.',
  },
  {
    title: 'Where to get support',
    description:
      'Visit the GitHub repository or contact the Mockdat team for help.',
  },
];

const Documentation = () => {
  const theme = useTheme();
  return (
    <Box sx={{ p: 3 }} data-cy="documentationPage">
      {/* TABLE OF CONTENTS */}
      <Box sx={{ mb: 3 }} data-cy="tableOfContents">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          Table of Contents
        </Typography>
        <List>
          <ListItem button component="a" href="#overview">
            <ListItemText primary="Overview" />
          </ListItem>
          <ListItem button component="a" href="#features">
            <ListItemText primary="Features" />
          </ListItem>
          <ListItem button component="a" href="#usage">
            <ListItemText primary="Usage" />
          </ListItem>
          <ListItem button component="a" href="#faq">
            <ListItemText primary="FAQ" />
          </ListItem>
          <ListItem button component="a" href="#fields">
            <ListItemText primary="Available Fields" />
          </ListItem>
          <ListItem button component="a" href="#changelog">
            <ListItemText primary="Changelog" />
          </ListItem>
          <ListItem button component="a" href="#credits">
            <ListItemText primary="Credits & Version" />
          </ListItem>
        </List>
      </Box>

      {/* OVERVIEW */}
      <Box sx={{ mb: 3 }} id="overview">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.primary' }}>
          <strong>Mockdat</strong> is a modern tool for generating large sets of
          realistic mock data for testing, demos, and development. It features a
          step-by-step wizard, customizable fields, and support for common
          business objects like Accounts, Contacts, Leads, and Opportunities.
          Mockdat is designed for developers, QA engineers, and anyone who needs
          high-quality sample data quickly and easily.
        </Typography>
      </Box>

      {/* FEATURES */}
      <Box sx={{ mb: 3 }} id="features">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          Features
        </Typography>
        <List sx={{ color: 'text.primary', mt: 0, mb: 2 }}>
          <ListItem>
            Generate data for common business objects (Accounts, Contacts,
            Leads, Opportunities, and more)
          </ListItem>
          <ListItem>Customizable fields and record types</ListItem>
          <ListItem>Preview generated data before export</ListItem>
          <ListItem>Export data in CSV or JSON format</ListItem>
          <ListItem>Modern, step-by-step wizard interface</ListItem>
          <ListItem>Dark mode and responsive design</ListItem>
        </List>
      </Box>

      {/* USAGE */}
      <Box sx={{ mb: 3 }} id="usage">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          Usage
        </Typography>
        <List
          component="ol"
          sx={{ pl: 3, color: 'text.primary', listStyleType: 'decimal' }}
        >
          <ListItem component="li" sx={{ display: 'list-item' }}>
            Open the Mockdat app and click <strong>Get Started</strong> to
            launch the wizard.
          </ListItem>
          <ListItem component="li" sx={{ display: 'list-item' }}>
            Select a record type (e.g., Accounts, Contacts, Leads,
            Opportunities, or Generic for all fields).
          </ListItem>
          <ListItem component="li" sx={{ display: 'list-item' }}>
            Choose the fields you want to include in your mock data set.
          </ListItem>
          <ListItem component="li" sx={{ display: 'list-item' }}>
            Specify the number of records to generate (up to 2,000,000).
          </ListItem>
          <ListItem component="li" sx={{ display: 'list-item' }}>
            Preview your generated data in the table view.
          </ListItem>
          <ListItem component="li" sx={{ display: 'list-item' }}>
            Download your data as CSV or JSON for use in your projects.
          </ListItem>
        </List>
      </Box>

      {/* FAQ */}
      <Box sx={{ mb: 3 }} id="faq">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          FAQ
        </Typography>
        <List>
          {helpTopics.map((topic, idx) => (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemText
                primary={topic.title}
                secondary={topic.description}
                primaryTypographyProps={{
                  sx: { color: theme.palette.text.primary, fontWeight: 500 },
                }}
                secondaryTypographyProps={{
                  sx: { color: theme.palette.text.primary, opacity: 0.8 },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* AVAILABLE FIELDS */}
      <Box sx={{ mb: 3 }} id="fields">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          Available Mock Data Fields
        </Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 700, mb: 4 }}>
          <Table size="small" aria-label="available fields table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Field Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  name: 'Account Name',
                  desc: 'Randomly generated company or account name',
                },
                { name: 'City', desc: 'US city name' },
                { name: 'State', desc: 'US state name' },
                { name: 'Street', desc: 'Realistic street address' },
                { name: 'Phone Number', desc: 'US-format phone number' },
                { name: 'First Name', desc: "Person's first name" },
                { name: 'Last Name', desc: "Person's last name" },
                { name: 'Email', desc: 'Email address (first.last@email.com)' },
                { name: 'Title', desc: 'Job title' },
                {
                  name: 'Lead Source',
                  desc: 'Source of the lead (e.g., Web, Referral)',
                },
                {
                  name: 'Lead Status',
                  desc: 'Status of the lead (e.g., New, Working)',
                },
                { name: 'Opportunity Stage', desc: 'Sales pipeline stage' },
                { name: 'Close Date', desc: 'Date within the next 90 days' },
                {
                  name: 'Amount',
                  desc: 'Currency value (formatted as $X,XXX)',
                },
                {
                  name: 'Probability',
                  desc: 'Probability percentage (formatted as XX%)',
                },
                { name: 'Forecast Category', desc: 'Sales forecast category' },
              ].map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* CHANGELOG */}
      <Box sx={{ mb: 3 }} id="changelog">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          Changelog
        </Typography>
        <List sx={{ pl: 2, color: 'text.primary' }}>
          {changelog.map((commit, idx) => (
            <ListItem key={idx} sx={{ display: 'list-item', mb: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.primary }}
              >
                <strong>{commit.message}</strong>
                <br />
                <span style={{ color: theme.palette.text.secondary }}>
                  {commit.author} &mdash; {commit.date}
                </span>
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* CREDITS & VERSION */}
      <Box sx={{ mb: 3 }} id="credits">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          Credits & Version
        </Typography>
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
          <MuiLink
            href="https://github.com/charlesmbrady/cb-common/tree/main/apps/mockdat"
            target="_blank"
            rel="noopener"
            sx={{ color: theme.palette.primary.main }}
          >
            GitHub
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Documentation;
