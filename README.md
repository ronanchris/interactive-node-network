Welcome to the Interactive Node Network project! This guide will help you get started and understand our comprehensive documentation system.

## 🚀 Quick Start

1. **First Time Setup**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd interactive-node-network

   # Install dependencies
   npm install

   # Run environment check
   npm run check-env
   ```

2. **Verify Your Environment**
   ```bash
   # Check your machine configuration
   npm run verify-machine
   ```

## 📚 Documentation Guide

Our documentation is structured to guide you from setup to advanced topics. Here's how to navigate it:

### 1. Getting Started
1. [Quick Start Guide](./docs/quick-start.md) - Begin here for initial setup
2. [Machine Management](./docs/machine-management.md) - Configure your development environment
3. [Documentation Structure](./docs/documentation-structure.md) - Understand how our docs are organized
4. [Documentation Relationships](./docs/diagrams/doc-relationships.md) - Visual guide to documentation

### 2. Core Documentation
All core documentation is in the `docs/` directory:
- [Documentation Overview](./docs/documentation-overview.md) - Complete documentation index
- [Documentation Structure](./docs/documentation-structure.md) - Understand how our docs are organized
- [Documentation Relationships](./docs/diagrams/doc-relationships.md) - Visual guide to documentation
- [Project Structure](./docs/diagrams/project-structure.md) - Visual guide to codebase organization

> **Related Standards**: See [Documentation Standards](./CONTRIBUTING.md#documentation-standards) in CONTRIBUTING.md for writing guidelines.

### 3. Guides and Technical Documentation
- [Coach's Guide](./docs/guides/coach-michael-stolarz-guide.md) - Project overview and educational aspects
- [Permissions Guide](./docs/guides/permissions-guide.md) - Access and security rules
- [Cursor Instructions](./docs/guides/cursor-setup.md) - AI interaction guidelines
- [Network Summary](./docs/technical/node-network-summary.md) - Technical implementation details

### 4. Learning and Development
- [Learning Overview](./docs/learning/README.md) - Educational resources index
- [Advanced Automation](./docs/learning/advanced-automation.md) - Advanced automation features
- [Documentation Automation](./docs/learning/documentation-automation.md) - Documentation management
- [Learning Journal](./docs/learning/learning-journal.md) - Progress tracking

### 5. Performance and Monitoring
- [Performance Overview](./docs/performance/README.md) - Performance metrics and standards
- [Monitoring Guide](./docs/performance/monitoring.md) - System monitoring

## 🔧 Key Features

- **Machine Configuration Management**
  - Automated environment setup
  - Cross-machine synchronization
  - Configuration verification

- **Documentation Automation**
  - Automated documentation updates
  - Learning capture system
  - Session management
  - Diagram generation

- **Development Tools**
  - Performance monitoring
  - Error handling
  - Testing framework
  - Development utilities

## 📋 Project Structure

```
/
├── docs/                    # Documentation root
│   ├── README.md           # Documentation index
│   ├── documentation-overview.md # Complete documentation reference
│   ├── quick-start.md      # Getting started guide
│   ├── machine-management.md # Environment setup
│   ├── documentation-structure.md # Documentation organization
│   ├── diagrams/          # Visual documentation
│   │   └── documentation-relationships.md # Doc connections
│   └── ...                # Other documentation
├── scripts/                # Automation scripts
│   ├── setup-machine.ts    # Machine setup
│   └── ...                # Other scripts
├── src/                    # Source code
├── SESSIONS.md            # Active session tracking
└── README.md             # This file
```

## 🛠 Available Commands

### Environment Setup
```bash
npm run check-env          # Check environment
npm run setup-machine      # Setup development environment
npm run verify-machine     # Verify configuration
```

### Documentation
```bash
npm run docs:check         # Check documentation health
npm run docs:learn         # Add learning entry
npm run docs:session       # Manage development session
npm run generate-diagrams  # Update documentation diagrams
```

## 🤝 Contributing

1. Start with our [Quick Start Guide](./docs/quick-start.md)
2. Review [Machine Management](./docs/machine-management.md)
3. Follow [Session Management](./docs/sessions/README.md)
4. Document learnings and decisions

## 🆘 Getting Help

1. **Check Common Issues**
   - See [Troubleshooting Guide](./docs/reference/troubleshooting.md)
   - Review [Error Documentation](./docs/errors/README.md)

2. **Performance Issues**
   - See [Performance Standards](./RULES.md#performance-standards)
   - Check [Monitoring Guide](./docs/performance/monitoring.md)

3. **Development Questions**
   - See [Development Guide](./docs/guides/development-guide.md)
   - Review [Architecture Documentation](./docs/technical/architecture.md)

## 📝 Best Practices

1. **Always Start Sessions**
   ```bash
   npm run docs:session start
   ```
   > See [Session Template](./docs/sessions/TEMPLATE.md) for documentation format

2. **Document Learnings**
   ```bash
   npm run docs:learn
   ```
   > See [Learning Journal](./docs/learning/learning-journal.md) for progress tracking

3. **Verify Environment**
   ```bash
   npm run verify-machine
   ```
   > See [Machine Management](./docs/machine-management.md) for setup details

## 🔄 Regular Maintenance

1. **Documentation Health**
   ```bash
   npm run docs:check
   ```
   > See [Documentation Automation](./docs/learning/documentation-automation.md) for maintenance tools

2. **Update Diagrams**
   ```bash
   npm run generate-diagrams
   ```
   > See [Documentation Relationships](./docs/diagrams/documentation-relationships.md) for diagram structure

Remember: This documentation system is designed to evolve. If you find areas for improvement, follow our [Contributing Guidelines](./CONTRIBUTING.md) to help make it better.

## 📊 Project Status

- [Active Sessions](./SESSIONS.md)
- [Recent Changes](./docs/learning/learning-journal.md)
- [Known Issues](./docs/errors/README.md)

---

For a complete overview of our documentation:
1. Start with the [Documentation Overview](./docs/documentation-overview.md)
2. View the [Documentation Structure Guide](./docs/documentation-structure.md)
3. Check the [Documentation Relationships](./docs/diagrams/documentation-relationships.md)

This guide will help you get started with the Interactive Node Network project quickly and efficiently.

## Prerequisites

- Node.js (v23.10.0 or later)
- npm (v10.9.2 or later)
- Git
- A modern web browser
- Code editor (VS Code recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/interactive-node-network.git
   cd interactive-node-network
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

## Development Server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173/interactive-node-network/
   ```

