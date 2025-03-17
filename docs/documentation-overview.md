# Documentation Overview

> **Last Updated**: March 17, 2024
> 
> **Related Documents**:
> - [Documentation Structure](./documentation-structure.md) - How our documentation is organized
> - [Documentation Relationships](./diagrams/documentation-relationships.md) - Visual guide to documentation connections
> - [Documentation Standards](../../CONTRIBUTING.md#documentation-standards) - Writing and maintenance guidelines

This document provides a comprehensive overview of all documentation in the Interactive Node Network project. Each document is listed with its purpose and a link to the actual file.

## Quick Navigation

- [Getting Started](#getting-started)
- [Core Documentation](#core-documentation)
- [Guides](#guides)
- [Technical Documentation](#technical-documentation)
- [Learning Resources](#learning-resources)
- [Performance](#performance)
- [Reference](#reference)
- [Development](#development)
- [Scripts](#scripts)
- [Configuration](#configuration)

## Getting Started

### Root Level Documents
- [`README.md`](../../README.md) - Project overview, quick start, and main documentation index
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) - Development guidelines and documentation standards
- [`RULES.md`](../../RULES.md) - Core development rules and guidelines

### Quick Start Guides
- [`docs/quick-start.md`](./quick-start.md) - Step-by-step guide for initial setup
- [`docs/machine-management.md`](./machine-management.md) - Environment setup and configuration
- [`docs/documentation-structure.md`](./documentation-structure.md) - Understanding our documentation organization

## Core Documentation

### Documentation System
- [`docs/README.md`](./README.md) - Documentation system overview and index
- [`docs/documentation-overview.md`](./documentation-overview.md) - This document: comprehensive documentation reference
- [`docs/documentation-structure.md`](./documentation-structure.md) - How our documentation is organized
- [`docs/documentation-relationships.md`](./diagrams/documentation-relationships.md) - Visual guide to documentation connections

> **Related Standards**: See [Documentation Standards](../../CONTRIBUTING.md#documentation-standards) in CONTRIBUTING.md for writing guidelines.

### Project Structure
- [`docs/diagrams/project-structure.md`](./diagrams/project-structure.md) - Visual guide to codebase organization
- [`docs/diagrams/architecture.md`](./diagrams/architecture.md) - System architecture diagrams

## Guides

### User Guides
- [`docs/guides/coach-michael-stolarz-guide.md`](./guides/coach-michael-stolarz-guide.md) - Project overview and educational aspects
- [`docs/guides/permissions-guide.md`](./guides/permissions-guide.md) - Access and security rules
- [`docs/guides/cursor-setup.md`](./guides/cursor-setup.md) - AI interaction guidelines
- [`docs/guides/development-guide.md`](./guides/development-guide.md) - Development workflow and standards

> **Related Standards**: See [Development Process](../../RULES.md#development-process) in RULES.md for workflow guidelines.

## Technical Documentation

### Architecture and Design
- [`docs/technical/architecture.md`](./technical/architecture.md) - System architecture and design decisions
- [`docs/technical/node-network-summary.md`](./technical/node-network-summary.md) - Network implementation details
- [`docs/technical/maintenance.md`](./technical/maintenance.md) - System maintenance procedures
- [`docs/technical/performance.md`](./technical/performance.md) - Performance optimization guide

> **Related Standards**: See [Performance Standards](../../RULES.md#performance-standards) in RULES.md for optimization guidelines.

## Learning Resources

### Educational Content
- [`docs/learning/README.md`](./learning/README.md) - Learning resources index
- [`docs/learning/learning-journal.md`](./learning/learning-journal.md) - Progress tracking and learnings
- [`docs/learning/advanced-automation.md`](./learning/advanced-automation.md) - Advanced automation features
- [`docs/learning/documentation-automation.md`](./learning/documentation-automation.md) - Documentation management

## Performance

### Performance Documentation
- [`docs/performance/README.md`](./performance/README.md) - Performance metrics and standards
- [`docs/performance/monitoring.md`](./performance/monitoring.md) - System monitoring guide
- [`docs/performance/optimization.md`](./performance/optimization.md) - Performance optimization techniques

> **Related Standards**: See [Performance Standards](../../RULES.md#performance-standards) in RULES.md for detailed metrics and thresholds.

## Reference

### Reference Materials
- [`docs/reference/troubleshooting.md`](./reference/troubleshooting.md) - Common issues and solutions
- [`docs/reference/api.md`](./reference/api.md) - API documentation
- [`docs/reference/glossary.md`](./reference/glossary.md) - Project terminology

## Development

### Session Management
- [`docs/sessions/README.md`](./sessions/README.md) - Session history and tracking
- [`docs/sessions/TEMPLATE.md`](./sessions/TEMPLATE.md) - Session documentation template

> **Related Resources**: 
> - See [Learning Journal](./learning/learning-journal.md) for progress tracking
> - See [Documentation Automation](./learning/documentation-automation.md) for automated session management

### Source Code
- [`src/`](../../src/) - Main application source code
  - [`src/components/`](../../src/components/) - React components
  - [`src/utils/`](../../src/utils/) - Utility functions
  - [`src/types/`](../../src/types/) - TypeScript type definitions
  - [`src/styles/`](../../src/styles/) - CSS and styling files

## Scripts

### Documentation Scripts
- [`scripts/docs/link-checker.ts`](../../scripts/docs/link-checker.ts) - Link validation tool
- [`scripts/docs/link-fixer.ts`](../../scripts/docs/link-fixer.ts) - Automated link fixing
- [`scripts/docs/coverage.ts`](../../scripts/docs/coverage.ts) - Documentation coverage checker
- [`scripts/docs/diagrams.ts`](../../scripts/docs/diagrams.ts) - Diagram generation
- [`scripts/docs/reorganize.ts`](../../scripts/docs/reorganize.ts) - Documentation reorganization

### Environment Scripts
- [`scripts/setup-machine.ts`](../../scripts/setup-machine.ts) - Machine setup automation
- [`scripts/check-environment.ts`](../../scripts/check-environment.ts) - Environment verification
- [`scripts/init-machine-management.ts`](../../scripts/init-machine-management.ts) - Machine management initialization
- [`scripts/fix-links.ts`](../../scripts/fix-links.ts) - Link fixing utility

### Test Scripts
- [`scripts/tests/test-machine-detection.ts`](../../scripts/tests/test-machine-detection.ts) - Machine detection tests

## Configuration

### Project Configuration
- [`package.json`](../../package.json) - Project dependencies and scripts
- [`tsconfig.json`](../../tsconfig.json) - TypeScript configuration
- [`vite.config.ts`](../../vite.config.ts) - Vite build configuration
- [`.env.example`](../../.env.example) - Environment variables template
- [`.gitignore`](../../.gitignore) - Git ignore rules
- [`.eslintrc.json`](../../.eslintrc.json) - ESLint configuration
- [`.prettierrc`](../../.prettierrc) - Prettier configuration

### Build Output
- [`dist/`](../../dist/) - Production build output
- [`coverage/`](../../coverage/) - Test coverage reports
- [`docs/diagrams/`](./diagrams/) - Generated documentation diagrams

## Document Relationships

For a visual representation of how these documents are connected, see:
- [`docs/diagrams/documentation-relationships.md`](./diagrams/documentation-relationships.md)
- [`docs/diagrams/project-structure.md`](./diagrams/project-structure.md)

## Maintenance

This overview is maintained as part of our documentation system. When adding new documents:
1. Add them to the appropriate section
2. Include a brief description
3. Add a link to the document
4. Update the quick navigation section if needed
5. Update the document relationships diagram

> **Related Standards**: See [Documentation Standards](../../CONTRIBUTING.md#documentation-standards) in CONTRIBUTING.md for maintenance guidelines. 