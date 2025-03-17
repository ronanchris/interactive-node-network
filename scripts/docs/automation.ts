import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { machineSetup } from '../setup-machine';

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

class DocumentationAutomation {
  private readonly rootDir: string;
  private updates: DocumentationUpdate[] = [];

  constructor(rootDir: string) {
    this.rootDir = rootDir;
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
   * Verify documentation health
   */
  public async checkHealth(): Promise<boolean> {
    try {
      // Run all automated checks
      execSync('npm run check-env');
      execSync('npm run generate-diagrams');
      
      // Add more health checks as needed
      
      return true;
    } catch (error) {
      console.error('Documentation health check failed:', error);
      return false;
    }
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