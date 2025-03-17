/// <reference types="node" />
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

async function createPlaceholderFile(filePath: string, title: string) {
  const content = `# ${title}

This document is a placeholder and will be updated with proper content.

## Overview

This document will contain information about ${title.toLowerCase()}.

## Related Documentation

- [Documentation Overview](../documentation-overview.md)
- [Project Standards](../project-standards.md)
- [Development Guide](../development-workflow.md)

## Updates

This document is regularly updated to reflect:
- New features
- Best practices
- Process changes
- Team feedback
- System improvements

For more information on documentation standards, see [Documentation Standards](../CONTRIBUTING.md#documentation-standards).
`;

  // Create directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  console.log(`Created placeholder file: ${filePath}`);
}

async function fixMissingFiles() {
  // List of missing files to create
  const missingFiles = [
    {
      path: 'docs/diagrams/doc-relationships.md',
      title: 'Documentation Relationships'
    },
    {
      path: 'docs/diagrams/project-structure.md',
      title: 'Project Structure'
    },
    {
      path: 'docs/diagrams/architecture.md',
      title: 'System Architecture'
    },
    {
      path: 'docs/technical/node-network-summary.md',
      title: 'Node Network Summary'
    },
    {
      path: 'docs/technical/thresholds.md',
      title: 'Performance Thresholds'
    },
    {
      path: 'docs/technical/optimization.md',
      title: 'Performance Optimization'
    },
    {
      path: 'docs/reference/common-issues.md',
      title: 'Common Issues'
    },
    {
      path: 'docs/reference/detection.md',
      title: 'Issue Detection'
    },
    {
      path: 'docs/reference/recovery.md',
      title: 'Issue Recovery'
    },
    {
      path: 'docs/reference/prevention.md',
      title: 'Issue Prevention'
    },
    {
      path: 'docs/performance/README.md',
      title: 'Performance Documentation'
    },
    {
      path: 'docs/errors/README.md',
      title: 'Error Documentation'
    },
    {
      path: 'docs/learning/README.md',
      title: 'Learning Resources'
    }
  ];

  // Create placeholder files
  for (const file of missingFiles) {
    await createPlaceholderFile(file.path, file.title);
  }

  // Fix documentation overview
  const overviewPath = 'docs/documentation-overview.md';
  if (fs.existsSync(overviewPath)) {
    let content = fs.readFileSync(overviewPath, 'utf-8');
    
    // Fix incorrect paths
    content = content
      .replace(/\.\/diagrams\/documentation-relationships\.md\.md/g, './diagrams/doc-relationships.md')
      .replace(/\.\/diagrams\/project-structure\.md\.md/g, './diagrams/project-structure.md')
      .replace(/\.\/diagrams\/architecture\.md\.md/g, './diagrams/architecture.md')
      .replace(/\.\/technical\/architecture\.md\.md/g, './technical/architecture.md')
      .replace(/\.\/technical\/node-network-summary\.md\.md/g, './technical/node-network-summary.md')
      .replace(/\.\/technical\/maintenance\.md\.md/g, './technical/maintenance.md')
      .replace(/\.\/technical\/performance\.md\.md/g, './technical/performance.md')
      .replace(/\.\/diagrams\/\.md\.md/g, './diagrams/')
      .replace(/\.\.\/\.env\.example\.md/g, '../.env.example')
      .replace(/\.\.\/\.gitignore\.md/g, '../.gitignore')
      .replace(/\.\.\/\.prettierrc\.md/g, '../.prettierrc');

    fs.writeFileSync(overviewPath, content);
    console.log('Fixed paths in documentation overview');
  }
}

fixMissingFiles().catch(console.error); 