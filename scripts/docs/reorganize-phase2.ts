import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { promisify } from 'util';

const globPromise = promisify(glob);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

console.log('ROOT_DIR:', ROOT_DIR);

interface FileMoveOperation {
  sourceFile: string;
  targetFile: string;
}

// Files to move to appropriate directories
const FILES_TO_MOVE: FileMoveOperation[] = [
  { sourceFile: 'docs/user-interaction.md', targetFile: 'docs/guides/user-interaction.md' },
  { sourceFile: 'docs/glossary.md', targetFile: 'docs/reference/glossary.md' },
  { sourceFile: 'docs/machine-management.md', targetFile: 'docs/technical/machine-management.md' },
  { sourceFile: 'docs/deployment.md', targetFile: 'docs/technical/deployment.md' },
  { sourceFile: 'docs/maintenance.md', targetFile: 'docs/technical/maintenance.md' },
  { sourceFile: 'docs/communication.md', targetFile: 'docs/guides/communication.md' },
  { sourceFile: 'docs/session-management.md', targetFile: 'docs/guides/session-management.md' }
];

// Files to delete (already merged into other files)
const FILES_TO_DELETE: string[] = [
  'docs/documentation-structure.md',
  'docs/documentation-best-practices.md',
  'docs/automation-rules.md',
  'docs/development-workflow.md',
  'docs/project-standards.md',
  'docs/quick-start.md',
  'docs/educational-support.md'
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

async function moveFile(operation: FileMoveOperation): Promise<void> {
  try {
    const sourcePath = path.join(ROOT_DIR, operation.sourceFile);
    const targetPath = path.join(ROOT_DIR, operation.targetFile);
    
    console.log(`Moving file: ${sourcePath} -> ${targetPath}`);
    
    // Check if source file exists
    const exists = await fileExists(operation.sourceFile);
    if (!exists) {
      console.warn(`Source file does not exist: ${sourcePath}`);
      return;
    }
    
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    await fs.mkdir(targetDir, { recursive: true });
    
    // Read source file
    const content = await fs.readFile(sourcePath, 'utf8');
    
    // Write to target file
    await fs.writeFile(targetPath, content);
    console.log(`Successfully moved file to ${targetPath}`);
    
    // Delete source file
    await fs.unlink(sourcePath);
    console.log(`Deleted source file ${sourcePath}`);
  } catch (error) {
    console.error(`Error moving file ${operation.sourceFile}:`, error);
  }
}

async function deleteFile(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    console.log(`Deleting file: ${fullPath}`);
    
    // Check if file exists
    const exists = await fileExists(filePath);
    if (!exists) {
      console.warn(`File does not exist: ${fullPath}`);
      return;
    }
    
    // Delete file
    await fs.unlink(fullPath);
    console.log(`Successfully deleted ${fullPath}`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
}

async function updateCoachGuide(): Promise<void> {
  try {
    const filePath = 'docs/guides/coach-michael-stolarz-guide.md';
    const fullPath = path.join(ROOT_DIR, filePath);
    console.log(`Updating coach guide: ${fullPath}`);
    
    // Check if file exists
    const exists = await fileExists(filePath);
    if (!exists) {
      console.warn(`Coach guide does not exist: ${fullPath}`);
      return;
    }
    
    // Read file
    let content = await fs.readFile(fullPath, 'utf8');
    
    // Update content with new structure
    content = content.replace(
      /## Key Documentation Files[\s\S]*?## Documentation Structure/m,
      `## Key Documentation Files

### 1. Root Level Documents
- [\`README.md\`](../../README.md) - Project overview, quick start, and setup instructions
- [\`CONTRIBUTING.md\`](../../CONTRIBUTING.md) - Development guidelines and documentation standards
- [\`SESSIONS.md\`](../../SESSIONS.md) - Tracks development sessions and decisions
- [\`RULES.md\`](../../RULES.md) - Core development rules and guidelines
- [\`NOTES.md\`](../../NOTES.md) - Project notes and architectural decisions

### 2. Guides
- [\`docs/guides/user-interaction.md\`](../guides/user-interaction.md) - User interaction guidelines
- [\`docs/guides/communication.md\`](../guides/communication.md) - Communication protocols
- [\`docs/guides/session-management.md\`](../guides/session-management.md) - Session handling
- [\`docs/guides/development-guide.md\`](../guides/development-guide.md) - Comprehensive development guide
- [\`docs/guides/cursor-instructions.md\`](../guides/cursor-instructions.md) - Guidelines for using Cursor AI
- [\`docs/guides/permissions-guide.md\`](../guides/permissions-guide.md) - Access and security rules

### 3. Technical Documentation
- [\`docs/technical/node-network-summary.md\`](../technical/node-network-summary.md) - Network visualization details
- [\`docs/technical/performance.md\`](../technical/performance.md) - Performance monitoring and optimization
- [\`docs/technical/machine-management.md\`](../technical/machine-management.md) - Machine configuration
- [\`docs/technical/deployment.md\`](../technical/deployment.md) - Deployment procedures
- [\`docs/technical/maintenance.md\`](../technical/maintenance.md) - Maintenance guidelines

### 4. Reference Materials
- [\`docs/reference/glossary.md\`](../reference/glossary.md) - Terms and definitions
- [\`docs/reference/troubleshooting.md\`](../reference/troubleshooting.md) - Error handling and troubleshooting

## Documentation Structure`
    );
    
    // Update file relationship diagram
    content = content.replace(
      /```mermaid[\s\S]*?```/m,
      `\`\`\`mermaid
graph TD
    %% Root Level Documents
    ROOT[Project Root] --> RULES[RULES.md]
    ROOT --> README[README.md]
    ROOT --> NOTES[NOTES.md]
    ROOT --> SESSIONS[SESSIONS.md]
    ROOT --> CONTRIBUTING[CONTRIBUTING.md]
    
    %% Main Directories
    ROOT --> DOCS[docs/]
    ROOT --> SRC[src/]
    ROOT --> SCRIPTS[scripts/]
    
    %% Documentation Directory
    DOCS --> GUIDES[guides/]
    DOCS --> TECHNICAL[technical/]
    DOCS --> REFERENCE[reference/]
    
    %% Guides
    GUIDES --> DEV_GUIDE[development-guide.md]
    GUIDES --> USER_INT[user-interaction.md]
    GUIDES --> COMM[communication.md]
    GUIDES --> SESSION_MNG[session-management.md]
    GUIDES --> COACH[coach-michael-stolarz-guide.md]
    GUIDES --> CURSOR[cursor-instructions.md]
    GUIDES --> PERMS[permissions-guide.md]
    
    %% Technical Documentation
    TECHNICAL --> NETWORK[node-network-summary.md]
    TECHNICAL --> PERF[performance.md]
    TECHNICAL --> MACHINE[machine-management.md]
    TECHNICAL --> DEPLOY[deployment.md]
    TECHNICAL --> MAINT[maintenance.md]
    
    %% Reference
    REFERENCE --> GLOSSARY[glossary.md]
    REFERENCE --> TROUBLE[troubleshooting.md]
    
    %% Source Code
    SRC --> COMPONENTS[components/]
    COMPONENTS --> INT_NODE[InteractiveNodeNetwork.tsx]
    COMPONENTS --> NET_WRAP[NodeNetworkWrapper.tsx]
    COMPONENTS --> NET_CTRL[NetworkVisualizationController.tsx]
    
    %% Scripts
    SCRIPTS --> DOC_SCRIPTS[docs/]
    SCRIPTS --> SETUP[setup-machine.ts]
    SCRIPTS --> TESTS[tests/]
    
    %% Documentation Scripts
    DOC_SCRIPTS --> LINK_CHECK[link-checker.ts]
    DOC_SCRIPTS --> LINK_FIX[link-fixer.ts]
    DOC_SCRIPTS --> REORG[reorganize.ts]
    
    %% Relationships and Dependencies
    RULES -.-> |references| DOCS
    SESSIONS -.-> |updates| DEV_GUIDE
    DOC_SCRIPTS -.-> |manages| DOCS
    SETUP -.-> |configures| MACHINE
    
    %% Styling
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef root fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef docs fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef guides fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef technical fill:#fce4ec,stroke:#c2185b,stroke-width:2px;
    classDef reference fill:#e0f7fa,stroke:#006064,stroke-width:2px;
    classDef src fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef scripts fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px;
    
    class ROOT root;
    class DOCS docs;
    class GUIDES,DEV_GUIDE,USER_INT,COMM,SESSION_MNG,COACH,CURSOR,PERMS guides;
    class TECHNICAL,NETWORK,PERF,MACHINE,DEPLOY,MAINT technical;
    class REFERENCE,GLOSSARY,TROUBLE reference;
    class SRC,COMPONENTS src;
    class SCRIPTS,DOC_SCRIPTS,SETUP,TESTS,LINK_CHECK,LINK_FIX,REORG scripts;
\`\`\``
    );
    
    // Write updated content
    await fs.writeFile(fullPath, content);
    console.log(`Successfully updated coach guide`);
  } catch (error) {
    console.error(`Error updating coach guide:`, error);
  }
}

async function updateCrossReferences(): Promise<void> {
  try {
    console.log('Updating cross-references in all Markdown files...');
    
    // Find all Markdown files
    const files = await globPromise('**/*.md', { 
      cwd: ROOT_DIR, 
      ignore: ['node_modules/**', '.git/**'] 
    }) as string[];
    
    console.log(`Found ${files.length} Markdown files to check for cross-references`);
    
    // Create a map of old paths to new paths
    const pathMap = new Map<string, string>();
    FILES_TO_MOVE.forEach(op => {
      pathMap.set(op.sourceFile, op.targetFile);
    });
    
    // Add relative path mappings
    pathMap.set('../learning/ai-interaction-patterns.md', '../guides/development-guide.md');
    pathMap.set('../learning/advanced-automation.md', '../guides/development-guide.md');
    pathMap.set('../learning/documentation-automation.md', '../guides/development-guide.md');
    pathMap.set('../learning/learning-journal.md', '../guides/development-guide.md');
    pathMap.set('../performance/monitoring.md', '../technical/performance.md');
    pathMap.set('../performance/optimization.md', '../technical/performance.md');
    pathMap.set('../performance/thresholds.md', '../technical/performance.md');
    pathMap.set('../errors/detection.md', '../reference/troubleshooting.md');
    pathMap.set('../errors/prevention.md', '../reference/troubleshooting.md');
    pathMap.set('../errors/recovery.md', '../reference/troubleshooting.md');
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(ROOT_DIR, file);
      console.log(`Checking file for cross-references: ${filePath}`);
      
      // Read file content
      let content = await fs.readFile(filePath, 'utf8');
      let contentChanged = false;
      
      // Check for each path mapping
      for (const [oldPath, newPath] of pathMap.entries()) {
        // Look for Markdown links with the old path
        const linkRegex = new RegExp(`\\[([^\\]]+)\\]\\(${oldPath.replace(/\//g, '\\/')}(#[^)]+)?\\)`, 'g');
        if (linkRegex.test(content)) {
          contentChanged = true;
          content = content.replace(linkRegex, (match, linkText, anchor) => {
            return `[${linkText}](${newPath}${anchor || ''})`;
          });
          console.log(`Updated references to ${oldPath} in ${file}`);
        }
      }
      
      // Write updated content if changed
      if (contentChanged) {
        await fs.writeFile(filePath, content);
        console.log(`Updated cross-references in ${file}`);
      }
    }
    
    console.log('Finished updating cross-references');
  } catch (error) {
    console.error('Error updating cross-references:', error);
  }
}

async function main() {
  console.log('Starting documentation reorganization phase 2...');
  try {
    // Move files to appropriate directories
    console.log('Moving files to appropriate directories...');
    for (const operation of FILES_TO_MOVE) {
      await moveFile(operation);
    }
    
    // Delete files that are no longer needed
    console.log('Deleting redundant files...');
    for (const filePath of FILES_TO_DELETE) {
      await deleteFile(filePath);
    }
    
    // Update coach guide with new structure
    console.log('Updating coach guide...');
    await updateCoachGuide();
    
    // Update cross-references in all Markdown files
    console.log('Updating cross-references...');
    await updateCrossReferences();
    
    console.log('Documentation reorganization phase 2 complete!');
  } catch (error) {
    console.error('Error during reorganization phase 2:', error);
    process.exit(1);
  }
}

// Run the main function
console.log('Running phase 2 reorganization');
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 