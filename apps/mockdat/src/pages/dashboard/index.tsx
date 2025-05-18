// pages/dashboard/index.tsx
import React from 'react';
import { NextPage } from 'next';
import { Box, Typography, Button, Divider } from '@mui/material';
import { withAuth } from '@cb-common/auth';
import { useRouter } from 'next/router';

const Dashboard: NextPage = () => {
  const router = useRouter();
  return (
    <Box sx={{ p: 3 }} data-cy="dashboardPage">
      {/* Scenarios Section */}
      <Box sx={{ mb: 3 }} data-cy="scenariosSection">
        <Typography
          variant="h5"
          sx={{ color: 'text.primary' }}
          data-cy="scenariosTitle"
        >
          Scenarios
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
          Quickly create or edit a scenario for generating data.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          data-cy="createScenarioBtn"
          onClick={() => router.push('/wizard')}
        >
          Create New Scenario
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* My Saved Scenarios */}
      <Box sx={{ mb: 3 }} data-cy="mySavedScenariosSection">
        <Typography
          variant="h5"
          sx={{ color: 'text.primary' }}
          data-cy="mySavedScenariosTitle"
        >
          My Saved Scenarios
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
          Access scenarios you've created or saved.
        </Typography>
        {/* Example placeholders for a list */}
        <Box data-cy="savedScenariosList">
          {/* Map over user's scenarios if available */}
          <Typography sx={{ color: 'text.primary' }}>
            No saved scenarios yet. Create your first!
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Community Scenarios */}
      <Box sx={{ mb: 3 }} data-cy="communityScenariosSection">
        <Typography
          variant="h5"
          sx={{ color: 'text.primary' }}
          data-cy="communityScenariosTitle"
        >
          Community Scenarios
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
          Explore scenarios shared by the community.
        </Typography>
        <Box data-cy="communityScenariosList">
          {/* Map over community scenarios if available */}
          <Typography sx={{ color: 'text.primary' }}>
            No community scenarios available yet.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(Dashboard);
