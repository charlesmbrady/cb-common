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
        <Typography variant="h5" sx={{ mb: 1 }}>
          Table of Contents
        </Typography>
        <List>
          <ListItem
            button
            component="a"
            href="#overview"
            data-cy="toc-overviewLink"
          >
            <ListItemText primary="Overview" />
          </ListItem>
          <ListItem
            button
            component="a"
            href="#basicUsage"
            data-cy="toc-basicUsageLink"
          >
            <ListItemText primary="Basic Usage" />
          </ListItem>
          <ListItem
            button
            component="a"
            href="#advancedConfig"
            data-cy="toc-advancedConfigLink"
          >
            <ListItemText primary="Advanced Configuration" />
          </ListItem>
          <ListItem button component="a" href="#api" data-cy="toc-apiLink">
            <ListItemText primary="API" />
          </ListItem>
        </List>
      </Box>

      {/* 1. OVERVIEW */}
      <Box sx={{ mb: 3 }} id="overview" data-cy="overviewSection">
        <Typography variant="h5" sx={{ mb: 1 }} data-cy="overviewHeader">
          Overview
        </Typography>
        <Typography variant="body1" data-cy="overviewContent">
          This section provides a high-level introduction to Mockdat— what it
          is, why it exists, and how it can help you generate realistic data for
          testing, demos, and development. Include quick links to relevant
          resources here.
        </Typography>
      </Box>

      {/* 2. BASIC USAGE */}
      <Box sx={{ mb: 3 }} id="basicUsage" data-cy="basicUsageSection">
        <Typography variant="h5" sx={{ mb: 1 }} data-cy="basicUsageHeader">
          Basic Usage
        </Typography>
        <Typography variant="body1" data-cy="basicUsageContent">
          In this section, you might detail how to create a scenario, select
          fields, set record counts, and generate data using Mockdat’s wizard.
          Provide step-by-step instructions, screenshots, or code snippets to
          help users get started.
        </Typography>
      </Box>

      {/* 3. ADVANCED CONFIGURATION */}
      <Box sx={{ mb: 3 }} id="advancedConfig" data-cy="advancedConfigSection">
        <Typography variant="h5" sx={{ mb: 1 }} data-cy="advancedConfigHeader">
          Advanced Configuration
        </Typography>
        <Typography variant="body1" data-cy="advancedConfigContent">
          Here you can describe more complex usage scenarios, such as
          customizing output formats, integrating with external APIs, using
          environment variables, or advanced plugin settings.
        </Typography>
      </Box>

      {/* 4. API */}
      <Box sx={{ mb: 3 }} id="api" data-cy="apiSection">
        <Typography variant="h5" sx={{ mb: 1 }} data-cy="apiHeader">
          API
        </Typography>
        <Typography variant="body1" data-cy="apiContent">
          If Mockdat offers an API or programmatic interface, list the
          endpoints, request/response shapes, authentication tokens, or code
          samples. Include details about rate limits, error handling, and
          versioning.
        </Typography>
      </Box>
    </Box>
  );
};

export default Documentation;
