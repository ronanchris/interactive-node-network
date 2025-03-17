import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

function fixRelativePaths(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dirName = path.dirname(filePath);
  let updatedContent = content;

  // Fix paths to CONTRIBUTING.md
  if (filePath.startsWith('docs/')) {
    // For files in docs/ directory, use ../CONTRIBUTING.md
    updatedContent = updatedContent.replace(/\.\/CONTRIBUTING\.md/g, '../CONTRIBUTING.md');
    updatedContent = updatedContent.replace(/\.\.\/\.\.\/CONTRIBUTING\.md/g, '../CONTRIBUTING.md');
  }

  // Fix paths to project-standards.md and development-workflow.md
  if (filePath.startsWith('docs/')) {
    // For files in docs/ directory, use ../project-standards.md and ../development-workflow.md
    updatedContent = updatedContent.replace(/\.\/project-standards\.md/g, '../project-standards.md');
    updatedContent = updatedContent.replace(/\.\/development-workflow\.md/g, '../development-workflow.md');
  }

  // Fix paths to RULES.md
  if (filePath.startsWith('docs/')) {
    // For files in docs/ directory, use ../RULES.md
    updatedContent = updatedContent.replace(/\.\/RULES\.md/g, '../RULES.md');
  }

  // Fix paths to README files in subdirectories
  if (filePath === 'README.md') {
    // For root README.md, use ./docs/errors/README.md, etc.
    updatedContent = updatedContent.replace(/\.\/errors\/README\.md/g, './docs/errors/README.md');
    updatedContent = updatedContent.replace(/\.\/performance\/README\.md/g, './docs/performance/README.md');
    updatedContent = updatedContent.replace(/\.\/learning\/README\.md/g, './docs/learning/README.md');
  } else if (filePath.startsWith('docs/')) {
    // For files in docs/ directory, use relative paths to README files
    const relativePath = path.relative(dirName, 'docs');
    updatedContent = updatedContent.replace(/\.\/errors\/README\.md/g, `${relativePath}/errors/README.md`);
    updatedContent = updatedContent.replace(/\.\/performance\/README\.md/g, `${relativePath}/performance/README.md`);
    updatedContent = updatedContent.replace(/\.\/learning\/README\.md/g, `${relativePath}/learning/README.md`);
  }

  // Fix paths to learning-journal.md
  if (filePath.startsWith('docs/')) {
    // For files in docs/ directory, use relative path to learning-journal.md
    const relativePath = path.relative(dirName, 'docs/learning');
    updatedContent = updatedContent.replace(/\.\/learning\/learning-journal\.md/g, `${relativePath}/learning-journal.md`);
  }

  // Fix paths to performance/monitoring.md
  if (filePath.startsWith('docs/')) {
    // For files in docs/ directory, use relative path to performance/monitoring.md
    const relativePath = path.relative(dirName, 'docs/performance');
    updatedContent = updatedContent.replace(/\.\/performance\/monitoring\.md/g, `${relativePath}/monitoring.md`);
  }

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Fixed paths in: ${filePath}`);
  }
}

async function fixAllRelativePaths() {
  const files = await glob('**/*.md', { ignore: ['node_modules/**'] });
  
  for (const file of files) {
    fixRelativePaths(file);
  }
}

fixAllRelativePaths().catch(console.error); 