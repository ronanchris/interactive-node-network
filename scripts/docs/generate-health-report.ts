import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

class HealthReportGenerator {
    private docsDir: string;
    private reportPath: string;

    constructor() {
        this.docsDir = path.join(process.cwd(), 'docs');
        this.reportPath = path.join(this.docsDir, 'status', 'health-report.json');
    }

    async generateReport() {
        const contentFreshness = await this.calculateContentFreshness();
        const report = {
            timestamp: new Date().toISOString(),
            overallScore: await this.calculateOverallScore(),
            metrics: {
                coverage: await this.calculateCoverage(),
                linkHealth: await this.calculateLinkHealth(),
                contentFreshness: contentFreshness.percentage
            },
            fileDetails: contentFreshness.fileDetails,
            issues: await this.detectIssues()
        };

        // Ensure status directory exists
        const statusDir = path.join(this.docsDir, 'status');
        if (!fs.existsSync(statusDir)) {
            fs.mkdirSync(statusDir, { recursive: true });
        }

        // Write report
        fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
        console.log('Health report generated successfully');
    }

    private async calculateOverallScore(): Promise<number> {
        const coverage = await this.calculateCoverage();
        const linkHealth = await this.calculateLinkHealth();
        const contentFreshness = await this.calculateContentFreshness();
        
        return Math.round((coverage + linkHealth + contentFreshness.percentage) / 3);
    }

    private async calculateCoverage(): Promise<number> {
        // Get all markdown files
        const files = this.getAllMarkdownFiles();
        
        // Check for required sections in each file
        const requiredSections = ['## Overview', '## Usage', '## Examples'];
        let coveredSections = 0;
        let totalSections = 0;

        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            for (const section of requiredSections) {
                if (content.includes(section)) {
                    coveredSections++;
                }
                totalSections++;
            }
        }

        return Math.round((coveredSections / totalSections) * 100);
    }

    private async calculateLinkHealth(): Promise<number> {
        // Get all markdown files
        const files = this.getAllMarkdownFiles();
        let validLinks = 0;
        let totalLinks = 0;

        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const links = this.extractLinks(content);
            
            for (const link of links) {
                if (this.isValidLink(link, file)) {
                    validLinks++;
                }
                totalLinks++;
            }
        }

        return totalLinks > 0 ? Math.round((validLinks / totalLinks) * 100) : 100;
    }

    private async calculateContentFreshness(): Promise<{percentage: number, fileDetails: any[]}> {
        const files = this.getAllMarkdownFiles();
        let freshFiles = 0;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

        const fileDetails = files.map(file => {
            const stats = fs.statSync(file);
            const lastModified = new Date(stats.mtime);
            const daysSinceUpdate = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
            const isFresh = daysSinceUpdate <= 30;
            
            if (isFresh) freshFiles++;
            
            return {
                path: path.relative(this.docsDir, file),
                lastModified: lastModified.toISOString(),
                daysSinceUpdate,
                status: isFresh ? 'up-to-date' : 'needs-review',
                size: stats.size
            };
        }).sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate);

        return {
            percentage: files.length > 0 ? Math.round((freshFiles / files.length) * 100) : 100,
            fileDetails
        };
    }

    private async detectIssues(): Promise<Array<{ 
        title: string; 
        description: string; 
        severity: string;
        file?: string;
        id: string;
    }>> {
        const issues: Array<{ 
            title: string; 
            description: string; 
            severity: string;
            file?: string;
            id: string;
        }> = [];

        // Check for missing API documentation
        if (!fs.existsSync(path.join(this.docsDir, 'reference', 'api.md'))) {
            issues.push({
                id: 'missing-api-docs',
                title: 'Missing API Documentation',
                description: 'API endpoints and usage guidelines need to be documented',
                severity: 'high',
                file: 'docs/reference/api.md'
            });
        }

        // Check for outdated performance metrics
        const performanceFile = path.join(this.docsDir, 'technical', 'performance.md');
        if (fs.existsSync(performanceFile)) {
            const stats = fs.statSync(performanceFile);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            if (stats.mtime < thirtyDaysAgo) {
                issues.push({
                    id: 'outdated-performance',
                    title: 'Outdated Performance Metrics',
                    description: 'Performance documentation needs to be updated with latest benchmarks',
                    severity: 'medium',
                    file: 'docs/technical/performance.md'
                });
            }
        }

        // Check for broken cross-references
        const files = this.getAllMarkdownFiles();
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const links = this.extractLinks(content);
            
            for (const link of links) {
                if (!this.isValidLink(link, file)) {
                    const relativeFile = path.relative(this.docsDir, file);
                    issues.push({
                        id: `broken-link-${Buffer.from(relativeFile + link).toString('base64')}`,
                        title: 'Broken Cross-References',
                        description: `Invalid link found in ${relativeFile}: ${link}`,
                        severity: 'low',
                        file: relativeFile
                    });
                }
            }
        }

        return issues;
    }

    private getAllMarkdownFiles(): string[] {
        const files: string[] = [];
        
        function walk(dir: string) {
            const entries = fs.readdirSync(dir);
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    walk(fullPath);
                } else if (entry.endsWith('.md')) {
                    files.push(fullPath);
                }
            }
        }

        walk(this.docsDir);
        return files;
    }

    private extractLinks(content: string): string[] {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const links: string[] = [];
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
            links.push(match[2]);
        }

        return links;
    }

    private isValidLink(link: string, sourceFile: string): boolean {
        // Handle external links
        if (link.startsWith('http://') || link.startsWith('https://')) {
            return true;
        }

        // Handle internal links
        const targetPath = path.resolve(path.dirname(sourceFile), link);
        return fs.existsSync(targetPath);
    }
}

// Generate the health report
const generator = new HealthReportGenerator();
generator.generateReport().catch(console.error); 