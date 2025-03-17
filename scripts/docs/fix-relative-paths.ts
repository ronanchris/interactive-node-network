import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

async function fixRelativePaths() {
  // Find all markdown files
  const files = await glob('docs/**/*.md');
  let filesModified = false;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let fileModified = false;
    
    // Fix incorrect relative paths
    content = content.replace(/\.\.\.\.\//g, '../');
    content = content.replace(/\.\.\.\//g, '../');
    
    // Fix incorrect paths to learning directory
    content = content.replace(/\.\.learning\//g, '../learning/');
    
    // Fix incorrect paths to performance directory
    content = content.replace(/\.\.performance\//g, '../performance/');
    
    // Fix incorrect paths to errors directory
    content = content.replace(/\.\.errors\//g, '../errors/');
    
    // Fix incorrect paths to reference directory
    content = content.replace(/\.\.reference\//g, '../reference/');
    
    // Fix incorrect paths to technical directory
    content = content.replace(/\.\.technical\//g, '../technical/');
    
    // Fix incorrect paths to guides directory
    content = content.replace(/\.\.guides\//g, '../guides/');
    
    // Fix incorrect paths to diagrams directory
    content = content.replace(/\.\.diagrams\//g, '../diagrams/');
    
    // Fix incorrect paths to tutorials directory
    content = content.replace(/\.\.tutorials\//g, '../tutorials/');
    
    // Fix incorrect paths to best-practices directory
    content = content.replace(/\.\.best-practices\//g, '../best-practices/');
    
    // Write back if modified
    if (content !== fs.readFileSync(file, 'utf8')) {
      fs.writeFileSync(file, content);
      console.log(`Fixed paths in ${file}`);
      fileModified = true;
      filesModified = true;
    }
  }
  
  if (!filesModified) {
    console.log('No files needed path fixes');
  }
}

fixRelativePaths().catch(console.error); 