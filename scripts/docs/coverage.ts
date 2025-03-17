import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CoverageReport {
  total_files: number;
  documented_files: number;
  coverage_percentage: number;
  missing_documentation: string[];
  broken_links: string[];
  outdated_files: string[];
  recommendations: string[];
}

class DocumentationCoverage {
  private readonly rootDir: string;
  private readonly docsDir: string;
  private report: CoverageReport;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.docsDir = join(rootDir, 'docs');
    this.report = this.initReport();
  }

  private initReport(): CoverageReport {
    return {
      total_files: 0,
      documented_files: 0,
      coverage_percentage: 0,
      missing_documentation: [],
      broken_links: [],
      outdated_files: [],
      recommendations: []
    };
  }

  /**
   * Check if a directory has a README
   */
  private hasReadme(dirPath: string): boolean {
    try {
      const files = readdirSync(dirPath);
      return files.includes('README.md');
    } catch {
      return false;
    }
  }

  /**
   * Check for broken links in a markdown file
   */
  private checkLinks(filePath: string): string[] {
    const content = readFileSync(filePath, 'utf8');
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const brokenLinks: string[] = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const [, text, link] = match;
      if (!link.startsWith('http')) {
        const targetPath = join(this.rootDir, link);
        try {
          statSync(targetPath);
        } catch {
          brokenLinks.push(`${text} -> ${link} in ${relative(this.rootDir, filePath)}`);
        }
      }
    }

    return brokenLinks;
  }

  /**
   * Check if a file's documentation is outdated
   */
  private isDocumentationOutdated(filePath: string): boolean {
    try {
      const gitLog = execSync(
        `git log -1 --format=%cd ${filePath}`,
        { encoding: 'utf8' }
      );
      const lastModified = new Date(gitLog);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      return lastModified < threeMonthsAgo;
    } catch {
      return false;
    }
  }

  /**
   * Analyze documentation coverage
   */
  public async analyzeCoverage(): Promise<CoverageReport> {
    const queue = [this.rootDir];
    const processedDirs = new Set<string>();

    while (queue.length > 0) {
      const currentDir = queue.shift()!;
      if (processedDirs.has(currentDir)) continue;
      processedDirs.add(currentDir);

      const items = readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = join(currentDir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.')) {
          queue.push(fullPath);
          this.report.total_files++;

          if (this.hasReadme(fullPath)) {
            this.report.documented_files++;
          } else {
            this.report.missing_documentation.push(relative(this.rootDir, fullPath));
          }
        } else if (stat.isFile() && item.endsWith('.md')) {
          const brokenLinks = this.checkLinks(fullPath);
          this.report.broken_links.push(...brokenLinks);

          if (this.isDocumentationOutdated(fullPath)) {
            this.report.outdated_files.push(relative(this.rootDir, fullPath));
          }
        }
      }
    }

    this.report.coverage_percentage = 
      (this.report.documented_files / this.report.total_files) * 100;

    this.generateRecommendations();
    return this.report;
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(): void {
    if (this.report.coverage_percentage < 80) {
      this.report.recommendations.push(
        'Documentation coverage is below 80%. Consider adding README files to undocumented directories.'
      );
    }

    if (this.report.broken_links.length > 0) {
      this.report.recommendations.push(
        'Fix broken documentation links to maintain documentation integrity.'
      );
    }

    if (this.report.outdated_files.length > 0) {
      this.report.recommendations.push(
        'Review and update documentation files that haven\'t been modified in over 3 months.'
      );
    }
  }
}

// Main function
async function generateCoverageReport(rootDir: string): Promise<void> {
  const coverage = new DocumentationCoverage(rootDir);
  const report = await coverage.analyzeCoverage();
  
  console.log('\nDocumentation Coverage Report');
  console.log('============================');
  console.log(`Coverage: ${report.coverage_percentage.toFixed(1)}%`);
  console.log(`Total Directories: ${report.total_files}`);
  console.log(`Documented Directories: ${report.documented_files}`);
  
  if (report.missing_documentation.length > 0) {
    console.log('\nMissing Documentation:');
    report.missing_documentation.forEach(dir => console.log(`- ${dir}`));
  }
  
  if (report.broken_links.length > 0) {
    console.log('\nBroken Links:');
    report.broken_links.forEach(link => console.log(`- ${link}`));
  }
  
  if (report.outdated_files.length > 0) {
    console.log('\nOutdated Files:');
    report.outdated_files.forEach(file => console.log(`- ${file}`));
  }
  
  if (report.recommendations.length > 0) {
    console.log('\nRecommendations:');
    report.recommendations.forEach(rec => console.log(`- ${rec}`));
  }
}

// Run if called directly
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  const rootDir = process.cwd();
  generateCoverageReport(rootDir).catch(console.error);
}
