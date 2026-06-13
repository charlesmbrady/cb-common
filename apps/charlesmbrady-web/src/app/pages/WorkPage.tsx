import React from 'react';
import { AccordionBasic } from '@cb-common/ui-react-mui';
import { workExperiences } from '../data/workExperiences';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { GlassPanel } from '../components/GlassPanel';

const WorkPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader title="Work Experience" overline="Career" />
      <GlassPanel sx={{ p: { xs: 2, md: 4 } }}>
        <AccordionBasic items={workExperiences} />
      </GlassPanel>
    </PageContainer>
  );
};

export default WorkPage;
