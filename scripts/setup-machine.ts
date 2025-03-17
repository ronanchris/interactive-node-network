import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { platform, release, homedir } from 'os';
import { join } from 'path';

interface MachineConfig {
  identifier: string;
  osVersion: string;
  shell: string;
  workspacePath: string;
  nodeVersion: string;
  requiredTools: string[];
  configurations: {
    [key: string]: {
      type?: string;
      configFile?: string;
      required: boolean;
      manager?: string;
      version?: string;
      name?: string;
    };
  };
  environmentVariables: {
    required: string[];
    optional: string[];
  };
  lastVerified: string;
}

interface ConfigFile {
  machines: {
    [key: string]: MachineConfig;
  };
  shared: {
    requiredFiles: string[];
    syncExclude: string[];
  };
}

class MachineSetup {
  private config: ConfigFile;
  private machineId: string;
  private currentMachineInfo: Partial<MachineConfig>;

  constructor() {
    this.config = JSON.parse(readFileSync('.machine-config.json', 'utf8'));
    this.machineId = this.generateMachineId();
    this.currentMachineInfo = this.getCurrentMachineInfo();
  }

  private generateMachineId(): string {
    const hostname = execSync('hostname').toString().trim();
    return `${hostname}-${platform()}`;
  }

  private getCurrentMachineInfo(): Partial<MachineConfig> {
    return {
      identifier: this.machineId,
      osVersion: `${platform()} ${release()}`,
      shell: process.env.SHELL || '',
      workspacePath: process.cwd(),
      nodeVersion: process.version.replace('v', '')
    };
  }

  public isNewMachine(): boolean {
    return !this.config.machines[this.machineId];
  }

  public hasEnvironmentChanged(): boolean {
    const storedMachine = this.config.machines[this.machineId];
    if (!storedMachine) return true;

    const changes: string[] = [];
    
    if (storedMachine.osVersion !== this.currentMachineInfo.osVersion) {
      changes.push(`OS Version: ${storedMachine.osVersion} -> ${this.currentMachineInfo.osVersion}`);
    }
    if (storedMachine.shell !== this.currentMachineInfo.shell) {
      changes.push(`Shell: ${storedMachine.shell} -> ${this.currentMachineInfo.shell}`);
    }
    if (storedMachine.workspacePath !== this.currentMachineInfo.workspacePath) {
      changes.push(`Workspace: ${storedMachine.workspacePath} -> ${this.currentMachineInfo.workspacePath}`);
    }
    if (storedMachine.nodeVersion !== this.currentMachineInfo.nodeVersion) {
      changes.push(`Node Version: ${storedMachine.nodeVersion} -> ${this.currentMachineInfo.nodeVersion}`);
    }

    if (changes.length > 0) {
      console.log('Environment changes detected:');
      changes.forEach(change => console.log(`- ${change}`));
      return true;
    }

    return false;
  }

  private async installHomebrew(): Promise<void> {
    try {
      execSync('which brew');
    } catch {
      console.log('Installing Homebrew...');
      execSync('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    }
  }

  private async installNode(): Promise<void> {
    try {
      // Install nvm if not present
      try {
        execSync('which nvm');
      } catch {
        console.log('Installing nvm...');
        execSync('curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash');
      }

      // Install required Node version
      const version = this.config.machines[this.machineId]?.nodeVersion || '16.0.0';
      console.log(`Installing Node.js ${version}...`);
      execSync(`nvm install ${version}`);
      execSync(`nvm use ${version}`);
    } catch (error) {
      console.error('Error installing Node:', error);
      throw error;
    }
  }

  private async setupGit(): Promise<void> {
    try {
      // Check if git is installed
      execSync('which git');
    } catch {
      console.log('Installing Git...');
      execSync('brew install git');
    }

    // Setup git config if needed
    try {
      execSync('git config --global user.name');
      execSync('git config --global user.email');
    } catch {
      console.log('Please configure Git:');
      const name = execSync('read -p "Enter your name: " && echo $REPLY').toString().trim();
      const email = execSync('read -p "Enter your email: " && echo $REPLY').toString().trim();
      
      execSync(`git config --global user.name "${name}"`);
      execSync(`git config --global user.email "${email}"`);
    }
  }

  private async setupShell(): Promise<void> {
    const shellConfig = this.config.machines[this.machineId]?.configurations.shell;
    if (!shellConfig) return;

    const rcFile = shellConfig.configFile?.replace('~', homedir());
    if (!rcFile) return;

    // Add required configurations
    const configs = [
      'export NVM_DIR="$HOME/.nvm"',
      '[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"',
      '[ -s "$NVM_DIR/bash_completion" ] && \\. "$NVM_DIR/bash_completion"'
    ];

    let content = '';
    try {
      content = readFileSync(rcFile, 'utf8');
    } catch {
      console.log(`Creating ${rcFile}...`);
    }

    for (const config of configs) {
      if (!content.includes(config)) {
        content += `\n${config}`;
      }
    }

    writeFileSync(rcFile, content);
  }

  private async verifyEnvironment(): Promise<boolean> {
    try {
      const tools = this.config.machines[this.machineId]?.requiredTools || [];
      for (const tool of tools) {
        try {
          execSync(`which ${tool}`);
          console.log(`✅ ${tool} is installed`);
        } catch {
          console.error(`❌ ${tool} is not installed`);
          return false;
        }
      }

      // Verify Node.js version
      const currentNode = execSync('node --version').toString().trim();
      const requiredNode = this.config.machines[this.machineId]?.nodeVersion;
      if (currentNode !== requiredNode) {
        console.error(`❌ Node.js version mismatch. Required: ${requiredNode}, Current: ${currentNode}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying environment:', error);
      return false;
    }
  }

  public async setup(): Promise<void> {
    console.log(`Setting up machine: ${this.machineId}`);

    if (this.isNewMachine()) {
      console.log('⚠️ New machine detected! Starting fresh setup...');
    } else if (this.hasEnvironmentChanged()) {
      console.log('⚠️ Environment changes detected! Verifying setup...');
    }

    // Install basic tools
    await this.installHomebrew();
    await this.installNode();
    await this.setupGit();
    await this.setupShell();

    // Verify environment
    const verified = await this.verifyEnvironment();
    if (verified) {
      console.log('✅ Machine setup complete');
      
      // Update machine config with current info
      this.config.machines[this.machineId] = {
        ...this.currentMachineInfo,
        requiredTools: this.config.machines[this.machineId]?.requiredTools || ['node', 'npm', 'git', 'typescript', 'homebrew'],
        configurations: this.config.machines[this.machineId]?.configurations || {},
        environmentVariables: this.config.machines[this.machineId]?.environmentVariables || { required: [], optional: [] },
        lastVerified: new Date().toISOString()
      } as MachineConfig;
      
      writeFileSync('.machine-config.json', JSON.stringify(this.config, null, 2));
    } else {
      console.error('❌ Machine setup incomplete. Please resolve issues and try again.');
    }
  }

  public async verify(): Promise<boolean> {
    return this.verifyEnvironment();
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const setup = new MachineSetup();
  
  if (args[0] === 'verify') {
    setup.verify().then(verified => {
      process.exit(verified ? 0 : 1);
    });
  } else {
    setup.setup().catch(error => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
  }
}

export const machineSetup = new MachineSetup(); 