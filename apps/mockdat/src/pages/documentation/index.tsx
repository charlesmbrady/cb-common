// pages/documentation/index.tsx
// TS ignore this file //FIXME: fix this issue with the button instead of workaround
// @ts-nocheck

import React from 'react';
import { NextPage } from 'next';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
} from '@mui/material';

/**
 * Documentation Page with Table of Contents
 * that links to distinct sections by anchor IDs.
 */

const Documentation: NextPage = () => {
  return (
    <Box sx={{ p: 3 }} data-cy="documentationPage">
      {/* TABLE OF CONTENTS */}
      <Box sx={{ mb: 3 }} data-cy="tableOfContents">
        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
          Table of Contents
        </Typography>
        <List>
          <ListItem
            button
            component="a"
            href="#overview"
            data-cy="toc-overviewLink"
          >
            <ListItemText
              primary="Overview"
              primaryTypographyProps={{ color: 'text.primary' }}
            />
          </ListItem>
          <ListItem
            button
            component="a"
            href="#basicUsage"
            data-cy="toc-basicUsageLink"
          >
            <ListItemText
              primary="Basic Usage"
              primaryTypographyProps={{ color: 'text.primary' }}
            />
          </ListItem>
          <ListItem
            button
            component="a"
            href="#advancedConfig"
            data-cy="toc-advancedConfigLink"
          >
            <ListItemText
              primary="Advanced Configuration"
              primaryTypographyProps={{ color: 'text.primary' }}
            />
          </ListItem>
        </List>
      </Box>

      {/* 1. OVERVIEW */}
      <Box sx={{ mb: 3 }} id="overview" data-cy="overviewSection">
        <Typography
          variant="h5"
          sx={{ mb: 1, color: 'text.primary' }}
          data-cy="overviewHeader"
        >
          Overview
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.primary' }}
          data-cy="overviewContent"
        >
          <strong>Mockdat</strong> is a modern tool for generating large sets of
          realistic mock data for testing, demos, and development. It features a
          step-by-step wizard, customizable fields, and support for common
          business objects like Accounts, Contacts, Leads, and Opportunities.
          Mockdat is designed for developers, QA engineers, and anyone who needs
          high-quality sample data quickly and easily.
        </Typography>
      </Box>

      {/* 2. BASIC USAGE */}
      <Box sx={{ mb: 3 }} id="basicUsage" data-cy="basicUsageSection">
        <Typography
          variant="h5"
          sx={{ mb: 1, color: 'text.primary' }}
          data-cy="basicUsageHeader"
        >
          Basic Usage
        </Typography>
        <Box sx={{ color: 'text.primary' }}>
          <ol
            style={{ margin: 0, paddingLeft: 20 }}
            data-cy="basicUsageContent"
          >
            <li>
              Open the Mockdat app and click <strong>Get Started</strong> to
              launch the wizard.
            </li>
            <li>
              Select a record type (e.g., Accounts, Contacts, Leads,
              Opportunities, or Generic for all fields).
            </li>
            <li>
              Choose the fields you want to include in your mock data set.
            </li>
            <li>
              Specify the number of records to generate (up to 2,000,000).
            </li>
            <li>Preview your generated data in the table view.</li>
            <li>Download your data as CSV or JSON for use in your projects.</li>
          </ol>
        </Box>
      </Box>
    </Box>
  );
};

export default Documentation;