## Basic Usage

### Project Structure
```
/
├── src/               # Source code
├── public/            # Static assets
├── docs/             # Documentation
├── tests/            # Test files
└── scripts/          # Utility scripts
```

### Key Commands
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run test          # Run tests
npm run docs:serve    # Serve documentation
npm run lint         # Lint code
```

## Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push changes and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Documentation

- [Project Documentation](./README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Machine Management](./machine-management.md)
- [Documentation Structure](./documentation-structure.md)

## Common Tasks

### Adding a New Node
1. Create node component in `src/components/`
2. Register node in `src/nodes/index.ts`
3. Add node documentation
4. Test node functionality

### Modifying Network Behavior
1. Update network configuration in `src/config/`
2. Modify network handlers in `src/handlers/`
3. Test changes
4. Update documentation

## Troubleshooting

### Common Issues
1. **Server won't start**
   - Check Node.js version
   - Verify port availability
   - Check environment variables

2. **Build errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`

3. **Network errors**
   - Check network configuration
   - Verify node connections
   - Review error logs

## Next Steps

1. Review [Documentation Structure](./documentation-structure.md)
2. Explore [Machine Management](./machine-management.md)
3. Read [Contributing Guidelines](./CONTRIBUTING.md)
4. Join the development community

## Support

- Create an issue in the repository
- Check existing documentation
- Contact the development team

## Related Documentation

- [Project Standards](./project-standards.md)
- [Error Handling](./docs/errors/README.md)
- [Performance Guide](./docs/performance/README.md)
- [Learning System](./docs/learning/README.md)

This document outlines the standards and guidelines for the Interactive Node Network project.

## Code Standards

### TypeScript
- Use TypeScript for all new code
- Enable strict mode in tsconfig.json
- Document all public interfaces and functions
- Use type inference where possible
- Avoid `any` type unless absolutely necessary

### React
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript props interfaces
- Follow React best practices for performance
- Implement proper error boundaries

### File Structure
- Use consistent naming conventions
- Organize by feature/module
- Keep related files together
- Use index files for exports
- Follow clean architecture principles

## Documentation Standards

### Code Documentation
- Document all public APIs
- Use JSDoc format
- Include examples where helpful
- Keep documentation up to date
- Document complex algorithms

### Project Documentation
- Keep README files current
- Document setup procedures
- Include troubleshooting guides
- Maintain changelog
- Document architecture decisions

## Testing Standards

### Unit Tests
- Write tests for all new features
- Maintain high test coverage
- Use meaningful test descriptions
- Follow arrange-act-assert pattern
- Mock external dependencies

### Integration Tests
- Test component integration
- Verify system boundaries
- Test error conditions
- Use realistic test data
- Document test scenarios

## Performance Standards

### Code Performance
- Optimize critical paths
- Use performance profiling
- Follow React performance best practices
- Implement proper caching
- Monitor memory usage

