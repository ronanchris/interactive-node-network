import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

interface FileGroup {
  targetFile: string;
  sourceFiles: string[];
  sectionHeader?: string;
}

const REORGANIZATION_PLAN: FileGroup[] = [
  {
    targetFile: 'CONTRIBUTING.md',
    sourceFiles: [
      'docs/documentation-structure.md',
      'docs/documentation-best-practices.md',
      'docs/automation-rules.md',
      'docs/development-workflow.md',
      'docs/project-standards.md'
    ],
    sectionHeader: '# Contributing to Interactive Node Network\n\n'
  },
  {
    targetFile: 'docs/guides/development-guide.md',
    sourceFiles: [
      'docs/learning/ai-interaction-patterns.md',
      'docs/learning/advanced-automation.md',
      'docs/learning/documentation-automation.md',
      'docs/educational-support.md'
    ],
    sectionHeader: '# Development Guide\n\n'
  },
  {
    targetFile: 'docs/technical/performance.md',
    sourceFiles: [
      'docs/performance/README.md',
      'docs/performance/monitoring.md',
      'docs/performance/optimization.md',
      'docs/performance/thresholds.md'
    ],
    sectionHeader: '# Performance Guide\n\n'
  },
  {
    targetFile: 'docs/reference/troubleshooting.md',
    sourceFiles: [
      'docs/errors/README.md',
      'docs/errors/detection.md',
      'docs/errors/prevention.md',
      'docs/errors/recovery.md'
    ],
    sectionHeader: '# Troubleshooting Guide\n\n'
  }
];

// Files to be moved to README.md
const README_SECTIONS: string[] = [
  'docs/quick-start.md',
  'docs/project-standards.md'
];

// Directories to be removed after merging
const CLEANUP_DIRS: string[] = [
  'docs/diagrams',
  'docs/sessions',
  'docs/errors',
  'docs/performance',
  'docs/learning'
];

async function readFileIfExists(filePath: string): Promise<string> {
  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    const content = await fs.readFile(fullPath, 'utf8');
    // Remove the first heading if it exists (we'll use our own)
    return content.replace(/^#[^\n]*\n/, '').trim();
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}`);
    return '';
  }
}

async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = path.dirname(path.join(ROOT_DIR, filePath));
  await fs.mkdir(dir, { recursive: true });
}

async function mergeFiles(group: FileGroup): Promise<void> {
  console.log(`Merging files into ${group.targetFile}...`);
  
  await ensureDirectoryExists(group.targetFile);
  
  let mergedContent = group.sectionHeader || '';
  
  for (const sourceFile of group.sourceFiles) {
    const content = await readFileIfExists(sourceFile);
    if (content) {
      const fileName = path.basename(sourceFile, '.md');
      mergedContent += `\n## ${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
      mergedContent += content + '\n\n';
    }
  }
  
  await fs.writeFile(
    path.join(ROOT_DIR, group.targetFile),
    mergedContent.trim() + '\n'
  );
}

async function updateReadme(): Promise<void> {
  console.log('Updating README.md...');
  
  const currentReadme = await readFileIfExists('README.md');
  let newContent = currentReadme + '\n\n';
  
  for (const section of README_SECTIONS) {
    const content = await readFileIfExists(section);
    if (content) {
      newContent += content + '\n\n';
    }
  }
  
  await fs.writeFile(
    path.join(ROOT_DIR, 'README.md'),
    newContent.trim() + '\n'
  );
}

async function cleanup(): Promise<void> {
  console.log('Cleaning up old directories...');
  
  for (const dir of CLEANUP_DIRS) {
    try {
      await fs.rm(path.join(ROOT_DIR, dir), { recursive: true, force: true });
      console.log(`Removed ${dir}`);
    } catch (error) {
      console.warn(`Warning: Could not remove ${dir}`);
    }
  }
}

async function main() {
  try {
    // Create new directory structure
    await Promise.all([
      fs.mkdir(path.join(ROOT_DIR, 'docs/guides'), { recursive: true }),
      fs.mkdir(path.join(ROOT_DIR, 'docs/technical'), { recursive: true }),
      fs.mkdir(path.join(ROOT_DIR, 'docs/reference'), { recursive: true })
    ]);
    
    // Merge files according to plan
    for (const group of REORGANIZATION_PLAN) {
      await mergeFiles(group);
    }
    
    // Update README.md with quick start and standards
    await updateReadme();
    
    // Clean up old directories
    await cleanup();
    
    console.log('Documentation reorganization complete!');
  } catch (error) {
    console.error('Error during reorganization:', error);
    process.exit(1);
  }
}

// Only run if this is the main module
if (import.meta.url === `file://${__filename}`) {
  main();
} 