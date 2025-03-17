import fs from 'fs/promises';
import path from 'path';
import { constants } from 'fs';

interface BrokenLink {
    file: string;
    line: number;
    link: string;
    suggestion?: string;
}

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function findBrokenLinks(filePath: string): Promise<BrokenLink[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const brokenLinks: BrokenLink[] = [];
    
    // Regular expression to match markdown links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let match;
        while ((match = linkRegex.exec(line)) !== null) {
            const [, text, link] = match;
            
            // Skip external links and anchor links
            if (link.startsWith('http') || link.startsWith('#')) continue;
            
            const resolvedPath = path.resolve(path.dirname(filePath), link);
            const exists = await fileExists(resolvedPath);
            
            if (!exists) {
                brokenLinks.push({
                    file: filePath,
                    line: i + 1,
                    link,
                    suggestion: await findSimilarFile(resolvedPath)
                });
            }
        }
    }
    
    return brokenLinks;
}

async function findSimilarFile(brokenPath: string): Promise<string | undefined> {
    try {
        // Get the directory containing the broken link
        const dir = path.dirname(brokenPath);
        const filename = path.basename(brokenPath);
        
        // List all markdown files in the directory and its subdirectories
        const files: string[] = [];
        await listMarkdownFiles(dir, files);
        
        // Find most similar filename using Levenshtein distance
        let bestMatch = '';
        let bestDistance = Infinity;
        
        files.forEach(file => {
            const distance = levenshteinDistance(filename, path.basename(file));
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = file;
            }
        });
        
        return bestDistance < 5 ? bestMatch : undefined;
    } catch {
        return undefined;
    }
}

async function listMarkdownFiles(dir: string, files: string[]): Promise<void> {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                await listMarkdownFiles(fullPath, files);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }
    } catch {
        // Ignore errors for inaccessible directories
    }
}

function levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + substitutionCost
            );
        }
    }
    
    return matrix[b.length][a.length];
}

export async function fixLinks(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, 'utf-8');
    const brokenLinks = await findBrokenLinks(filePath);
    let newContent = content;
    let fixCount = 0;
    
    // Sort broken links in reverse order to avoid offset issues
    brokenLinks.sort((a, b) => b.line - a.line);
    
    for (const { link, suggestion } of brokenLinks) {
        if (suggestion) {
            // Calculate relative path from file to suggestion
            const relativePath = path.relative(
                path.dirname(filePath),
                suggestion
            );
            
            // Replace broken link with suggested link
            const regex = new RegExp(`\\[([^\\]]+)\\]\\(${escapeRegExp(link)}\\)`, 'g');
            newContent = newContent.replace(regex, (_, text) => `[${text}](${relativePath})`);
            fixCount++;
        }
    }
    
    if (fixCount > 0) {
        await fs.writeFile(filePath, newContent);
        return `Fixed ${fixCount} broken links in ${filePath}`;
    }
    
    return `No fixable links found in ${filePath}`;
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Only run the CLI if this is the main module
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
    const args = process.argv.slice(2);
    const fileArg = args.find(arg => arg.startsWith('--file='));
    
    if (!fileArg) {
        console.error('Please provide a file path using --file=<path>');
        process.exit(1);
    }
    
    const filePath = fileArg.split('=')[1].replace(/^"|"$/g, '');
    fixLinks(filePath)
        .then(result => console.log(result))
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
} 