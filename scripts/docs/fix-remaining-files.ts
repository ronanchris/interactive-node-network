import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

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

async function fixRemainingFiles() {
  // Create missing root-level files
  const rootFiles = [
    { path: 'RULES.md', title: 'Project Rules' },
    { path: 'SESSIONS.md', title: 'Project Sessions' },
    { path: 'CONTRIBUTING.md', title: 'Contributing Guidelines' },
    { path: 'machine-management.md', title: 'Machine Management' },
    { path: 'documentation-structure.md', title: 'Documentation Structure' },
    { path: 'project-standards.md', title: 'Project Standards' },
    { path: 'development-workflow.md', title: 'Development Workflow' },
    { path: 'quick-start.md', title: 'Quick Start Guide' },
    { path: 'glossary.md', title: 'Glossary' }
  ];

  for (const file of rootFiles) {
    createPlaceholderFile(file.path, file.title);
  }

  // Create missing guide files
  const guideFiles = [
    { path: 'docs/guides/learning-journal.md', title: 'Learning Journal' },
    { path: 'docs/guides/educational-support.md', title: 'Educational Support' },
    { path: 'docs/guides/documentation-best-practices.md', title: 'Documentation Best Practices' },
    { path: 'docs/guides/advanced-automation.md', title: 'Advanced Automation' },
    { path: 'docs/guides/documentation-automation.md', title: 'Documentation Automation' },
    { path: 'docs/guides/ai-interaction-patterns.md', title: 'AI Interaction Patterns' }
  ];

  for (const file of guideFiles) {
    createPlaceholderFile(file.path, file.title);
  }

  // Create missing performance and error files
  const performanceFiles = [
    { path: 'docs/performance/monitoring.md', title: 'Performance Monitoring' }
  ];

  for (const file of performanceFiles) {
    createPlaceholderFile(file.path, file.title);
  }

  // Fix paths in documentation overview
  const overviewPath = 'docs/documentation-overview.md';
  if (fs.existsSync(overviewPath)) {
    let content = fs.readFileSync(overviewPath, 'utf8');
    
    // Fix .env.example link
    content = content.replace(/\.\.\/\.env\.example/g, '../.env.example');
    
    // Fix diagrams directory link
    content = content.replace(/\.\/diagrams\//g, './diagrams/');
    
    fs.writeFileSync(overviewPath, content);
    console.log('Fixed paths in documentation overview');
  }
}

fixRemainingFiles().catch(console.error); 