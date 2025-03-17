import { promises as fs } from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LinkFix {
  file: string;
  line: number;
  oldLink: string;
  newLink: string;
}

async function fixLinks(rootDir: string): Promise<LinkFix[]> {
  const fixes: LinkFix[] = [];
  
  // Find all markdown files
  const files = await glob('**/*.md', {
    cwd: rootDir,
    ignore: ['node_modules/**']
  });

  for (const file of files) {
    const fullPath = path.join(rootDir, file);
    const content = await fs.readFile(fullPath, 'utf-8');
    const lines = content.split('\n');
    let modified = false;

    // Find and fix Markdown links
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      let newLine = line;

      while ((match = linkRegex.exec(line)) !== null) {
        const [fullMatch, text, link] = match;
        let newLink = link;

        // Skip external links and anchor-only links
        if (link.startsWith('http') || link.startsWith('#')) {
          continue;
        }

        // Add ./ if needed
        if (!link.startsWith('./') && !link.startsWith('../')) {
          newLink = link.startsWith('/') ? `.${link}` : `./${link}`;
          fixes.push({
            file,
            line: i + 1,
            oldLink: link,
            newLink
          });
        }

        // Add .md extension if needed
        if (!link.includes('#') && !link.endsWith('.md') && !link.endsWith('/')) {
          newLink = `${newLink}.md`;
          fixes.push({
            file,
            line: i + 1,
            oldLink: link,
            newLink
          });
        }

        // Fix anchor format if present
        const [filePath, anchor] = newLink.split('#');
        if (anchor && !/^[a-z0-9-]+$/.test(anchor)) {
          const newAnchor = anchor.toLowerCase().replace(/[^a-z0-9-]/g, '-');
          newLink = `${filePath}#${newAnchor}`;
          fixes.push({
            file,
            line: i + 1,
            oldLink: link,
            newLink
          });
        }

        // Replace the link in the line
        newLine = newLine.replace(
          `[${text}](${link})`,
          `[${text}](${newLink})`
        );
      }

      if (newLine !== line) {
        lines[i] = newLine;
        modified = true;
      }
    }

    // Write back the modified content
    if (modified) {
      await fs.writeFile(fullPath, lines.join('\n'));
    }
  }

  return fixes;
}

function formatReport(fixes: LinkFix[]): string {
  let report = '# Link Fix Report\n\n';
  
  if (fixes.length === 0) {
    report += 'No fixes needed! 🎉\n';
    return report;
  }

  report += `Fixed ${fixes.length} links:\n\n`;
  
  for (const fix of fixes) {
    report += `### ${fix.file}:${fix.line}\n`;
    report += `- Old: \`${fix.oldLink}\`\n`;
    report += `- New: \`${fix.newLink}\`\n\n`;
  }

  return report;
}

// Main execution
const fixes = await fixLinks(process.cwd());
console.log(formatReport(fixes)); 