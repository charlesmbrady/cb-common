import React from 'react';
import { AccordionBasic } from '@cb-common/ui-react-mui';
import { workExperiences } from '../data/workExperiences';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';

const WorkPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader title="Work Experience" />
      <AccordionBasic items={workExperiences} />
    </PageContainer>
  );
};

export default WorkPage;
