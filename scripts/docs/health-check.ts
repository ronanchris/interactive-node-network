import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface HealthMetrics {
  completeness: number;
  accuracy: number;
  maintainability: number;
  usability: number;
}

interface HealthReport {
  timestamp: string;
  metrics: HealthMetrics;
  issues: string[];
  recommendations: string[];
}

class DocumentationHealthChecker {
  private readonly docsRoot: string;
  private readonly report: HealthReport;

  constructor() {
    this.docsRoot = path.resolve(__dirname, '../../docs');
    this.report = {
      timestamp: new Date().toISOString(),
      metrics: {
        completeness: 0,
        accuracy: 0,
        maintainability: 0,
        usability: 0
      },
      issues: [],
      recommendations: []
    };
  }

  async checkCompleteness(): Promise<void> {
    const requiredFiles = [
      'README.md',
      'CONTRIBUTING.md',
      'RULES.md',
      'docs/documentation-overview.md',
      'docs/documentation-structure.md',
      'docs/diagrams/documentation-relationships.md'
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.resolve(this.docsRoot, file)));
    
    if (missingFiles.length > 0) {
      this.report.issues.push(`Missing required files: ${missingFiles.join(', ')}`);
      this.report.metrics.completeness = Math.max(0, 100 - (missingFiles.length * 10));
    } else {
      this.report.metrics.completeness = 100;
    }
  }

  async checkAccuracy(): Promise<void> {
    // Check for broken links
    try {
      execSync('npm run docs:check', { stdio: 'pipe' });
      this.report.metrics.accuracy = 100;
    } catch (error) {
      this.report.issues.push('Broken links detected');
      this.report.metrics.accuracy = 90;
    }

    // Check for outdated content
    const files = this.getAllMarkdownFiles();
    const outdatedFiles = files.filter(file => {
      const stats = fs.statSync(file);
      const daysOld = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
      return daysOld > 90;
    });

    if (outdatedFiles.length > 0) {
      this.report.issues.push(`Outdated files: ${outdatedFiles.map(f => path.relative(this.docsRoot, f)).join(', ')}`);
      this.report.metrics.accuracy = Math.max(0, this.report.metrics.accuracy - 5);
    }
  }

  async checkMaintainability(): Promise<void> {
    // Check for automation scripts
    const automationScripts = [
      'scripts/docs/link-checker.ts',
      'scripts/docs/link-fixer.ts',
      'scripts/docs/coverage.ts',
      'scripts/docs/diagrams.ts'
    ];

    const missingScripts = automationScripts.filter(script => !fs.existsSync(path.resolve(__dirname, '../..', script)));
    
    if (missingScripts.length > 0) {
      this.report.issues.push(`Missing automation scripts: ${missingScripts.join(', ')}`);
      this.report.metrics.maintainability = Math.max(0, 100 - (missingScripts.length * 10));
    } else {
      this.report.metrics.maintainability = 100;
    }
  }

  async checkUsability(): Promise<void> {
    // Check for visual documentation
    const hasDiagrams = fs.existsSync(path.resolve(this.docsRoot, 'diagrams'));
    if (!hasDiagrams) {
      this.report.issues.push('Missing visual documentation');
      this.report.metrics.usability -= 10;
    }

    // Check for search functionality
    const hasSearch = fs.existsSync(path.resolve(this.docsRoot, 'search'));
    if (!hasSearch) {
      this.report.issues.push('Missing search functionality');
      this.report.metrics.usability -= 10;
    }

    // Check for clear navigation
    const hasClearNav = this.checkNavigationStructure();
    if (!hasClearNav) {
      this.report.issues.push('Navigation structure needs improvement');
      this.report.metrics.usability -= 5;
    }

    this.report.metrics.usability = Math.max(0, this.report.metrics.usability);
  }

  private checkNavigationStructure(): boolean {
    const readme = fs.readFileSync(path.resolve(this.docsRoot, 'README.md'), 'utf-8');
    return readme.includes('## Quick Navigation') && readme.includes('## Documentation Guide');
  }

  private getAllMarkdownFiles(): string[] {
    const files: string[] = [];
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    };
    walk(this.docsRoot);
    return files;
  }

  async generateReport(): Promise<void> {
    await this.checkCompleteness();
    await this.checkAccuracy();
    await this.checkMaintainability();
    await this.checkUsability();

    // Calculate overall score
    const overallScore = Object.values(this.report.metrics).reduce((a, b) => a + b, 0) / 4;

    // Generate recommendations
    if (this.report.metrics.completeness < 100) {
      this.report.recommendations.push('Complete missing required documentation files');
    }
    if (this.report.metrics.accuracy < 100) {
      this.report.recommendations.push('Fix broken links and update outdated content');
    }
    if (this.report.metrics.maintainability < 100) {
      this.report.recommendations.push('Implement missing automation scripts');
    }
    if (this.report.metrics.usability < 100) {
      this.report.recommendations.push('Improve navigation and add search functionality');
    }

    // Write report
    const reportPath = path.resolve(this.docsRoot, 'health-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      ...this.report,
      overallScore
    }, null, 2));

    console.log(`Documentation health report generated at ${reportPath}`);
    console.log(`Overall Score: ${overallScore.toFixed(1)}/100`);
  }
}

// Run health check
const checker = new DocumentationHealthChecker();
checker.generateReport().catch(console.error); 