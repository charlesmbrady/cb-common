// src/pages/About.tsx

import { MainContent } from '../components/MainContent';
import { PageContent } from '../components/PageContent';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import SkillsSection from '../components/SkillsSection';
import WorkExperienceSection from '../components/WorkExperienceSection';

export default function About(): JSX.Element {
  return (
    <PageContent>
      {/* Header */}
      <PageHeader
        title={'About Me'}
        description={'Hi, I’m Charles, a passionate Software Engineer.'}
      />

      {/* Main Content */}
      <MainContent>
        {/* Bio Section */}
        <Section>
          <h2 className="text-3xl font-semibold mb-4">Who I Am</h2>
          <p className="text-lg text-gray-400">
            Highly skilled and adaptable Senior Software Engineer with over 5
            years of experience in leading full-stack JavaScript development,
            specializing in serverless architecture, cloud-based security, and
            CI/CD pipelines. Proven track record of delivering scalable
            solutions in both startup and enterprise environments. Seeking to
            leverage my expertise in JavaScript, TypeScript, Node.js, and AWS
            technologies in a Principal Software Engineer/Team Lead role to
            drive innovation and efficiency in a dynamic team.
            {/* I’m a full-stack software engineer with a love for creating
            intuitive, dynamic user experiences. Over the past few years, I’ve
            developed a variety of web and mobile-friendly applications
            utilizing technologies like React, Node.js, and serverless
            architectures. I’m always eager to learn new skills and improve my
            craft. */}
          </p>
        </Section>

        {/* Skills Section */}
        <SkillsSection />
        {/* Work Experience Section */}
        <WorkExperienceSection />
      </MainContent>
    </PageContent>
  );
}
