/// <reference types="node" />
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

async function fixLinkExtensions() {
  // Find all markdown files
  const files = await glob('**/*.md', { ignore: 'node_modules/**' });

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // Fix double .md extensions
    let newContent = content.replace(
      /\[([^\]]+)\]\(([^#\s]+)\.md\.md(#[^\s]*)?\)/g,
      '[$1]($2.md$3)'
    );

    // Remove .md from configuration files
    newContent = newContent.replace(
      /\[([^\]]+)\]\(([^#\s]+)\.(env|config|json|yml|yaml|xml)\.md(#[^\s]*)?\)/g,
      '[$1]($2.$3$4)'
    );

    // Remove .md from directories
    newContent = newContent.replace(
      /\[([^\]]+)\]\(([^#\s]+)\/\.md(#[^\s]*)?\)/g,
      '[$1]($2/$3)'
    );

    if (modified) {
      fs.writeFileSync(file, newContent);
      console.log(`Fixed extensions in ${file}`);
    }
  }
}

fixLinkExtensions().catch(console.error); 