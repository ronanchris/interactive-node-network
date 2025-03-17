import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

function fixEllipsisPaths(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dirName = path.dirname(filePath);
  let updatedContent = content;

  // Replace .../ with ../ for relative paths
  updatedContent = updatedContent.replace(/\.\.\.\//g, '../');

  // Replace ../.../CONTRIBUTING.md with ../CONTRIBUTING.md
  updatedContent = updatedContent.replace(/\.\.\/\.\.\.\/CONTRIBUTING\.md/g, '../CONTRIBUTING.md');

  // Fix absolute paths starting with /
  if (filePath.startsWith('docs/')) {
    updatedContent = updatedContent.replace(/\/learning\/README\.md/g, '../learning/README.md');
    updatedContent = updatedContent.replace(/\/performance\/README\.md/g, '../performance/README.md');
    updatedContent = updatedContent.replace(/\/errors\/README\.md/g, '../errors/README.md');
  }

  // Fix paths to common files
  if (filePath.startsWith('docs/')) {
    const commonFiles = [
      'project-standards.md',
      'development-workflow.md',
      'CONTRIBUTING.md',
      'RULES.md',
      'learning/learning-journal.md',
      'performance/monitoring.md',
      'errors/README.md',
      'glossary.md',
      'documentation-best-practices.md'
    ];

    for (const file of commonFiles) {
      // Replace .../file.md with ../file.md
      updatedContent = updatedContent.replace(new RegExp(`\\.\\.\\./${file}`, 'g'), `../${file}`);
      // Replace .../CONTRIBUTING.md#documentation-standards with ../CONTRIBUTING.md#documentation-standards
      updatedContent = updatedContent.replace(/\.\.\.\/CONTRIBUTING\.md#/g, '../CONTRIBUTING.md#');
    }
  }

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Fixed paths in: ${filePath}`);
  }
}

async function fixAllEllipsisPaths() {
  const files = await glob('**/*.md', { ignore: ['node_modules/**'] });
  
  for (const file of files) {
    fixEllipsisPaths(file);
  }
}

fixAllEllipsisPaths().catch(console.error); 