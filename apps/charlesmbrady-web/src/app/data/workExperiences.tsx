import { List, ListItem, Stack, Typography } from '@cb-common/ui-react-mui';

export const ExperienceItem = ({
  title,
  company,
  dateRange,
}: {
  title: string;
  company: string;
  dateRange: string;
}) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
    justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
    sx={{ width: '100%', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
  >
    <Typography
      variant="h4"
      sx={{
        fontSize: { xs: '1.5rem', sm: '2.125rem' },
        lineHeight: 1.1,
      }}
    >
      {title}
    </Typography>
    <Stack
      spacing={0.5}
      alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
      sx={{ textAlign: { xs: 'left', sm: 'right' } }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          textAlign: { xs: 'left', sm: 'right' },
        }}
      >
        @ {company}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '0.9rem', sm: '1rem' },
          textAlign: { xs: 'left', sm: 'right' },
        }}
      >
        {dateRange}
      </Typography>
    </Stack>
  </Stack>
);

export const ExperienceDescription = ({ items }: { items: string[] }) => (
  <List>
    {items.map((descriptionItem) => (
      <ListItem key={descriptionItem}>• {descriptionItem}</ListItem>
    ))}
  </List>
);

export const workExperiences = [
  {
    // title: 'Senior Software Engineer @ Curi - (2021 - Present)',
    title: (
      <ExperienceItem
        title="Senior Software Engineer"
        company="Curi"
        dateRange="2021 - Present"
      />
    ),
    description: (
      <ExperienceDescription
        items={[
          'Led a team in the development of a proprietary Risk Assessment application, allowing physicians to gain CME credits through an AWS-powered, secure platform.',
          'Architected and developed a quoting tool for brokers, utilizing React and serverless architecture (AWS Lambda, API Gateway) to dynamically integrate with legacy databases.',
          'Architected, developed and trained machine learning models with AWS Comprehend to extract key insurance details from emails sent through Salesforce to speed up quoting process',
          'Managed the integration of an acquired company into our Salesforce environment, customizing workflows without disrupting existing functionality.',
          'Spearheaded the migration from a legacy SSO provider to AWS Cognito, and then eventually to Auth0 after a merger, implementing customized authentication hooks and ensuring seamless integration with existing systems.',
          'Developed and maintained CI/CD pipelines using GitHub Actions, facilitating automated testing and deployment across multiple applications.',
          'Prioritized the promotion process by emphasizing infrastructure as code (Terraform and Scalr) and also stressing the principle of least privilege',
          'Contributed to key architecture decisions and collaborated closely with internal teams and external consultants to deliver high-value solutions.',
          'Mostly developed solutions using Node.js (Javascript and Typescript), but occasionally wrote integrations using Python, Java, or Salesforce Apex code.',
          'Used AWS Bedrock to create an AI agent chatbot with specialized knowledge of our underwriting guidelines for our underwriters to consult.',
          'Worked with AWS intelligent document processing accelerator program to refine LLM prompts and evaluation of our results.',
        ]}
      />
    ),
  },
  {
    title: (
      <ExperienceItem
        title="Software Engineer"
        company="Curi"
        dateRange="2020 - 2021"
      />
    ),
    description: (
      <ExperienceDescription
        items={[
          'Developed multiple web applications and tools using React, Node.js, AWS services, and serverless architecture, enhancing user experience and operational efficiency.',
          'Maintained and extended the Terraform-based infrastructure as code, ensuring consistent and reliable deployment of applications and services.',
          'Developed IaC modules to reuse across multiple AWS Accounts and repositories to ensure security and consistent code for services using Lambdas, API Gateway, Secrets Manager, IAM resources, Cloudfront/S3-hosted web applications and more.',
          'Led the development of a member profile application using React and Material UI, streamlining user management processes for insured members.',
          "Provided strategic input on architectural decisions, helping guide the team's technical direction.",
        ]}
      />
    ),
  },
  {
    title: (
      <ExperienceItem
        title="QA Engineer"
        company="Validity"
        dateRange="2019 - 2020"
      />
    ),
    description: (
      <ExperienceDescription
        items={[
          'Bootstrapped CI/CD processes for multiple enterprise applications, ensuring high-quality releases and reducing deployment time.',
          'Developed and executed automated test suites using Cypress.io, Mocha, and Jest, achieving comprehensive test coverage and improving software reliability.',
          'Contributed to the development of the front-end of a large-scale entitlement system using React, improving user operations and customer license management.',
          'Developed a tool for creating test data in Salesforce, crucial for validating the performance of enterprise products.',
        ]}
      />
    ),
  },
  {
    title: (
      <ExperienceItem
        title="Technical Support Representative"
        company="Validity"
        dateRange="2017 - 2019"
      />
    ),
    description: (
      <ExperienceDescription
        items={[
          'Managed customer support queue in Salesforce as thousands of cases came in regarding our custom ETL software tool designed for Salesforce and Dynamics. Delegated to appropriate team members as necessary.',
          'Met with hundreds of clients regarding their unique and often complex business use cases across the globe and all industries.',
          'Created tutorial videos and help documentation for our custom software.',
          'After troubleshooting any issues, provided detailed reproducibility steps and logs to senior developers for debugging.',
        ]}
      />
    ),
  },
];
