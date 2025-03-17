import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

interface PackageJson {
  scripts?: {
    [key: string]: string;
  };
  devDependencies?: {
    [key: string]: string;
  };
}

class ProjectInitializer {
  private sourceDir: string;
  private targetDir: string;
  private requiredFiles = [
    'scripts/setup-machine.ts',
    'scripts/check-environment.ts',
    'scripts/fix-links.ts',
    'scripts/docs/link-checker.ts',
    'scripts/docs/link-fixer.ts',
    'scripts/docs/reorganize.ts',
    'scripts/docs/diagrams.ts',
    'scripts/docs/coverage.ts'
  ];

  private directories = [
    'scripts/docs',
    'scripts/tests',
    'docs',
    'docs/learning',
    'docs/sessions',
    'docs/diagrams'
  ];

  private requiredScripts = {
    'check-env': 'ts-node scripts/check-environment.ts',
    'setup-machine': 'ts-node scripts/setup-machine.ts',
    'verify-machine': 'ts-node scripts/setup-machine.ts verify',
    'test:machine-detection': 'ts-node scripts/tests/test-machine-detection.ts',
    'init:machine-management': 'ts-node scripts/init-machine-management.ts',
    'fix-links': 'ts-node scripts/fix-links.ts',
    'docs:check-links': 'node --loader ts-node/esm scripts/docs/link-checker.ts',
    'docs:fix-links': 'node --loader ts-node/esm scripts/docs/link-fixer.ts',
    'docs:reorganize': 'node --loader ts-node/esm scripts/docs/reorganize.ts',
    'docs:coverage': 'node --loader ts-node/esm scripts/docs/coverage.ts',
    'generate-diagrams': 'node --import \'data:text/javascript,import { register } from \"node:module\"; import { pathToFileURL } from \"node:url\"; register(\"ts-node/esm\", pathToFileURL(\"./\"));\' scripts/docs/diagrams.ts'
  };

  constructor(targetDir: string) {
    this.sourceDir = process.cwd();
    this.targetDir = resolve(targetDir);
  }

  private ensureDirectories(): void {
    for (const dir of this.directories) {
      const fullPath = join(this.targetDir, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    }
  }

  private copyFiles(): void {
    for (const file of this.requiredFiles) {
      const sourcePath = join(this.sourceDir, file);
      const targetPath = join(this.targetDir, file);

      try {
        copyFileSync(sourcePath, targetPath);
        console.log(`✅ Copied: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to copy ${file}:`, error);
      }
    }
  }

  private updatePackageJson(): void {
    const packageJsonPath = join(this.targetDir, 'package.json');
    
    try {
      const packageJson: PackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      // Add all required scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        ...this.requiredScripts
      };

      // Add required dependencies
      const requiredDeps = {
        'typescript': '^5.0.0',
        'ts-node': '^10.9.0',
        '@types/node': '^18.0.0'
      };

      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        ...requiredDeps
      };

      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Updated package.json');
    } catch (error) {
      console.error('❌ Failed to update package.json:', error);
    }
  }

  private installDependencies(): void {
    try {
      console.log('Installing dependencies...');
      execSync('npm install', { cwd: this.targetDir, stdio: 'inherit' });
      console.log('✅ Installed dependencies');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error);
    }
  }

  private initializeGitIgnore(): void {
    const gitignorePath = join(this.targetDir, '.gitignore');
    const gitignoreContent = `
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# System
.DS_Store
Thumbs.db
    `.trim();

    try {
      writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ Created .gitignore');
    } catch (error) {
      console.error('❌ Failed to create .gitignore:', error);
    }
  }

  public async initialize(): Promise<void> {
    console.log(`🚀 Initializing project in ${this.targetDir}\n`);

    this.ensureDirectories();
    this.copyFiles();
    this.updatePackageJson();
    this.installDependencies();
    this.initializeGitIgnore();

    console.log('\n✨ Project initialized successfully!');
    console.log('\nNext steps:');
    console.log('1. Review docs/quick-start.md for setup instructions');
    console.log('2. Customize .machine-config.json for your environment');
    console.log('3. Update documentation with your project details');
    console.log('4. Run npm run setup-machine to configure your environment');
    console.log('5. Start your first development session with npm run docs:session');
  }
}

// Run initialization if called directly
if (require.main === module) {
  const targetDir = process.argv[2] || '.';
  const initializer = new ProjectInitializer(targetDir);
  initializer.initialize().catch(console.error);
}

export const projectInit = ProjectInitializer; 