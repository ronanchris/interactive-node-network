import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

function createContributingGuide() {
  const content = `# Contributing Guidelines

This document outlines the standards and processes for contributing to the Interactive Node Network project.

## Documentation Standards

All documentation should follow these standards:
- Use Markdown format
- Include a clear title and description
- Link to related documentation
- Keep content focused and organized
- Use proper relative paths
- Include code examples where relevant

## Development Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

## Code Standards

- Follow TypeScript best practices
- Write clean, readable code
- Include comprehensive tests
- Document complex logic
- Follow the project's style guide

## Related Documentation
- [Project Standards](./project-standards.md)
- [Development Workflow](./development-workflow.md)
- [Documentation Overview](./documentation-overview.md)
`;

  fs.writeFileSync('CONTRIBUTING.md', content);
  console.log('Created CONTRIBUTING.md');
}

function createProjectStandards() {
  const content = `# Project Standards

This document defines the standards and best practices for the Interactive Node Network project.

## Code Standards

- TypeScript for all new code
- React for UI components
- Jest for testing
- ESLint for code quality
- Prettier for code formatting

## Documentation Standards

- Markdown for all documentation
- Clear file organization
- Consistent formatting
- Regular updates
- Comprehensive coverage

## Development Standards

- Test-driven development
- Code review process
- Documentation updates
- Performance considerations
- Security best practices

## Related Documentation
- [Contributing Guide](./CONTRIBUTING.md)
- [Development Workflow](./development-workflow.md)
- [Documentation Overview](./documentation-overview.md)
`;

  fs.writeFileSync('project-standards.md', content);
  console.log('Created project-standards.md');
}

function createDevelopmentWorkflow() {
  const content = `# Development Workflow

This document outlines the development workflow for the Interactive Node Network project.

## Setup

1. Clone the repository
2. Install dependencies
3. Configure environment
4. Run initial tests

## Development Process

1. Create feature branch
2. Write tests
3. Implement changes
4. Update documentation
5. Submit pull request

## Testing

- Unit tests with Jest
- Integration tests
- End-to-end tests
- Performance testing
- Security testing

## Related Documentation
- [Contributing Guide](./CONTRIBUTING.md)
- [Project Standards](./project-standards.md)
- [Documentation Overview](./documentation-overview.md)
`;

  fs.writeFileSync('development-workflow.md', content);
  console.log('Created development-workflow.md');
}

function createDocumentationBestPractices() {
  const content = `# Documentation Best Practices

This guide outlines best practices for documentation in the Interactive Node Network project.

## General Guidelines

- Write clear, concise content
- Use proper Markdown formatting
- Include relevant examples
- Keep documentation up-to-date
- Link to related documents

## File Organization

- Group related documents
- Use consistent naming
- Maintain clear hierarchy
- Include README files
- Follow project structure

## Content Standards

- Clear titles and headings
- Comprehensive coverage
- Code examples where needed
- Regular updates
- Version control

## Related Documentation
- [Contributing Guide](./CONTRIBUTING.md)
- [Project Standards](./project-standards.md)
- [Documentation Overview](./documentation-overview.md)
`;

  fs.writeFileSync('docs/documentation-best-practices.md', content);
  console.log('Created documentation-best-practices.md');
}

function fixDocumentationOverview() {
  const content = fs.readFileSync('documentation-overview.md', 'utf8');
  
  // Remove .md extension from source code directory links
  const updatedContent = content
    .replace(/\.\.\/src\/([^)]+)\.md/g, '../src/$1')
    .replace(/\.\.\/dist\/([^)]+)\.md/g, '../dist/$1')
    .replace(/\.\.\/coverage\/([^)]+)\.md/g, '../coverage/$1')
    .replace(/\.\.\/(\.env\.example)\.md/g, '../$1')
    .replace(/\.\.\/(\.eslintrc\.json)\.md/g, '../$1')
    .replace(/\.\.\/(\.prettierrc)\.md/g, '../$1');
  
  fs.writeFileSync('documentation-overview.md', updatedContent);
  console.log('Fixed paths in documentation-overview.md');
}

async function fixCoreDocs() {
  // Create core documentation files
  createContributingGuide();
  createProjectStandards();
  createDevelopmentWorkflow();
  createDocumentationBestPractices();

  // Fix paths in documentation overview
  fixDocumentationOverview();
}

fixCoreDocs().catch(console.error); 