import { promises as fs } from 'fs';
import * as path from 'path';
import { glob } from 'glob';

async function fixRootFileLinks() {
  const files = await glob('**/*.md', {
    ignore: ['node_modules/**']
  });

  const rootToDocsMap = {
    'RULES.md': './docs/RULES.md',
    'SESSIONS.md': './docs/SESSIONS.md',
    '../RULES.md': './RULES.md',
    '../SESSIONS.md': './SESSIONS.md',
    '../../RULES.md': '../RULES.md',
    '../../SESSIONS.md': '../SESSIONS.md'
  };

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    let modified = false;
    let newContent = content;

    // Fix links to root files
    for (const [oldPath, newPath] of Object.entries(rootToDocsMap)) {
      const regex = new RegExp(`\\[([^\\]]+)\\]\\(${oldPath.replace('.', '\\.')}(#[^)]+)?\\)`, 'g');
      if (regex.test(newContent)) {
        modified = true;
        newContent = newContent.replace(regex, (match, text, hash = '') => `[${text}](${newPath}${hash})`);
      }
    }

    if (modified) {
      await fs.writeFile(file, newContent);
      console.log(`Fixed root file links in: ${file}`);
    }
  }
}

// Run the script
fixRootFileLinks().catch(console.error); 