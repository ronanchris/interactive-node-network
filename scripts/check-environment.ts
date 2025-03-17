import { execSync } from 'child_process';
import { platform, arch, release, totalmem } from 'os';
import { readFileSync } from 'fs';

interface VersionRequirement {
  name: string;
  command: string;
  minVersion: string;
  optional?: boolean;
}

interface SystemRequirement {
  name: string;
  check: () => boolean;
  message: string;
  optional?: boolean;
}

const REQUIRED_TOOLS: VersionRequirement[] = [
  {
    name: 'Node.js',
    command: 'node --version',
    minVersion: '16.0.0'
  },
  {
    name: 'npm',
    command: 'npm --version',
    minVersion: '6.0.0'
  },
  {
    name: 'Git',
    command: 'git --version',
    minVersion: '2.0.0'
  },
  {
    name: 'TypeScript',
    command: 'tsc --version',
    minVersion: '4.0.0'
  },
  {
    name: 'Homebrew',
    command: 'brew --version',
    minVersion: '3.0.0',
    optional: true
  }
];

const SYSTEM_REQUIREMENTS: SystemRequirement[] = [
  {
    name: 'Operating System',
    check: () => platform() === 'darwin' && parseFloat(release()) >= 24.3,
    message: 'macOS 24.3.0 or later required'
  },
  {
    name: 'Architecture',
    check: () => ['arm64', 'x64'].includes(arch()),
    message: 'ARM64 or x86_64 architecture required'
  },
  {
    name: 'Memory',
    check: () => totalmem() >= 8 * 1024 * 1024 * 1024, // 8GB
    message: 'Minimum 8GB RAM recommended'
  }
];

function compareVersions(version1: string, version2: string): number {
  const v1 = version1.replace(/[^0-9.]/g, '').split('.').map(Number);
  const v2 = version2.replace(/[^0-9.]/g, '').split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;
    if (num1 !== num2) return num1 - num2;
  }
  return 0;
}

function checkTool(requirement: VersionRequirement): boolean {
  try {
    const version = execSync(requirement.command).toString().trim();
    const meetsVersion = compareVersions(version, requirement.minVersion) >= 0;
    
    console.log(`${requirement.name}:`);
    console.log(`  Required: >=${requirement.minVersion}`);
    console.log(`  Installed: ${version}`);
    console.log(`  Status: ${meetsVersion ? '✅ Pass' : '❌ Fail'}`);
    
    return meetsVersion || !!requirement.optional;
  } catch (error) {
    console.log(`${requirement.name}:`);
    console.log(`  Status: ❌ Not installed`);
    return !!requirement.optional;
  }
}

function checkSystem(requirement: SystemRequirement): boolean {
  const passes = requirement.check();
  
  console.log(`${requirement.name}:`);
  console.log(`  Required: ${requirement.message}`);
  console.log(`  Status: ${passes ? '✅ Pass' : '❌ Fail'}`);
  
  return passes || !!requirement.optional;
}

function checkDependencies(): boolean {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    console.log('\nChecking package.json dependencies...');
    for (const [pkg, version] of Object.entries(dependencies)) {
      console.log(`${pkg}: ${version}`);
    }
    return true;
  } catch (error) {
    console.log('❌ Error reading package.json');
    return false;
  }
}

function main() {
  console.log('Checking development environment...\n');
  
  console.log('System Requirements:');
  const systemResults = SYSTEM_REQUIREMENTS.map(checkSystem);
  
  console.log('\nRequired Tools:');
  const toolResults = REQUIRED_TOOLS.map(checkTool);
  
  const dependenciesResult = checkDependencies();
  
  const allPassed = [...systemResults, ...toolResults, dependenciesResult].every(Boolean);
  
  console.log('\nOverall Status:', allPassed ? '✅ All checks passed' : '❌ Some checks failed');
  
  process.exit(allPassed ? 0 : 1);
}

main(); 