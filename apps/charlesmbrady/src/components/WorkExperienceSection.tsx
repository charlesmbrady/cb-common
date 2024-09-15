// src/components/WorkExperienceSection.tsx

import { Section } from './Section';
import { SectionTitle } from './SectionTitle';

const workExperienceItems = [
  {
    role: 'Senior Software Engineer',
    company: 'Curi',
    startDate: 'August 2021',
    endDate: 'Present',
    responsibilities: [
      'Led a team in the development of a proprietary Risk Assessment application, allowing physicians to gain CME credits through an AWS-powered, secure platform.',
      'Architected and developed a quoting tool for brokers, utilizing React and serverless architecture (AWS Lambda, API Gateway) to dynamically integrate with legacy databases.',
      'Architected, developed, and trained machine learning models with AWS Comprehend to extract key insurance details from emails sent through Salesforce to speed up the quoting process.',
      'Managed the integration of an acquired company into our Salesforce environment, customizing workflows without disrupting existing functionality.',
      'Spearheaded the migration from a legacy SSO provider to AWS Cognito, implementing customized authentication hooks and ensuring seamless integration with existing systems.',
      'Developed and maintained CI/CD pipelines using GitHub Actions, facilitating automated testing and deployment across multiple applications.',
      'Contributed to key architecture decisions and collaborated closely with internal teams and external consultants to deliver high-value solutions.',
      'Mostly developed solutions using Node.js (JavaScript and TypeScript), but occasionally wrote integrations using Python or Salesforce Apex code.',
    ],
  },
  {
    role: 'Software Developer - Fullstack JavaScript',
    company: 'Curi',
    startDate: 'August 2020',
    endDate: 'August 2021',
    responsibilities: [
      'Developed multiple web applications and tools using React, Node.js, AWS services, and serverless architecture, enhancing user experience and operational efficiency.',
      'Maintained and extended the Terraform-based infrastructure as code, ensuring consistent and reliable deployment of applications and services.',
      'Developed IaC modules to reuse across multiple AWS accounts and repositories to ensure security and consistent code for services using Lambdas, API Gateway, Secrets Manager, IAM resources, CloudFront/S3-hosted web applications, and more.',
      'Led the development of a member profile application using React and Material UI, streamlining user management processes for insured members.',
      "Provided strategic input on architectural decisions, helping guide the team's technical direction.",
    ],
  },
  {
    role: 'Software Engineer - Fullstack JavaScript',
    company: 'Self',
    startDate: 'December 2017',
    endDate: 'Present',
    responsibilities: [
      'Designed and implemented modern full-stack applications with React, Node.js, and various databases (MongoDB, MySQL).',
      'Created custom WebPack configurations, improving application performance and streamlining the development process.',
      'Developed and deployed Dockerized applications to AWS and Heroku, integrating CI/CD pipelines for automated testing and deployment.',
      'Built several tools, including a Salesforce test data generator and a CRM database duplication application.',
    ],
  },
  {
    role: 'Software Engineer - QA',
    company: 'Validity',
    startDate: 'January 2019',
    endDate: 'April 2020',
    responsibilities: [
      'Bootstrapped CI/CD processes for multiple enterprise applications, ensuring high-quality releases and reducing deployment time.',
      'Developed and executed automated test suites using Cypress.io, Mocha, and Jest, achieving comprehensive test coverage and improving software reliability.',
      'Contributed to the development of the front-end of a large-scale entitlement system using React, improving user operations and customer license management.',
      'Developed a tool for creating test data in Salesforce, crucial for validating the performance of enterprise products.',
    ],
  },
];

export default function WorkExperienceSection(): JSX.Element {
  return (
    <Section>
      <SectionTitle title="Work Experience" />
      <div className="space-y-8">
        {workExperienceItems.map((workExperienceItem) => (
          <WorkExperienceItem
            key={workExperienceItem.company}
            {...workExperienceItem}
          />
        ))}
      </div>
    </Section>
  );
}

type WorkExperienceItemProps = {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
};
function WorkExperienceItem({
  role,
  company,
  startDate,
  endDate,
  responsibilities,
}: WorkExperienceItemProps): JSX.Element {
  return (
    <div className="space-y-2">
      <div className="font-mono">
        <WorkExperienceCompany role={role} company={company} />
        <WorkExperienceTimeline startDate={startDate} endDate={endDate} />
      </div>
      <WorkExperienceDescription responsibilities={responsibilities} />
    </div>
  );
}

function WorkExperienceCompany({
  role,
  company,
}: {
  role: string;
  company: string;
}): JSX.Element {
  return (
    <h3 className="font-bold">
      {role} - {company}
    </h3>
  );
}

function WorkExperienceTimeline({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): JSX.Element {
  return (
    <p className="italic">
      {startDate} - {endDate}
    </p>
  );
}

function WorkExperienceDescription({
  responsibilities,
}: {
  responsibilities: string[];
}): JSX.Element {
  return (
    <ul className="list-outside">
      {responsibilities.map((responsibility) => (
        <WorkExperienceResponsibilityItem
          key={responsibility}
          description={responsibility}
        />
      ))}
    </ul>
  );
}

function WorkExperienceResponsibilityItem({
  description,
}: {
  description: string;
}): JSX.Element {
  return <li className="list-disc my-1">{description}</li>;
}
