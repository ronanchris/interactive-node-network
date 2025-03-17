import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Fix link formatting in markdown files
 * - Ensures all relative links have ./ prefix
 * - Preserves http(s) links
 * - Updates links to parent directories (../) correctly
 */
function fixLinks(filePath: string): void {
  const content = readFileSync(filePath, 'utf8');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  const fixedContent = content.replace(linkRegex, (match, text, link) => {
    // Don't modify external links or absolute paths
    if (link.startsWith('http') || link.startsWith('/')) {
      return match;
    }
    
    // Don't modify parent directory references
    if (link.startsWith('../')) {
      return match;
    }
    
    // Add ./ prefix if not present
    if (!link.startsWith('./')) {
      return `[${text}](./${link})`;
    }
    
    return match;
  });
  
  if (content !== fixedContent) {
    writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed links in ${filePath}`);
  }
}

/**
 * Process all markdown files in a directory recursively
 */
function processDirectory(dir: string): void {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.md')) {
      fixLinks(fullPath);
    }
  }
}

// Start processing from docs directory
const docsDir = join(__dirname, '..', 'docs');
processDirectory(docsDir);
console.log('Link fixing complete!'); 