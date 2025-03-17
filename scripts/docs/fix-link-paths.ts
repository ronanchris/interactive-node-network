/// <reference types="node" />
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

async function fixLinkPaths() {
  // Find all markdown files
  const files = await glob('**/*.md', { ignore: 'node_modules/**' });

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // Fix links to root files from docs directory
    let newContent = content.replace(
      /\[([^\]]+)\]\(\.\.\/CONTRIBUTING\.md\)/g,
      '[$1](./CONTRIBUTING.md)'
    );

    // Fix links to root files from subdirectories
    newContent = newContent.replace(
      /\[([^\]]+)\]\(\.\.\/\.\.\/CONTRIBUTING\.md\)/g,
      '[$1](./CONTRIBUTING.md)'
    );

    // Add .md extension to internal document links
    newContent = newContent.replace(
      /\[([^\]]+)\]\(([^#\s]+)(#[^\s]*)?\)/g,
      (match, text, link, hash) => {
        // Skip if link already has .md extension or is an external URL
        if (link.endsWith('.md') || link.startsWith('http')) {
          return match;
        }
        // Skip if link is to a source code file or configuration
        if (link.match(/\.(ts|js|json|env|config|yml|yaml|xml)$/)) {
          return match;
        }
        modified = true;
        return `[${text}](${link}.md${hash || ''})`;
      }
    );

    // Fix links to diagrams directory
    newContent = newContent.replace(
      /\[([^\]]+)\]\(\.\/diagrams\/([^#\s]+)(#[^\s]*)?\)/g,
      '[$1](./diagrams/$2.md$3)'
    );

    // Fix links to technical directory
    newContent = newContent.replace(
      /\[([^\]]+)\]\(\.\/technical\/([^#\s]+)(#[^\s]*)?\)/g,
      '[$1](./technical/$2.md$3)'
    );

    if (modified) {
      fs.writeFileSync(file, newContent);
      console.log(`Fixed links in ${file}`);
    }
  }
}

fixLinkPaths().catch(console.error); 