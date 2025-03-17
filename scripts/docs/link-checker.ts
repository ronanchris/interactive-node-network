import { promises as fs } from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LinkIssue {
  file: string;
  line: number;
  link: string;
  issue: string;
  suggestion?: string;
}

interface CheckResult {
  issues: LinkIssue[];
  stats: {
    filesChecked: number;
    linksChecked: number;
    issuesFound: number;
  };
}

class MarkdownLinkChecker {
  private readonly rootDir: string;
  
  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  async check(): Promise<CheckResult> {
    const result: CheckResult = {
      issues: [],
      stats: {
        filesChecked: 0,
        linksChecked: 0,
        issuesFound: 0
      }
    };

    // Find all markdown files
    const files = await glob('**/*.md', {
      cwd: this.rootDir,
      ignore: ['node_modules/**']
    });

    result.stats.filesChecked = files.length;

    for (const file of files) {
      const fullPath = path.join(this.rootDir, file);
      const content = await fs.readFile(fullPath, 'utf-8');
      const lines = content.split('\n');

      // Find Markdown links using regex
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let match;

        while ((match = linkRegex.exec(line)) !== null) {
          result.stats.linksChecked++;
          const [, text, link] = match;
          
          // Check various link issues
          await this.checkLink(file, i + 1, text, link, result);
        }
      }
    }

    result.stats.issuesFound = result.issues.length;
    return result;
  }

  private async checkLink(file: string, line: number, text: string, link: string, result: CheckResult) {
    // Skip external links and anchor-only links
    if (link.startsWith('http') || link.startsWith('#')) {
      return;
    }

    // Check if link starts with ./ or ../
    if (!link.startsWith('./') && !link.startsWith('../')) {
      result.issues.push({
        file,
        line,
        link,
        issue: 'Link should start with ./ or ../',
        suggestion: link.startsWith('/') ? `.${link}` : `./${link}`
      });
    }

    // Check if .md extension is included for internal doc links
    if (!link.includes('#') && !link.endsWith('.md')) {
      result.issues.push({
        file,
        line,
        link,
        issue: 'Internal document links should include .md extension',
        suggestion: `${link}.md`
      });
    }

    // Check if the linked file exists
    const [filePath, anchor] = link.split('#');
    if (filePath) {
      const targetPath = path.join(path.dirname(path.join(this.rootDir, file)), filePath);
      try {
        await fs.access(targetPath);
      } catch {
        result.issues.push({
          file,
          line,
          link,
          issue: 'Linked file does not exist'
        });
      }
    }

    // Check anchor format if present
    if (anchor) {
      if (!/^[a-z0-9-]+$/.test(anchor)) {
        result.issues.push({
          file,
          line,
          link,
          issue: 'Anchor should be lowercase with hyphens only',
          suggestion: `${filePath}#${anchor.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`
        });
      }
    }
  }

  static formatReport(result: CheckResult): string {
    let report = '# Markdown Link Check Report\n\n';
    
    report += '## Statistics\n';
    report += `- Files checked: ${result.stats.filesChecked}\n`;
    report += `- Links checked: ${result.stats.linksChecked}\n`;
    report += `- Issues found: ${result.stats.issuesFound}\n\n`;

    if (result.issues.length > 0) {
      report += '## Issues\n\n';
      for (const issue of result.issues) {
        report += `### ${issue.file}:${issue.line}\n`;
        report += `- Link: \`${issue.link}\`\n`;
        report += `- Issue: ${issue.issue}\n`;
        if (issue.suggestion) {
          report += `- Suggestion: \`${issue.suggestion}\`\n`;
        }
        report += '\n';
      }
    } else {
      report += '## No issues found! 🎉\n';
    }

    return report;
  }
}

// Main execution
const checker = new MarkdownLinkChecker(process.cwd());
const result = await checker.check();
console.log(MarkdownLinkChecker.formatReport(result));

// Exit with error if issues found
process.exit(result.issues.length > 0 ? 1 : 0); 