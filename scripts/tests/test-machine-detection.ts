import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import assert from 'assert';
import { machineSetup } from '../setup-machine';
import { checkMachineEnvironment } from '../docs/automation';

interface TestCase {
  name: string;
  machineConfig: {
    identifier: string;
    osVersion: string;
    shell: string;
    workspacePath: string;
    nodeVersion: string;
  };
  expectedOutput: string[];
  shouldTriggerSetup: boolean;
}

class MachineDetectionTests {
  private originalConfig: string;
  private testCases: TestCase[];
  private outputLog: string[] = [];

  constructor() {
    // Backup original config
    this.originalConfig = readFileSync('.machine-config.json', 'utf8');

    // Define test cases
    this.testCases = [
      {
        name: 'New Machine Detection',
        machineConfig: {
          identifier: 'test-macbook-darwin',
          osVersion: 'darwin 24.3.0',
          shell: '/bin/zsh',
          workspacePath: '/Users/test/Projects/interactive-node-network',
          nodeVersion: '16.0.0'
        },
        expectedOutput: [
          '🔄 New development machine detected!',
          'Running environment verification'
        ],
        shouldTriggerSetup: true
      },
      {
        name: 'Environment Change Detection',
        machineConfig: {
          identifier: 'home-mbp',
          osVersion: 'darwin 24.3.1', // Changed OS version
          shell: '/bin/zsh',
          workspacePath: '/Users/cronan/Team Ronan Dropbox/chris ronan/cursor projects/interactive node network',
          nodeVersion: '16.0.0'
        },
        expectedOutput: [
          '⚠️ Environment changes detected!',
          'OS Version:'
        ],
        shouldTriggerSetup: false
      },
      {
        name: 'Workspace Path Change',
        machineConfig: {
          identifier: 'home-mbp',
          osVersion: 'darwin 24.3.0',
          shell: '/bin/zsh',
          workspacePath: '/different/path/interactive-node-network',
          nodeVersion: '16.0.0'
        },
        expectedOutput: [
          '⚠️ Environment changes detected!',
          'Workspace:'
        ],
        shouldTriggerSetup: false
      }
    ];
  }

  private mockConsoleLog() {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    console.log = (...args: any[]) => {
      this.outputLog.push(args.join(' '));
    };
    
    console.error = (...args: any[]) => {
      this.outputLog.push(args.join(' '));
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }

  private async runTest(testCase: TestCase): Promise<boolean> {
    this.outputLog = [];
    const restoreConsole = this.mockConsoleLog();

    try {
      // Mock machine config
      const config = JSON.parse(this.originalConfig);
      if (testCase.shouldTriggerSetup) {
        delete config.machines[testCase.machineConfig.identifier];
      } else {
        config.machines[testCase.machineConfig.identifier] = {
          ...testCase.machineConfig,
          requiredTools: ['node', 'npm', 'git', 'typescript', 'homebrew'],
          configurations: {},
          environmentVariables: { required: [], optional: [] },
          lastVerified: new Date().toISOString()
        };
      }
      writeFileSync('.machine-config.json', JSON.stringify(config, null, 2));

      // Run machine environment check
      await checkMachineEnvironment();

      // Verify expected output
      const success = testCase.expectedOutput.every(expected =>
        this.outputLog.some(log => log.includes(expected))
      );

      if (!success) {
        console.error('\nTest failed:', testCase.name);
        console.error('Expected output containing:', testCase.expectedOutput);
        console.error('Got:', this.outputLog);
      }

      return success;
    } catch (error) {
      console.error('\nTest error:', testCase.name, error);
      return false;
    } finally {
      restoreConsole();
      // Restore original config
      writeFileSync('.machine-config.json', this.originalConfig);
    }
  }

  public async runAllTests(): Promise<void> {
    console.log('🧪 Running machine detection tests...\n');
    
    let passed = 0;
    let failed = 0;

    for (const testCase of this.testCases) {
      process.stdout.write(`Running test: ${testCase.name}... `);
      
      const success = await this.runTest(testCase);
      
      if (success) {
        process.stdout.write('✅\n');
        passed++;
      } else {
        process.stdout.write('❌\n');
        failed++;
      }
    }

    console.log('\nTest Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Total: ${this.testCases.length}`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const tests = new MachineDetectionTests();
  tests.runAllTests().catch(console.error);
}

export const machineTests = new MachineDetectionTests(); 