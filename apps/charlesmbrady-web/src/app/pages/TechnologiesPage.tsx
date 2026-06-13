import React from 'react';
import { Box } from '@mui/material';
import { technologies } from '../data';
import { TechnologyCard } from '../components/TechnologyCard';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { GlassPanel } from '../components/GlassPanel';

const TechnologiesPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader title="Technologies" overline="Toolbox" />
      <GlassPanel sx={{ p: { xs: 2, md: 4 } }}>
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
      </GlassPanel>
    </PageContainer>
  );
};

export default TechnologiesPage;
