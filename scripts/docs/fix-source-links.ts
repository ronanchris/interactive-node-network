import { promises as fs } from 'fs';
import * as path from 'path';
import { glob } from 'glob';

async function fixSourceLinks() {
  const files = await glob('docs/**/*.md', {
    ignore: ['node_modules/**']
  });

  for (const file of files) {
    let content = await fs.readFile(file, 'utf-8');
    
    // Fix links to source code files
    content = content.replace(
      /(\[.*?\]\(.*?)(\.ts|\.js|\.json|\.env.*|\.gitignore|\.eslintrc.*|\.prettierrc.*)\.md\)/g,
      '$1$2)'
    );

    // Fix links to directories
    content = content.replace(
      /(\[.*?\]\(.*?)(\/src\/.*?|\/scripts\/.*?|\/dist\/|\/coverage\/)\.md\)/g,
      '$1$2)'
    );

    await fs.writeFile(file, content);
  }
}

fixSourceLinks().catch(console.error); 