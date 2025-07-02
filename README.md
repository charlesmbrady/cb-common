# CB Common

A modern monorepo built with Nx, featuring a collection of shared libraries and applications.

## 🚀 Technologies

- **Framework**: Next.js 14
- **UI Library**: Material-UI (MUI) v6
- **State Management**: React Context
- **Testing**: Jest, Cypress, Storybook
- **Build Tool**: Nx
- **Package Manager**: Yarn
- **Language**: TypeScript

## 📦 Project Structure

```
.
├── apps/           # Applications
├── libs/           # Shared libraries
├── tools/          # Build and development tools
├── scripts/        # Utility scripts
└── .github/        # GitHub configuration
```

## 🛠️ Prerequisites

- Node.js (LTS version)
- Yarn package manager
- Git

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd cb-common
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start development server**
   ```bash
   yarn nx serve [app-name]
   ```

## 📚 Available Scripts

- `yarn nx serve [app-name]` - Start development server
- `yarn nx build [app-name]` - Build application
- `yarn nx test [app-name]` - Run tests
- `yarn nx lint [app-name]` - Run linting
- `yarn nx e2e [app-name]` - Run end-to-end tests

## 🧪 Testing

The project uses multiple testing tools:

- **Jest** for unit testing
- **Cypress** for end-to-end testing
- **Storybook** for component testing and documentation

Run tests with:

```bash
yarn nx test [app-name]
yarn nx e2e [app-name]
```

## 📝 Code Quality

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Development Tools

- **VS Code** recommended IDE
- **Nx Console** VS Code extension for Nx commands
- **ESLint** and **Prettier** extensions for code quality

## 📦 Dependencies

The project uses:

- Material-UI for UI components
- React Router for routing
- Axios for HTTP requests
- Framer Motion for animations
- Various Nx plugins for development

## 🚀 Deployment

Deployment instructions will be added as the project evolves.

## 📞 Support

For support, please open an issue in the repository.
