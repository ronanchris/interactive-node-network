import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

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

class LinkChecker {
  private issues: LinkIssue[] = [];
  private filesChecked = 0;
  private linksChecked = 0;

  private isDocumentationFile(filePath: string): boolean {
    return filePath.endsWith('.md') || filePath.endsWith('.mdx');
  }

  private isConfigurationFile(filePath: string): boolean {
    const configExtensions = ['.env', '.json', '.yaml', '.yml', '.toml', '.ini', '.eslintrc', '.prettierrc'];
    return configExtensions.some(ext => filePath.endsWith(ext));
  }

  private isSourceCodeFile(filePath: string): boolean {
    const sourceExtensions = ['.ts', '.js', '.jsx', '.tsx', '.css', '.scss', '.html'];
    return sourceExtensions.some(ext => filePath.endsWith(ext));
  }

  private isSourceCodeDir(filePath: string): boolean {
    const sourceDirs = ['src/', 'dist/', 'coverage/', 'node_modules/'];
    return sourceDirs.some(dir => filePath.includes(dir));
  }

  private isAssetFile(filePath: string): boolean {
    return filePath.includes('assets/') && filePath.endsWith('.json');
  }

  private isDirectory(filePath: string): boolean {
    return !path.extname(filePath);
  }

  private checkLink(filePath: string, line: number, link: string): void {
    this.linksChecked++;

    // Skip external links
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:')) {
      return;
    }

    // Handle anchor links
    const [filePathPart, anchorPart] = link.split('#');
    const targetPath = path.resolve(path.dirname(filePath), filePathPart);

    // Skip source code directories
    if (this.isSourceCodeDir(filePathPart)) {
      return;
    }

    // Skip configuration files
    if (this.isConfigurationFile(filePathPart)) {
      return;
    }

    // Skip asset files
    if (this.isAssetFile(filePathPart)) {
      return;
    }

    // Check if the file exists
    if (!fs.existsSync(targetPath)) {
      this.issues.push({
        file: filePath,
        line,
        link,
        issue: 'Linked file does not exist'
      });
      return;
    }

    // Only require .md extension for documentation files
    if (this.isDocumentationFile(targetPath) && !filePathPart.endsWith('.md')) {
      this.issues.push({
        file: filePath,
        line,
        link,
        issue: 'Internal document links should include .md extension',
        suggestion: `${filePathPart}.md`
      });
      return;
    }

    // Don't require .md extension for non-documentation files
    if (this.isConfigurationFile(targetPath) || this.isSourceCodeFile(targetPath) || this.isDirectory(targetPath)) {
      return;
    }
  }

  private checkFile(filePath: string): void {
    this.filesChecked++;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        this.checkLink(filePath, index + 1, match[2]);
      }
    });
  }

  public async check(): Promise<void> {
    const files = await glob('**/*.md', { ignore: ['node_modules/**'] });
    
    for (const file of files) {
      this.checkFile(file);
    }

    this.printReport();
  }

  private printReport(): void {
    console.log('# Markdown Link Check Report\n');
    console.log('## Statistics');
    console.log(`- Files checked: ${this.filesChecked}`);
    console.log(`- Links checked: ${this.linksChecked}`);
    console.log(`- Issues found: ${this.issues.length}\n`);

    if (this.issues.length > 0) {
      console.log('## Issues\n');

      this.issues.forEach(issue => {
        console.log(`### ${issue.file}:${issue.line}`);
        console.log(`- Link: \`${issue.link}\``);
        console.log(`- Issue: ${issue.issue}`);
        if (issue.suggestion) {
          console.log(`- Suggestion: \`${issue.suggestion}\``);
        }
        console.log('');
      });

      process.exit(1);
    }
  }
}

const checker = new LinkChecker();
checker.check().catch(console.error); 