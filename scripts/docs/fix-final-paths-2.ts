import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

function fixFinalPaths(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dirName = path.dirname(filePath);
  let updatedContent = content;

  // Fix paths with missing dots
  updatedContent = updatedContent.replace(/`\.\.([^.])/g, '`../$1');

  // Fix paths with too many dots
  updatedContent = updatedContent.replace(/`\.{3,}\//g, '`../');

  // Fix paths to CONTRIBUTING.md
  if (filePath.startsWith('docs/')) {
    updatedContent = updatedContent.replace(/`\.\.\/CONTRIBUTING\.md#/g, '`../CONTRIBUTING.md#');
    updatedContent = updatedContent.replace(/`\.\.\/CONTRIBUTING\.md`/g, '`../CONTRIBUTING.md`');
  }

  // Fix paths to README files
  if (filePath.startsWith('docs/')) {
    const readmeFiles = [
      'learning/README.md',
      'performance/README.md',
      'errors/README.md'
    ];

    for (const file of readmeFiles) {
      // Calculate the correct relative path
      const relativePath = path.relative(dirName, path.join('docs', file));
      updatedContent = updatedContent.replace(new RegExp(`\`\\.{3,}/${file}\``, 'g'), `\`${relativePath}\``);
      updatedContent = updatedContent.replace(new RegExp(`\`\\.{2}${file}\``, 'g'), `\`${relativePath}\``);
      updatedContent = updatedContent.replace(new RegExp(`\`\\.\\.${file}\``, 'g'), `\`${relativePath}\``);
    }
  }

  // Fix paths to other common files
  if (filePath.startsWith('docs/')) {
    const commonFiles = [
      'glossary.md',
      'session-management.md',
      'monitoring.md',
      'logging.md',
      'validation.md',
      'testing.md',
      'backup.md',
      'recovery-testing.md'
    ];

    for (const file of commonFiles) {
      // Calculate the correct relative path
      const relativePath = path.relative(dirName, path.join('docs', file));
      updatedContent = updatedContent.replace(new RegExp(`\`\\.{3,}/${file}\``, 'g'), `\`${relativePath}\``);
      updatedContent = updatedContent.replace(new RegExp(`\`\\.{2}${file}\``, 'g'), `\`${relativePath}\``);
      updatedContent = updatedContent.replace(new RegExp(`\`\\.\\.${file}\``, 'g'), `\`${relativePath}\``);
      updatedContent = updatedContent.replace(new RegExp(`\`\\./${file}\``, 'g'), `\`${relativePath}\``);
    }
  }

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Fixed paths in: ${filePath}`);
  }
}

async function main() {
  const files = await glob('**/*.md', { ignore: ['node_modules/**'] });
  
  for (const file of files) {
    fixFinalPaths(file);
  }
}

main().catch(console.error); 