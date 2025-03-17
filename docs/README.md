# Project Documentation

This directory contains the project's documentation, organized for easy navigation and maintenance.

## Quick Links

1. [Project Rules](../RULES.md) - Main project rules and guidelines (root level)
2. [Session Management](./sessions/README.md) - Current development sessions and context
3. [Development Guide](./guides/development-guide.md) - Development workflow and standards
4. [Cursor Setup](./guides/cursor-setup.md) - AI assistant interaction guidelines
5. [Human SOP](./guides/SOP-human.md) - Human developer procedures
6. [AI SOP](./guides/SOP-ai.md) - AI assistant procedures

## Documentation Structure

```
docs/
├── README.md (this file)
├── guides/           # User-facing documentation
│   ├── cursor-setup.md
│   ├── development-guide.md
│   ├── SOP-human.md
│   ├── SOP-ai.md
│   └── ...
├── reference/        # Reference materials
│   ├── glossary.md
│   └── troubleshooting.md
├── sessions/         # Session tracking
│   └── README.md
└── technical/        # Technical documentation
    ├── deployment.md
    └── performance.md
```

## Documentation Types

### 1. Rules and Guidelines
- Main rules file: `../////RULES.md` (root level)
- Contains all project rules and guidelines
- Primary reference for AI assistants and developers

### 2. Session Management
- Location: `./sessions/README.md`
- Tracks current development sessions
- Maintains project context and history

### 3. Guides
- Location: `./guides/`
- User-facing documentation
- Setup instructions and workflows
- Best practices and standards
- Standard Operating Procedures (SOPs)
  - Human developer procedures
  - AI assistant procedures

### 4. Reference Materials
- Location: `./reference/`
- Glossary and terminology
- Troubleshooting guides
- Common solutions

### 5. Technical Documentation
- Location: `./technical/`
- Implementation details
- Performance guidelines
- Deployment procedures

## Using This Documentation

### For AI Assistants
1. Start with `../////RULES.md` (root level)
2. Check `./sessions/README.md` for context
3. Review relevant section docs based on task

### For Developers
1. Begin with `./guides/development-guide.md`
2. Reference `./reference/` for common issues
3. Check `./technical/` for implementation details

## Maintenance

1. **Regular Tasks**
   ```bash
   # Check documentation health
   npm run docs:check
   
   # Update diagrams
   npm run generate-diagrams
   
   # Full documentation update
   npm run docs:update
   ```

2. **Documentation Updates**
   - Keep cross-references current
   - Update session notes regularly
   - Maintain documentation health

## Getting Help

1. Check the [Glossary](./reference/glossary.md)
2. Review [Troubleshooting](./reference/troubleshooting.md)
3. See [Development Guide](./guides/development-guide.md)
4. Consult [Cursor Setup](./guides/cursor-setup.md)

Remember: Documentation is a living system. Keep it updated, accurate, and useful for the team. 