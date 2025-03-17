import fs from 'fs';
import path from 'path';

class TimestampUpdater {
  private readonly docsRoot: string;
  private readonly timestampRegex = /^> \*\*Last Updated\*\*: .*$/m;
  private readonly timestampTemplate = '> **Last Updated**: {date}';

  constructor() {
    this.docsRoot = path.resolve(__dirname, '../../docs');
  }

  private getAllMarkdownFiles(): string[] {
    const files: string[] = [];
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    };
    walk(this.docsRoot);
    return files;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private updateTimestamp(content: string): string {
    const newTimestamp = this.timestampTemplate.replace('{date}', this.formatDate(new Date()));
    
    if (this.timestampRegex.test(content)) {
      return content.replace(this.timestampRegex, newTimestamp);
    } else {
      return `${newTimestamp}\n\n${content}`;
    }
  }

  async updateTimestamps(): Promise<void> {
    const files = this.getAllMarkdownFiles();
    let updatedCount = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const updatedContent = this.updateTimestamp(content);
        
        if (content !== updatedContent) {
          fs.writeFileSync(file, updatedContent);
          console.log(`Updated timestamp in ${path.relative(this.docsRoot, file)}`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error updating ${path.relative(this.docsRoot, file)}:`, error);
      }
    }

    console.log(`\nUpdated timestamps in ${updatedCount} files`);
  }
}

// Run timestamp update
const updater = new TimestampUpdater();
updater.updateTimestamps().catch(console.error); 