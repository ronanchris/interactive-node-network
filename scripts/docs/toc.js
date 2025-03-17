const fs = require('fs');
const path = require('path');
const marked = require('marked');

/**
 * Generate a table of contents from markdown content
 * @param {string} markdownContent - The content to generate ToC from
 * @returns {Array<{level: number, text: string, link: string}>} - ToC entries
 */
function generateToc(markdownContent) {
  const tokens = marked.lexer(markdownContent);
  const headings = tokens.filter(t => t.type === 'heading');
  
  return headings.map(h => ({
    level: h.depth,
    text: h.text,
    link: h.text.toLowerCase().replace(/[^\w]+/g, '-')
  }));
}

/**
 * Format ToC entries into markdown
 * @param {Array<{level: number, text: string, link: string}>} entries - ToC entries
 * @returns {string} - Formatted markdown ToC
 */
function formatToc(entries) {
  return entries.map(entry => {
    const indent = '  '.repeat(entry.level - 1);
    return `${indent}- [${entry.text}](#${entry.link})`;
  }).join('\n');
}

/**
 * Update or insert ToC in markdown file
 * @param {string} filePath - Path to the markdown file
 */
function updateToc(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const tocStart = '<!-- TOC -->';
  const tocEnd = '<!-- /TOC -->';
  
  const entries = generateToc(content);
  const toc = formatToc(entries);
  
  const tocContent = `${tocStart}\n${toc}\n${tocEnd}`;
  
  if (content.includes(tocStart) && content.includes(tocEnd)) {
    // Update existing ToC
    const newContent = content.replace(
      new RegExp(`${tocStart}[\\s\\S]*${tocEnd}`),
      tocContent
    );
    fs.writeFileSync(filePath, newContent);
  } else {
    // Insert new ToC after first heading
    const lines = content.split('\n');
    const firstHeadingIndex = lines.findIndex(line => line.startsWith('#'));
    
    if (firstHeadingIndex !== -1) {
      lines.splice(firstHeadingIndex + 1, 0, '', tocContent, '');
      fs.writeFileSync(filePath, lines.join('\n'));
    }
  }
}

/**
 * Process all markdown files in a directory
 * @param {string} dir - Directory to process
 */
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.md')) {
      console.log(`Processing ${fullPath}...`);
      updateToc(fullPath);
    }
  });
}

// Start processing from docs directory
const docsDir = path.join(__dirname, '../../docs');
processDirectory(docsDir);
console.log('Table of Contents generation complete!');
