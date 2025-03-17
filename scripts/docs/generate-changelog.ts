import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface ChangelogEntry {
  type: 'Added' | 'Changed' | 'Removed' | 'Fixed';
  description: string;
  file: string;
  date: string;
}

class ChangelogGenerator {
  private readonly docsRoot: string;
  private readonly changelogPath: string;
  private readonly version: string;

  constructor() {
    this.docsRoot = path.resolve(__dirname, '../../docs');
    this.changelogPath = path.resolve(this.docsRoot, 'CHANGELOG.md');
    this.version = this.getNextVersion();
  }

  private getNextVersion(): string {
    const changelog = fs.readFileSync(this.changelogPath, 'utf-8');
    const versionMatch = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m);
    if (!versionMatch) return '1.0.0';

    const [major, minor, patch] = versionMatch[1].split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private getGitChanges(): ChangelogEntry[] {
    const changes: ChangelogEntry[] = [];
    const docsDir = path.relative(process.cwd(), this.docsRoot);
    
    // Get git log for documentation changes
    const gitLog = execSync(
      `git log --since="30 days ago" --name-status --pretty=format:"%h|%ad|%s" --date=short ${docsDir}`,
      { encoding: 'utf-8' }
    );

    let currentCommit: { hash: string; date: string; message: string } | null = null;
    let currentFiles: string[] = [];

    gitLog.split('\n').forEach(line => {
      if (line.startsWith('commit')) {
        if (currentCommit) {
          changes.push(...this.processCommit(currentCommit, currentFiles));
          currentFiles = [];
        }
        const [hash, date, ...messageParts] = line.split('|');
        currentCommit = {
          hash: hash.replace('commit ', ''),
          date,
          message: messageParts.join('|')
        };
      } else if (line.startsWith('M') || line.startsWith('A') || line.startsWith('D')) {
        const file = line.split('\t')[1];
        if (file.startsWith(docsDir)) {
          currentFiles.push(file);
        }
      }
    });

    if (currentCommit) {
      changes.push(...this.processCommit(currentCommit, currentFiles));
    }

    return changes;
  }

  private processCommit(commit: { hash: string; date: string; message: string }, files: string[]): ChangelogEntry[] {
    const entries: ChangelogEntry[] = [];
    const type = this.determineChangeType(commit.message);
    
    if (type) {
      files.forEach(file => {
        entries.push({
          type,
          description: commit.message,
          file: path.relative(this.docsRoot, file),
          date: commit.date
        });
      });
    }

    return entries;
  }

  private determineChangeType(message: string): 'Added' | 'Changed' | 'Removed' | 'Fixed' | null {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('add') || lowerMessage.includes('create')) return 'Added';
    if (lowerMessage.includes('update') || lowerMessage.includes('change')) return 'Changed';
    if (lowerMessage.includes('remove') || lowerMessage.includes('delete')) return 'Removed';
    if (lowerMessage.includes('fix') || lowerMessage.includes('correct')) return 'Fixed';
    return null;
  }

  private groupChangesByType(entries: ChangelogEntry[]): Record<string, string[]> {
    const groups: Record<string, string[]> = {
      Added: [],
      Changed: [],
      Removed: [],
      Fixed: []
    };

    entries.forEach(entry => {
      groups[entry.type].push(`- ${entry.description} (${entry.file})`);
    });

    return groups;
  }

  async generateChangelog(): Promise<void> {
    const changes = this.getGitChanges();
    const groupedChanges = this.groupChangesByType(changes);
    
    const newEntry = `## [${this.version}] - ${new Date().toLocaleDateString()}\n\n` +
      Object.entries(groupedChanges)
        .filter(([_, items]) => items.length > 0)
        .map(([type, items]) => `### ${type}\n${items.join('\n')}`)
        .join('\n\n');

    const changelog = fs.readFileSync(this.changelogPath, 'utf-8');
    const updatedChangelog = changelog.replace(
      /^# Documentation Changelog\n/,
      `# Documentation Changelog\n\n${newEntry}\n\n`
    );

    fs.writeFileSync(this.changelogPath, updatedChangelog);
    console.log(`Updated CHANGELOG.md with version ${this.version}`);
  }
}

// Run changelog generation
const generator = new ChangelogGenerator();
generator.generateChangelog().catch(console.error); 