### Build Performance
- Optimize build configuration
- Use code splitting
- Implement tree shaking
- Minimize bundle size
- Use efficient dependencies

## Security Standards

### Code Security
- Follow security best practices
- Validate all inputs
- Sanitize outputs
- Use proper authentication
- Implement authorization

### Data Security
- Protect sensitive data
- Use secure protocols
- Implement proper encryption
- Follow data privacy laws
- Regular security audits

## Development Process

### Version Control
- Use meaningful commit messages
- Follow branching strategy
- Review all code changes
- Keep main branch stable
- Tag releases properly

### Code Review
- Review all changes
- Use pull requests
- Follow review checklist
- Provide constructive feedback
- Address review comments

## Maintenance Standards

### Code Maintenance
- Regular dependency updates
- Remove unused code
- Fix technical debt
- Update documentation
- Monitor deprecations

### System Maintenance
- Regular backups
- System monitoring
- Performance tracking
- Error logging
- Health checks

## Related Documentation

- [Development Workflow](./development-workflow.md)
- [Quick Start Guide](./quick-start.md)
- [Error Handling](./docs/errors/README.md)
- [Performance Guidelines](./docs/performance/README.md)

# Development Sessions

This directory contains detailed records of development sessions, including accomplishments, technical decisions, and progress tracking.

## Document Overview

### Root Level Documents
- `README.md` - Project overview, quick start, and main documentation index
- `CONTRIBUTING.md` - Development guidelines and documentation standards
- `RULES.md` - Core development rules and guidelines
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration

### Documentation Directory (`docs/`)
#### Core Documentation
- `docs/README.md` - Documentation system overview
- `docs/quick-start.md` - Getting started guide
- `docs/documentation-structure.md` - Documentation organization guide
- `docs/machine-management.md` - Environment setup guide

#### Guides (`docs/guides/`)
- `docs/guides/coach-michael-stolarz-guide.md` - Project overview and educational aspects
- `docs/guides/permissions-guide.md` - Access and security rules
- `docs/guides/cursor-setup.md` - AI interaction guidelines
- `docs/guides/development-guide.md` - Development workflow and standards

#### Technical Documentation (`docs/technical/`)
- `docs/technical/architecture.md` - System architecture and design decisions
- `docs/technical/node-network-summary.md` - Network implementation details
- `docs/technical/maintenance.md` - System maintenance procedures
- `docs/technical/performance.md` - Performance optimization guide

#### Learning Resources (`docs/learning/`)
- `docs/learning/README.md` - Learning resources index
- `docs/learning/learning-journal.md` - Progress tracking and learnings
- `docs/learning/advanced-automation.md` - Advanced automation features
- `docs/learning/documentation-automation.md` - Documentation management

#### Performance (`docs/performance/`)
- `docs/performance/README.md` - Performance metrics and standards
- `docs/performance/monitoring.md` - System monitoring guide
- `docs/performance/optimization.md` - Performance optimization techniques

#### Reference (`docs/reference/`)
- `docs/reference/troubleshooting.md` - Common issues and solutions
- `docs/reference/api.md` - API documentation
- `docs/reference/glossary.md` - Project terminology

#### Sessions (`docs/sessions/`)
- `docs/sessions/README.md` - Session history and tracking
- `docs/sessions/TEMPLATE.md` - Session documentation template

#### Diagrams (`docs/diagrams/`)
- `docs/diagrams/project-structure.md` - Visual project organization
- `docs/diagrams/doc-relationships.md` - Documentation connections
- `docs/diagrams/architecture.md` - System architecture diagrams

### Scripts (`scripts/`)
#### Documentation (`scripts/docs/`)
- `scripts/docs/link-checker.ts` - Link validation tool
- `scripts/docs/link-fixer.ts` - Automated link fixing
- `scripts/docs/coverage.ts` - Documentation coverage checker
- `scripts/docs/diagrams.ts` - Diagram generation
- `scripts/docs/reorganize.ts` - Documentation reorganization

#### Environment (`scripts/`)
- `scripts/setup-machine.ts` - Machine setup automation
- `scripts/check-environment.ts` - Environment verification
- `scripts/init-machine-management.ts` - Machine management initialization
- `scripts/fix-links.ts` - Link fixing utility

#### Tests (`scripts/tests/`)
- `scripts/tests/test-machine-detection.ts` - Machine detection tests

### Source Code (`src/`)
- `src/` - Main application source code
- `src/components/` - React components
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions
- `src/styles/` - CSS and styling files

### Configuration Files
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration

### Build Output
- `dist/` - Production build output
- `coverage/` - Test coverage reports
- `docs/diagrams/` - Generated documentation diagrams
