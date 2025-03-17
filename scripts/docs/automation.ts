import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { machineSetup } from '../setup-machine';
import { createHash } from 'crypto';

interface DocumentationCheck {
  type: 'learning' | 'session' | 'readme' | 'glossary' | 'machine_check';
  trigger: string;
  required: boolean;
  actions: string[];
}

interface DocumentationUpdate {
  file: string;
  type: DocumentationCheck['type'];
  content: string;
  timestamp: string;
}

interface ChecksumEntry {
  hash: string;
  last_checked: string;
  last_modified: string;
}

interface ChecksumMap {
  [key: string]: ChecksumEntry;
}

class DocumentationAutomation {
  private readonly rootDir: string;
  private updates: DocumentationUpdate[] = [];
  private checksums: ChecksumMap = {};
  private readonly CHECKSUM_FILE = '.checksums.json';

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.loadChecksums();
  }

  /**
   * Load existing checksums
   */
  private loadChecksums(): void {
    try {
      const content = readFileSync(join(this.rootDir, this.CHECKSUM_FILE), 'utf8');
      this.checksums = JSON.parse(content);
    } catch (error) {
      console.warn('No existing checksums found, creating new file');
      this.checksums = {};
    }
  }

  /**
   * Generate SHA-256 hash for a file
   */
  private generateHash(filePath: string): string {
    const content = readFileSync(join(this.rootDir, filePath), 'utf8');
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Update checksum for a file
   */
  private updateChecksum(filePath: string): void {
    const now = new Date().toISOString();
    const hash = this.generateHash(filePath);
    
    this.checksums[filePath] = {
      hash,
      last_checked: now,
      last_modified: now
    };

    writeFileSync(
      join(this.rootDir, this.CHECKSUM_FILE),
      JSON.stringify(this.checksums, null, 2)
    );
  }

  /**
   * Verify file checksum
   */
  private verifyChecksum(filePath: string): boolean {
    const existing = this.checksums[filePath];
    if (!existing) return false;

    const currentHash = this.generateHash(filePath);
    return currentHash === existing.hash;
  }

  /**
   * Check if a term exists in the glossary
   */
  private checkGlossaryTerm(term: string): boolean {
    const glossaryPath = join(this.rootDir, 'docs', 'glossary.md');
    const content = readFileSync(glossaryPath, 'utf8');
    return content.includes(`**${term}**:`);
  }

  /**
   * Add a new term to the glossary
   */
  private addGlossaryTerm(
    term: string,
    definition: string,
    category: string
  ): void {
    const glossaryPath = join(this.rootDir, 'docs', 'glossary.md');
    const content = readFileSync(glossaryPath, 'utf8');
    
    // Find category section and add term
    const categoryRegex = new RegExp(`### ${category}([^#]*)`, 'g');
    const updatedContent = content.replace(
      categoryRegex,
      `### ${category}$1- **${term}**: ${definition}\n`
    );
    
    this.updates.push({
      file: glossaryPath,
      type: 'glossary',
      content: updatedContent,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Add a learning entry
   */
  private addLearningEntry(
    concept: string,
    description: string,
    example: string
  ): void {
    const journalPath = join(this.rootDir, 'docs', 'learning', 'learning-journal.md');
    const entry = `
## ${concept}

**Date**: ${new Date().toISOString().split('T')[0]}

### Description
${description}

### Example
\`\`\`
${example}
\`\`\`

### Value
- Added to glossary
- Documentation updated
- Cross-references added
`;
    
    this.updates.push({
      file: journalPath,
      type: 'learning',
      content: entry,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Update session notes
   */
  private updateSessionNotes(
    context: string,
    actions: string[],
    decisions: string[],
    nextSteps: string[]
  ): void {
    const sessionPath = join(this.rootDir, 'SESSIONS.md');
    const entry = `
## Session: ${new Date().toISOString()}

### Context
${context}

### Actions Taken
${actions.map(action => `- ${action}`).join('\n')}

### Decisions Made
${decisions.map(decision => `- ${decision}`).join('\n')}

### Next Steps
${nextSteps.map(step => `- ${step}`).join('\n')}
`;
    
    this.updates.push({
      file: sessionPath,
      type: 'session',
      content: entry,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Apply all pending updates
   */
  private async applyUpdates(): Promise<void> {
    for (const update of this.updates) {
      const currentContent = readFileSync(update.file, 'utf8');
      writeFileSync(update.file, currentContent + update.content);
      
      // Run related automation
      if (update.type === 'learning') {
        execSync('npm run generate-diagrams');
      }
    }
    
    // Clear updates after applying
    this.updates = [];
  }

  /**
   * Handle a documentation trigger
   */
  public async handleTrigger(check: DocumentationCheck, data: any): Promise<void> {
    switch (check.type) {
      case 'learning':
        if (!this.checkGlossaryTerm(data.term)) {
          this.addGlossaryTerm(
            data.term,
            data.definition,
            data.category
          );
        }
        this.addLearningEntry(
          data.term,
          data.description,
          data.example
        );
        break;
      
      case 'session':
        this.updateSessionNotes(
          data.context,
          data.actions,
          data.decisions,
          data.nextSteps
        );
        break;
      
      case 'machine_check':
        await this.handleMachineCheck(data.trigger);
        break;
      
      // Add more cases as needed
    }
    
    await this.applyUpdates();
  }

  /**
   * Check documentation health including checksums
   */
  public async checkHealth(): Promise<boolean> {
    const checks = [
      this.checkGlossaryHealth(),
      this.checkLearningHealth(),
      this.checkSessionHealth(),
      this.verifyAllChecksums()
    ];

    return (await Promise.all(checks)).every(result => result);
  }

  /**
   * Verify all file checksums
   */
  private async verifyAllChecksums(): Promise<boolean> {
    const files = Object.keys(this.checksums);
    let allValid = true;

    for (const file of files) {
      if (!this.verifyChecksum(file)) {
        console.error(`Checksum mismatch for ${file}`);
        allValid = false;
      }
    }

    return allValid;
  }

  /**
   * Monitor documentation for changes
   */
  public async startMonitoring(): Promise<void> {
    // Monitor documentation files for changes
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(join(this.rootDir, 'docs'), {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher
      .on('change', async (path: string) => {
        const relativePath = path.replace(this.rootDir + '/', '');
        console.log(`File ${relativePath} has been changed`);
        this.updateChecksum(relativePath);
        await this.checkHealth();
      })
      .on('add', async (path: string) => {
        const relativePath = path.replace(this.rootDir + '/', '');
        console.log(`File ${relativePath} has been added`);
        this.updateChecksum(relativePath);
      });
  }

  /**
   * Generate documentation coverage report
   */
  public async generateCoverageReport(): Promise<void> {
    const report = {
      total_files: 0,
      files_with_readme: 0,
      cross_references: 0,
      missing_documentation: [] as string[],
      outdated_checksums: [] as string[]
    };

    // Implementation details...
    
    writeFileSync(
      join(this.rootDir, 'docs', 'coverage-report.md'),
      JSON.stringify(report, null, 2)
    );
  }

  private async handleMachineCheck(trigger: string): Promise<void> {
    if (trigger === 'new_machine') {
      console.log('🔄 New development machine detected!');
      console.log('Running environment verification...');
      
      const check: DocumentationCheck = {
        type: 'machine_check',
        trigger: 'new_machine',
        required: true,
        actions: ['verify_environment', 'check_configs', 'sync_requirements']
      };
      
      await this.handleTrigger(check, {});
    } else if (trigger === 'environment_change') {
      console.log('⚠️ Environment changes detected!');
      console.log('Verifying configuration...');
      
      const check: DocumentationCheck = {
        type: 'machine_check',
        trigger: 'environment_change',
        required: true,
        actions: ['verify_environment', 'update_configs']
      };
      
      await this.handleTrigger(check, {});
    }
  }

  /**
   * Check glossary health
   */
  private async checkGlossaryHealth(): Promise<boolean> {
    try {
      const glossaryPath = join(this.rootDir, 'docs', 'glossary.md');
      const content = readFileSync(glossaryPath, 'utf8');
      
      // Check for required sections
      const requiredSections = ['## Terms', '## Categories', '## Usage'];
      const missingSection = requiredSections.find(section => !content.includes(section));
      
      if (missingSection) {
        console.error(`Missing required section: ${missingSection}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Glossary health check failed:', error);
      return false;
    }
  }

  /**
   * Check learning documentation health
   */
  private async checkLearningHealth(): Promise<boolean> {
    try {
      const learningPath = join(this.rootDir, 'docs', 'learning');
      const files = ['README.md', 'learning-journal.md', 'ai-interaction-patterns.md'];
      
      for (const file of files) {
        const filePath = join(learningPath, file);
        if (!this.verifyChecksum(join('docs/learning', file))) {
          console.error(`Learning file ${file} has been modified without updating checksum`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Learning health check failed:', error);
      return false;
    }
  }

  /**
   * Check session documentation health
   */
  private async checkSessionHealth(): Promise<boolean> {
    try {
      const sessionsPath = join(this.rootDir, 'SESSIONS.md');
      const content = readFileSync(sessionsPath, 'utf8');
      
      // Check for required session elements
      const requiredElements = [
        '## Session Summary',
        '### Duration',
        '### Key Accomplishments',
        '### Current Status'
      ];
      
      const missingElement = requiredElements.find(element => !content.includes(element));
      
      if (missingElement) {
        console.error(`Missing required session element: ${missingElement}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session health check failed:', error);
      return false;
    }
  }
}

async function checkMachineEnvironment(): Promise<void> {
  const automation = new DocumentationAutomation(process.cwd());
  
  if (machineSetup.isNewMachine()) {
    console.log('🔄 New development machine detected!');
    console.log('Running environment verification...');
    
    const check: DocumentationCheck = {
      type: 'machine_check',
      trigger: 'new_machine',
      required: true,
      actions: ['verify_environment', 'check_configs', 'sync_requirements']
    };
    
    await automation.handleTrigger(check, {});
  } else if (machineSetup.hasEnvironmentChanged()) {
    console.log('⚠️ Environment changes detected!');
    console.log('Verifying configuration...');
    
    const check: DocumentationCheck = {
      type: 'machine_check',
      trigger: 'environment_change',
      required: true,
      actions: ['verify_environment', 'update_configs']
    };
    
    await automation.handleTrigger(check, {});
  }
}

async function main() {
  await checkMachineEnvironment();
  // ... rest of the automation logic ...
}

export const automation = new DocumentationAutomation(process.cwd());
export { main, checkMachineEnvironment }; 