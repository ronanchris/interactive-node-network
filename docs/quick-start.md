# Quick Start Guide

This guide will help you set up both the machine management system and documentation system in your project.

## Installation

1. Create a new directory for your project (if not already created):
   ```bash
   mkdir my-project
   cd my-project
   ```

2. Initialize your project:
   ```bash
   npm init -y
   ```

3. Copy the initialization script:
   ```bash
   mkdir -p scripts
   cp /path/to/init-machine-management.ts scripts/
   ```

4. Install required dependencies:
   ```bash
   npm install -D typescript ts-node @types/node
   ```

5. Run the initialization script:
   ```bash
   npx ts-node scripts/init-machine-management.ts
   ```

## Project Structure

After initialization, your project will have the following structure:
```
.
├── docs/
│   ├── README.md                 # Project documentation overview
│   ├── quick-start.md           # This guide
│   ├── automation-rules.md      # Documentation automation rules
│   ├── glossary.md             # Project glossary
│   ├── machine-management.md   # Machine management documentation
│   ├── learning/              # Learning documentation
│   │   ├── README.md         # Learning overview
│   │   └── learning-journal.md # Captured learnings
│   ├── sessions/             # Session documentation
│   │   └── README.md        # Sessions overview
│   └── diagrams/            # Generated diagrams
├── scripts/
│   ├── docs/
│   │   ├── automation.ts    # Documentation automation
│   │   └── diagrams.ts     # Diagram generation
│   ├── setup-machine.ts     # Machine setup script
│   └── tests/
│       └── test-machine-detection.ts # Machine detection tests
├── .machine-config.json      # Machine configuration
├── .gitignore               # Git ignore rules
├── SESSIONS.md              # Session history
└── package.json             # Project configuration
```

## Available Commands

### Machine Management
- `npm run setup-machine` - Set up your development environment
- `npm run verify-machine` - Verify your machine configuration
- `npm run test:machine-detection` - Run machine detection tests

### Documentation
- `npm run docs:check` - Check documentation health
- `npm run docs:learn` - Add a learning entry
- `npm run docs:session` - Update session notes
- `npm run docs:update` - Update all documentation
- `npm run generate-diagrams` - Generate documentation diagrams

## First-Time Setup

1. Review and customize `.machine-config.json`:
   ```json
   {
     "identifier": "your-machine-name",
     "osVersion": "your-os-version",
     "shell": "your-shell-path",
     "workspacePath": "your-workspace-path",
     // ... other configurations
   }
   ```

2. Run the machine setup:
   ```bash
   npm run setup-machine
   ```

3. Initialize core documentation:
   - Update `docs/README.md` with your project overview
   - Review and customize `docs/automation-rules.md`
   - Start your glossary in `docs/glossary.md`

4. Start your first development session:
   ```bash
   npm run docs:session
   ```

## Best Practices

### Machine Management
1. Always run `verify-machine` when switching development machines
2. Keep `.machine-config.json` updated with your latest requirements
3. Document machine-specific setup steps in `docs/machine-management.md`

### Documentation
1. Use `docs:learn` to capture important learnings
2. Start each development session with `docs:session`
3. Keep the glossary updated with new terms
4. Generate diagrams when documentation structure changes
5. Review session notes periodically for insights

## Maintenance

1. Regular health checks:
   ```bash
   npm run docs:check
   ```

2. Update documentation when:
   - Starting a new development session
   - Adding new features or components
   - Making significant architectural changes
   - Learning something new about the project

3. Keep dependencies updated:
   ```bash
   npm update
   ```

## Getting Help

1. Check the following resources:
   - `docs/machine-management.md` for machine setup issues
   - `docs/automation-rules.md` for documentation guidelines
   - Session notes for historical context
   - Learning journal for past solutions

2. Common issues and solutions are documented in:
   - `docs/learning/learning-journal.md`
   - Individual session notes

## Moving to a New Project

To reuse this setup in a new project:

1. Copy the initialization script:
   ```bash
   mkdir -p new-project/scripts
   cp scripts/init-machine-management.ts new-project/scripts/
   ```

2. Initialize the new project:
   ```bash
   cd new-project
   npm init -y
   npx ts-node scripts/init-machine-management.ts
   ```

3. Customize for the new project:
   - Update project-specific details in documentation
   - Modify machine requirements as needed
   - Add project-specific scripts and automation

## Next Steps

1. Review the complete documentation in `docs/README.md`
2. Set up your development environment
3. Start your first development session
4. Begin documenting your project journey

Remember: The documentation system is designed to evolve with your project. Keep it updated and it will serve as a valuable resource throughout your development process. 