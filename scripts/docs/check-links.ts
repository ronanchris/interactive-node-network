import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

interface LinkIssue {
  file: string;
  line: number;
  link: string;
  issue: string;
}

async function checkLinks(): Promise<void> {
  const issues: LinkIssue[] = [];
  const markdownFiles = await glob('docs/**/*.md');
  
  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    // Check for relative links
    const relativeLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = relativeLinkRegex.exec(content)) !== null) {
      const [fullMatch, text, link] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      // Skip external links
      if (link.startsWith('http://') || link.startsWith('https://')) {
        continue;
      }
      
      // Check if the link is valid
      const targetPath = path.resolve(path.dirname(file), link);
      
      if (!fs.existsSync(targetPath)) {
        issues.push({
          file,
          line: lineNumber,
          link,
          issue: 'Target file does not exist'
        });
      }
    }
  }
  
  // Report issues
  if (issues.length > 0) {
    console.error('\nLink Checker Results:');
    console.error('=====================');
    console.error(`Found ${issues.length} issues in ${markdownFiles.length} files\n`);
    
    issues.forEach(issue => {
      console.error(`File: ${issue.file}`);
      console.error(`Line: ${issue.line}`);
      console.error(`Link: ${issue.link}`);
      console.error(`Issue: ${issue.issue}`);
      console.error('---------------------');
    });
    
    process.exit(1);
  } else {
    console.log('\nLink Checker Results:');
    console.log('=====================');
    console.log(`No issues found in ${markdownFiles.length} files`);
  }
}

checkLinks().catch(error => {
  console.error('Error checking links:', error);
  process.exit(1);
}); 