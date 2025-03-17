import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import { readFileSync, writeFileSync, statSync, readdirSync, Stats } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DirectoryMap {
  name: string;
  type: 'file' | 'directory';
  children?: DirectoryMap[];
  size?: number;
  lastModified?: Date;
}

interface DiagramConfig {
  excludeDirs: string[];
  maxDepth: number;
  fileTypes: string[];
}

/**
 * Convert fs.Stats to our own interface to avoid deprecation
 */
function getFileStats(stats: Stats): Pick<DirectoryMap, 'size' | 'lastModified'> {
  return {
    size: stats.size,
    lastModified: stats.mtime
  };
}

/**
 * Generate a directory tree structure
 */
function generateDirectoryTree(
  rootDir: string,
  config: DiagramConfig,
  depth: number = 0
): DirectoryMap | null {
  const name = basename(rootDir);
  
  // Skip excluded directories
  if (config.excludeDirs.includes(name)) {
    return null;
  }
  
  // Respect max depth
  if (depth > config.maxDepth) {
    return null;
  }
  
  const stats = statSync(rootDir);
  const fileStats = getFileStats(stats);
  
  if (stats.isFile()) {
    // Only include specified file types
    if (!config.fileTypes.some(type => rootDir.endsWith(type))) {
      return null;
    }
    
    return {
      name,
      type: 'file',
      ...fileStats
    };
  }
  
  if (stats.isDirectory()) {
    const children: DirectoryMap[] = [];
    
    readdirSync(rootDir)
      .map(child => generateDirectoryTree(
        join(rootDir, child),
        config,
        depth + 1
      ))
      .filter((item): item is DirectoryMap => item !== null)
      .forEach(item => children.push(item));
    
    return {
      name,
      type: 'directory',
      children,
      lastModified: fileStats.lastModified
    };
  }
  
  return null;
}

/**
 * Generate Mermaid nodes from directory tree
 */
function generateMermaidNodes(
  tree: DirectoryMap,
  prefix: string = ''
): string[] {
  const nodes: string[] = [];
  const id = `${prefix}${tree.name}`;
  
  // Add current node
  nodes.push(`  ${id}["${tree.name}"]`);
  
  // Add child nodes
  if (tree.children) {
    tree.children.forEach((child, index) => {
      const childPrefix = `${prefix}${index}`;
      nodes.push(...generateMermaidNodes(child, childPrefix));
    });
  }
  
  return nodes;
}

/**
 * Generate Mermaid links from directory tree
 */
function generateMermaidLinks(
  tree: DirectoryMap,
  prefix: string = ''
): string[] {
  const links: string[] = [];
  const id = `${prefix}${tree.name}`;
  
  // Add links to children
  if (tree.children) {
    tree.children.forEach((child, index) => {
      const childPrefix = `${prefix}${index}`;
      const childId = `${childPrefix}${child.name}`;
      links.push(`  ${id} --> ${childId}`);
      links.push(...generateMermaidLinks(child, childPrefix));
    });
  }
  
  return links;
}

/**
 * Generate a Mermaid diagram from directory tree
 */
function generateMermaidDiagram(tree: DirectoryMap): string {
  const nodes = generateMermaidNodes(tree);
  const links = generateMermaidLinks(tree);
  
  return [
    '```mermaid',
    'graph TD',
    ...nodes,
    ...links,
    '```'
  ].join('\n');
}

/**
 * Generate documentation relationship diagram
 */
function generateDocRelationships(docsDir: string): string {
  const relationships: string[] = [];
  
  // Scan markdown files for links
  function scanFile(filePath: string) {
    const content = readFileSync(filePath, 'utf8');
    const matches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
    
    for (const match of matches) {
      const [, text, link] = match;
      if (link.endsWith('.md')) {
        const source = basename(filePath, '.md');
        const target = basename(link, '.md');
        relationships.push(`  ${source} --> ${target}`);
      }
    }
  }
  
  // Process all markdown files
  function processDir(dir: string) {
    readdirSync(dir).forEach(file => {
      const fullPath = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        processDir(fullPath);
      } else if (file.endsWith('.md')) {
        scanFile(fullPath);
      }
    });
  }
  
  processDir(docsDir);
  
  return [
    '```mermaid',
    'graph TD',
    ...relationships,
    '```'
  ].join('\n');
}

/**
 * Main function to generate all diagrams
 */
async function generateDiagrams() {
  const config: DiagramConfig = {
    excludeDirs: ['node_modules', '.git', 'dist'],
    maxDepth: 4,
    fileTypes: ['.md', '.ts', '.tsx', '.js', '.jsx']
  };
  
  // Generate project structure diagram
  const projectRoot = join(__dirname, '../../');
  const projectTree = generateDirectoryTree(projectRoot, config);
  if (projectTree) {
    const structureDiagram = generateMermaidDiagram(projectTree);
    writeFileSync(
      join(projectRoot, 'docs/diagrams/project-structure.md'),
      structureDiagram
    );
  }
  
  // Generate documentation relationships diagram
  const docsDir = join(projectRoot, 'docs');
  const relationshipsDiagram = generateDocRelationships(docsDir);
  writeFileSync(
    join(projectRoot, 'docs/diagrams/doc-relationships.md'),
    relationshipsDiagram
  );
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    diagrams: {
      structure: 'docs/diagrams/project-structure.md',
      relationships: 'docs/diagrams/doc-relationships.md'
    }
  };
  
  writeFileSync(
    join(projectRoot, 'diagram-report.json'),
    JSON.stringify(report, null, 2)
  );
}

// Run diagram generation
generateDiagrams().catch(console.error);
