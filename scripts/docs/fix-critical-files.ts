import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

function createPlaceholderFile(filePath: string, title: string) {
  const content = `# ${title}

This is a placeholder file for ${title}. Content will be added as needed.

## Related Documentation
- [Project Standards](../project-standards.md)
- [Development Workflow](../development-workflow.md)
- [Documentation Overview](../documentation-overview.md)

## Updates
This document will be updated as needed to reflect:
- New features and functionality
- Best practices
- Security updates
- Performance improvements
`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log(`Created placeholder file: ${filePath}`);
}

function createRules() {
  const content = `# Project Rules

This document outlines the rules and guidelines for the Interactive Node Network project.

## Code Rules

- Follow TypeScript best practices
- Write clean, readable code
- Include comprehensive tests
- Document complex logic
- Follow the project's style guide

## Documentation Rules

- Use Markdown format
- Include clear titles and descriptions
- Link to related documentation
- Keep content focused and organized
- Use proper relative paths

## Development Rules

- Follow the development workflow
- Write tests before code
- Update documentation
- Review code thoroughly
- Follow security guidelines

## Related Documentation
- [Contributing Guide](./CONTRIBUTING.md)
- [Project Standards](./project-standards.md)
- [Documentation Overview](./documentation-overview.md)
`;

  fs.writeFileSync('RULES.md', content);
  console.log('Created RULES.md');
}

function createSessionManagement() {
  const content = `# Session Management

This document outlines the session management system for the Interactive Node Network.

## Overview

The session management system handles:
- User sessions
- Connection state
- Resource allocation
- Performance monitoring
- Error handling

## Components

- Session creation
- Session validation
- Session cleanup
- Resource management
- Error recovery

## Best Practices

- Regular monitoring
- Performance optimization
- Security measures
- Error handling
- Resource cleanup

## Related Documentation
- [Project Standards](../project-standards.md)
- [Development Workflow](../development-workflow.md)
- [Documentation Overview](../documentation-overview.md)
`;

  fs.writeFileSync('docs/session-management.md', content);
  console.log('Created session-management.md');
}

function createLearningJournal() {
  const content = `# Learning Journal

This document tracks learning experiences and insights from the Interactive Node Network project.

## Purpose

- Document learning experiences
- Track progress
- Share insights
- Improve processes
- Guide future development

## Categories

- Technical insights
- Process improvements
- Best practices
- Common issues
- Solutions found

## Best Practices

- Regular updates
- Clear documentation
- Shared learning
- Continuous improvement
- Knowledge sharing

## Related Documentation
- [Project Standards](../project-standards.md)
- [Development Workflow](../development-workflow.md)
- [Documentation Overview](../documentation-overview.md)
`;

  fs.writeFileSync('docs/learning/learning-journal.md', content);
  console.log('Created learning-journal.md');
}

function fixDocumentationOverviewPaths() {
  const content = fs.readFileSync('documentation-overview.md', 'utf8');
  
  // Fix relative paths
  const updatedContent = content.replace(/\.\.\/(project-standards|development-workflow|documentation-overview)\.md/g, './$1.md');
  
  fs.writeFileSync('documentation-overview.md', updatedContent);
  console.log('Fixed paths in documentation-overview.md');
}

async function fixCriticalFiles() {
  // Create missing README files
  const readmeFiles = [
    { path: 'docs/errors/README.md', title: 'Error Documentation' },
    { path: 'docs/performance/README.md', title: 'Performance Documentation' },
    { path: 'docs/learning/README.md', title: 'Learning Documentation' }
  ];

  for (const file of readmeFiles) {
    createPlaceholderFile(file.path, file.title);
  }

  // Create missing core files
  createRules();
  createSessionManagement();
  createLearningJournal();

  // Fix paths in documentation overview
  fixDocumentationOverviewPaths();
}

fixCriticalFiles().catch(console.error); 