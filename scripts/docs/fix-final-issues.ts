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

function createEnvExample() {
  const content = `# Environment Variables

This file contains example environment variables for the project.

## Required Variables
- \`NODE_ENV\`: The environment (development, production, test)
- \`PORT\`: The port number for the server
- \`DATABASE_URL\`: The URL for the database connection

## Optional Variables
- \`LOG_LEVEL\`: The level of logging (debug, info, warn, error)
- \`API_KEY\`: The API key for external services

## Development Variables
- \`DEBUG\`: Enable debug mode
- \`TEST_DATABASE_URL\`: The URL for the test database

## Production Variables
- \`SSL_ENABLED\`: Enable SSL/TLS
- \`CORS_ORIGIN\`: Allowed CORS origins
`;

  fs.writeFileSync('.env.example', content);
  console.log('Created .env.example file');
}

function fixReadmePaths() {
  const readmePath = 'README.md';
  if (fs.existsSync(readmePath)) {
    let content = fs.readFileSync(readmePath, 'utf8');
    
    // Fix CONTRIBUTING.md links
    content = content.replace(/\.\.\/CONTRIBUTING\.md/g, './CONTRIBUTING.md');
    
    fs.writeFileSync(readmePath, content);
    console.log('Fixed paths in README.md');
  }
}

function fixDocumentationOverview() {
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

async function fixFinalIssues() {
  // Create documentation overview file
  createPlaceholderFile('documentation-overview.md', 'Documentation Overview');

  // Create learning journal file
  createPlaceholderFile('docs/learning/learning-journal.md', 'Learning Journal');

  // Create .env.example file
  createEnvExample();

  // Fix paths in README.md
  fixReadmePaths();

  // Fix paths in documentation overview
  fixDocumentationOverview();
}

fixFinalIssues().catch(console.error); 