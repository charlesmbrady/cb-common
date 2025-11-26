import React from 'react';
import { Box } from '@mui/material';
import { technologies } from '../data';
import { TechnologyCard } from '../components/TechnologyCard';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';

const TechnologiesPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader title="Technologies" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: '1fr 1fr 1fr',
            md: '1fr 1fr 1fr 1fr',
          },
          gap: 3,
        }}
      >
        {technologies.map((tech) => (
          <TechnologyCard key={tech.name} technology={tech} />
        ))}
      </Box>
    </PageContainer>
  );
};

export default TechnologiesPage;
