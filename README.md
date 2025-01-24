# CB-COMMON

## Monorepo for common code and utilities used across the various CB projects

### Structure of the monorepo is as follows:

```
├── apps
│   ├── web                # Next.js application
│   ├── api                # Nest.js application
│   └── some-other-app     # Additional app (React, Angular, or custom)
├── libs
│   ├── ui                 # Reusable UI components (React)
│   ├── shared             # Shared logic, models, utilities
│   └── nest-modules       # Additional Nest.js feature modules
├── tools                  # Custom Nx scripts, code generation tools
├── .vscode                # Editor/IDE configs
├── nx.json                # Nx-specific configuration
├── package.json           # Top-level dependencies
├── tsconfig.base.json     # Base TypeScript configuration for the monorepo
├── yarn.lock / package-lock.json
├── README.md              # This file
└── ...
```

Below is a sample README.md that introduces an Nx monorepo project structure, highlights common development commands, and provides some handy links to reference material for Next.js, Nest.js, and AWS. Feel free to modify the details, project names, or links to fit your specific setup.

Nx Monorepo: Overview & Usage
This repository uses Nx as a monorepo toolkit, enabling seamless development of multiple applications and libraries in a single workspace. The project includes both Next.js (front-end) and Nest.js (back-end) apps, and is designed to deploy to AWS.

Project Structure
csharp
Copy
├── apps
│ ├── web # Next.js application
│ ├── api # Nest.js application
│ └── some-other-app # Additional app (React, Angular, or custom)
├── libs
│ ├── ui # Reusable UI components (React)
│ ├── shared # Shared logic, models, utilities
│ └── nest-modules # Additional Nest.js feature modules
├── tools # Custom Nx scripts, code generation tools
├── .vscode # Editor/IDE configs
├── nx.json # Nx-specific configuration
├── package.json # Top-level dependencies
├── tsconfig.base.json # Base TypeScript configuration for the monorepo
├── yarn.lock / package-lock.json
├── README.md # This file
└── ...
Applications
apps/web
A Next.js front-end application, hosting the main user-facing site or dashboard.

apps/api
A Nest.js back-end application, providing RESTful APIs or GraphQL.

apps/some-other-app
Placeholder for additional front-end or back-end apps you may create.

Libraries
libs/ui
A shared React UI component library.
libs/shared
Common TypeScript utilities, models, or logic used across multiple apps.
libs/nest-modules
Reusable Nest.js modules, services, or providers for apps/api.
Development & Nx Commands
Nx provides a powerful CLI for building, serving, testing, and more:

Install Dependencies

yarn install

or

npm install

Serve the Next.js App (e.g., apps/web)

yarn nx run serve:application-name

AWS Deployment
This repository is configured with various scripts and modules to deploy to AWS services (e.g., AWS Lambda, ECS, or Amplify). Common patterns include:

AWS CloudFront + S3 for static front-end hosting
AWS Lambda for serverless back-end
AWS Elastic Beanstalk or ECS for containerized deployments
CDK / Terraform for infrastructure as code
Consult the deploy/ folder or relevant scripts in tools/ for instructions on deploying each application to AWS.

Quick Links & References

Nx.dev
https://nx.dev/
Nx Documentation – Official Nx docs, including tutorials and API references.

Next.js
https://nextjs.org/docs
Next.js Documentation – Guides on how to build React apps with Next.js (routing, SSR/SSG, etc.).

Nest.js
https://docs.nestjs.com/ ?
Nest.js Documentation – Comprehensive guide to building Node.js server-side apps.

AWS
https://docs.aws.amazon.com/
AWS Documentation – All AWS services, including Lambda, S3, CloudFront, etc.

AWS CLI Reference – Useful for manual deployments and scripting.
https://docs.aws.amazon.com/cli/latest/reference/
