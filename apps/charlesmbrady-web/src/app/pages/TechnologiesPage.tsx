import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Link as MuiLink,
} from '@mui/material';

type Technology = {
  name: string;
  category: string;
  logo: string;
  url: string;
};

const technologies = [
  {
    name: 'React',
    category: 'Frontend',
    logo: '/images/tech/react.svg',
    url: 'https://reactjs.org',
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    logo: '/images/tech/nextjs.svg',
    url: 'https://nextjs.org',
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    logo: '/images/tech/typescript.svg',
    url: 'https://www.typescriptlang.org',
  },
  {
    name: 'Material-UI',
    category: 'Frontend',
    logo: '/images/tech/material-ui.svg',
    url: 'https://mui.com',
  },
  {
    name: 'Node.js',
    category: 'Backend',
    logo: '/images/tech/nodejs.svg',
    url: 'https://nodejs.org',
  },
  {
    name: 'AWS Lambda',
    category: 'Backend',
    logo: '/images/tech/aws-lambda.svg',
    url: 'https://aws.amazon.com/lambda',
  },
  {
    name: 'Docker',
    category: 'Backend',
    logo: '/images/tech/docker.svg',
    url: 'https://www.docker.com',
  },
  {
    name: 'AWS',
    category: 'Cloud',
    logo: '/images/tech/aws.svg',
    url: 'https://aws.amazon.com',
  },
  {
    name: 'Terraform',
    category: 'Cloud',
    logo: '/images/tech/terraform.svg',
    url: 'https://www.terraform.io',
  },
  {
    name: 'GitHub Actions',
    category: 'DevOps',
    logo: '/images/tech/github-actions.svg',
    url: 'https://github.com/features/actions',
  },
  {
    name: 'Auth0',
    category: 'Security',
    logo: '/images/tech/auth0.svg',
    url: 'https://auth0.com',
  },
  {
    name: 'Okta',
    category: 'Security',
    logo: '/images/tech/okta.svg',
    url: 'https://www.okta.com',
  },
  {
    name: 'Jira',
    category: 'Tools',
    logo: '/images/tech/jira.svg',
    url: 'https://www.atlassian.com/software/jira',
  },
  {
    name: 'Postman',
    category: 'Tools',
    logo: '/images/tech/postman.svg',
    url: 'https://www.postman.com',
  },
  {
    name: 'Salesforce',
    category: 'Platforms',
    logo: '/images/tech/salesforce.svg',
    url: 'https://www.salesforce.com',
  },
];

function TechnologyCard({ technology }: { technology: Technology }) {
  return (
    <MuiLink
      href={technology.url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'background.paper',
          '&:hover': { boxShadow: 6 },
        }}
      >
        <Box
          component="img"
          src={technology.logo}
          alt={technology.name}
          sx={{ height: 60, width: 'auto', objectFit: 'contain', mb: 1 }}
        />
        <CardContent sx={{ p: 1, textAlign: 'center' }}>
          <Typography variant="subtitle1" component="div">
            {technology.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {technology.category}
          </Typography>
        </CardContent>
      </Card>
    </MuiLink>
  );
}

export default function TechnologiesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Technologies
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: 'center', mb: 6, maxWidth: 700, mx: 'auto' }}
      >
        Here are some of the technologies I regularly work with, focusing on
        modern JavaScript frameworks, cloud, and DevOps tools.
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr 1fr',
          sm: '1fr 1fr 1fr',
          md: 'repeat(6, 1fr)',
        }}
        gap={2}
        justifyContent="center"
      >
        {technologies.slice(0, 12).map((tech) => (
          <Box
            key={tech.name}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
            }}
          >
            <Box
              component="img"
              src={tech.logo}
              alt={tech.name}
              sx={{ width: 40, height: 40, objectFit: 'contain', mb: 1 }}
            />
            <Typography variant="caption" align="center">
              {tech.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
