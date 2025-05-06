// pages/help/index.tsx
import React from 'react';
import { NextPage } from 'next';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Help: NextPage = () => {
  const helpTopics = [
    'How to create a scenario',
    'How to use community scenarios',
    'How to preview large data sets',
    // ...
  ];

  return (
    <Box sx={{ p: 3 }} data-cy="helpPage">
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
          Common Topics
        </Typography>
        <List data-cy="helpTopicsList">
          {helpTopics.map((topic) => (
            <ListItem key={topic} data-cy={`helpTopic-${topic}`}>
              <ListItemText
                primary={topic}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Help;
