// pages/help/index.tsx
import React from 'react';
import { NextPage } from 'next';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';

const Help: NextPage = () => {
  const theme = useTheme();
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
  return (
    <Box sx={{ p: 3 }} data-cy="helpPage">
      <Typography
        variant="h4"
        sx={{ mb: 2, color: theme.palette.text.primary }}
      >
        Help & FAQ
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
  );
};

export default Help;
