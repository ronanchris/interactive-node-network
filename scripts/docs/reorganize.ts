import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

console.log('ROOT_DIR:', ROOT_DIR);

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

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    await fs.access(fullPath);
    return true;
  } catch (error) {
    return false;
  }
}

async function readFileIfExists(filePath: string): Promise<string> {
  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    console.log(`Reading file: ${fullPath}`);
    
    // Check if file exists first
    const exists = await fileExists(filePath);
    if (!exists) {
      console.warn(`File does not exist: ${fullPath}`);
      return '';
    }
    
    const content = await fs.readFile(fullPath, 'utf8');
    console.log(`Successfully read file: ${fullPath}`);
    // Remove the first heading if it exists (we'll use our own)
    return content.replace(/^#[^\n]*\n/, '').trim();
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}`, error);
    return '';
  }
}

async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = path.dirname(path.join(ROOT_DIR, filePath));
  console.log(`Ensuring directory exists: ${dir}`);
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Directory created or already exists: ${dir}`);
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error);
    throw error;
  }
}

async function mergeFiles(group: FileGroup): Promise<void> {
  console.log(`Merging files into ${group.targetFile}...`);
  
  try {
    await ensureDirectoryExists(group.targetFile);
    
    let mergedContent = group.sectionHeader || '';
    let contentAdded = false;
    
    for (const sourceFile of group.sourceFiles) {
      console.log(`Processing source file: ${sourceFile}`);
      const content = await readFileIfExists(sourceFile);
      if (content) {
        const fileName = path.basename(sourceFile, '.md');
        mergedContent += `\n## ${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
        mergedContent += content + '\n\n';
        console.log(`Added content from ${sourceFile}`);
        contentAdded = true;
      } else {
        console.log(`No content found in ${sourceFile}`);
      }
    }
    
    if (contentAdded) {
      const targetPath = path.join(ROOT_DIR, group.targetFile);
      console.log(`Writing merged content to: ${targetPath}`);
      await fs.writeFile(targetPath, mergedContent.trim() + '\n');
      console.log(`Successfully wrote to ${targetPath}`);
    } else {
      console.warn(`No content to write to ${group.targetFile}`);
    }
  } catch (error) {
    console.error(`Error merging files for ${group.targetFile}:`, error);
  }
}

async function updateReadme(): Promise<void> {
  console.log('Updating README.md...');
  
  try {
    const currentReadme = await readFileIfExists('README.md');
    let newContent = currentReadme + '\n\n';
    let contentAdded = false;
    
    for (const section of README_SECTIONS) {
      console.log(`Processing README section: ${section}`);
      const content = await readFileIfExists(section);
      if (content) {
        newContent += content + '\n\n';
        console.log(`Added content from ${section} to README`);
        contentAdded = true;
      } else {
        console.log(`No content found in ${section}`);
      }
    }
    
    if (contentAdded) {
      const targetPath = path.join(ROOT_DIR, 'README.md');
      console.log(`Writing updated README to: ${targetPath}`);
      await fs.writeFile(targetPath, newContent.trim() + '\n');
      console.log(`Successfully updated README.md`);
    } else {
      console.warn('No new content to add to README.md');
    }
  } catch (error) {
    console.error('Error updating README:', error);
  }
}

async function cleanup(): Promise<void> {
  console.log('Cleaning up old directories...');
  
  for (const dir of CLEANUP_DIRS) {
    try {
      const fullPath = path.join(ROOT_DIR, dir);
      console.log(`Checking if directory exists: ${fullPath}`);
      
      // Check if directory exists first
      const exists = await fileExists(dir);
      if (!exists) {
        console.log(`Directory does not exist, skipping: ${fullPath}`);
        continue;
      }
      
      console.log(`Attempting to remove: ${fullPath}`);
      await fs.rm(fullPath, { recursive: true, force: true });
      console.log(`Removed ${dir}`);
    } catch (error) {
      console.warn(`Warning: Could not remove ${dir}`, error);
    }
  }
}

async function main() {
  console.log('Starting documentation reorganization...');
  try {
    // Create new directory structure
    console.log('Creating new directory structure...');
    await Promise.all([
      ensureDirectoryExists('docs/guides/placeholder.md'),
      ensureDirectoryExists('docs/technical/placeholder.md'),
      ensureDirectoryExists('docs/reference/placeholder.md')
    ]);
    
    // Merge files according to plan
    console.log('Merging files according to plan...');
    for (const group of REORGANIZATION_PLAN) {
      await mergeFiles(group);
    }
    
    // Update README.md with quick start and standards
    console.log('Updating README.md...');
    await updateReadme();
    
    // Clean up old directories
    console.log('Cleaning up old directories...');
    await cleanup();
    
    console.log('Documentation reorganization complete!');
  } catch (error) {
    console.error('Error during reorganization:', error);
    process.exit(1);
  }
}

// Only run if this is the main module
console.log('import.meta.url:', import.meta.url);
console.log('__filename:', __filename);
console.log('file://${__filename}:', `file://${__filename}`);

// Always run main() for now
console.log('Running main() function');
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 