# Project Documentation

This directory contains the project's documentation, rules, and best practices.

## Contents

1. [Educational Support](./educational-support.md)
2. [User Interaction](./user-interaction.md)
3. [Development Workflow](./development-workflow.md)
4. [Project Standards](./project-standards.md)
5. [Deployment](./deployment.md)
6. [Communication](./communication.md)
7. [Maintenance](./maintenance.md)
8. [Performance](./performance/README.md)
   - [Monitoring](./performance/monitoring.md)
   - [Thresholds](./performance/thresholds.md)
   - [Optimization](./performance/optimization.md)
9. [Error Handling](./errors/README.md)
   - [Detection](./errors/detection.md)
   - [Recovery](./errors/recovery.md)
   - [Prevention](./errors/prevention.md)
10. [Session Management](./session-management.md)

## Documentation Structure

### Core Files and Rationale
```
/
├── RULES.md                 # Main entry point and router (stays in root)
├── SESSIONS.md              # Active session management (stays in root)
└── docs/                    # All other documentation
    ├── README.md           # This file
    ├── learning/           # Learning documentation section
    │   ├── README.md      # Learning section overview
    │   └── learning-journal.md  # Moved from root
    ├── educational-support.md
    ├── user-interaction.md
    ├── session-management.md
    ├── performance/
    │   ├── README.md
    │   ├── monitoring.md
    │   ├── thresholds.md
    │   └── optimization.md
    └── errors/
        ├── README.md
        ├── detection.md
        ├── recovery.md
        └── prevention.md
```

### File Location Principles

1. **Root Directory Files**
   - Contains only essential project-level files
   - Files needed for immediate AI context (`RULES.md`, `SESSIONS.md`)
   - Files required for project setup (README.md, configuration files)

2. **Docs Directory Structure**
   - Contains all technical and process documentation
   - Organized by topic in subdirectories
   - Includes learning and educational materials
   - Maintains clear separation of concerns

### Rationale for Structure

1. **RULES.md in Root**
   - Primary entry point for AI assistants
   - Immediately discoverable
   - Follows project convention for critical files
   - Required for initial context loading

2. **SESSIONS.md in Root**
   - Active working file for context management
   - Frequently accessed for updates
   - Part of the operational system rather than documentation
   - Needs to be quickly accessible

3. **Learning Journal in Docs**
   - Part of broader learning documentation
   - Benefits from topic organization
   - Can be versioned with related content
   - Maintains cleaner root directory

## Automation System

### 1. Session Management
- **Automatic Initialization**
  - AI scans RULES.md and SESSIONS.md at start
  - 5-second timeout for initial scanning
  - Loads most recent context first
  - No user prompt needed

- **Memory Management**
  - Warning at 80% memory usage
  - Forces new session at 90%
  - Emergency save at 95%
  - Streams large files in 50KB chunks

### 2. Documentation Updates
- **Checksum Tracking**
  - Automatic file integrity verification
  - Updates on file modifications
  - Maintains modification history
  - Ensures documentation consistency

- **Cross-References**
  - Automatic link maintenance
  - Validates documentation connections
  - Updates related sections
  - Maintains DRY principles

### 3. Learning System
- **Opportunity Detection**
  - Monitors for new concepts
  - Identifies learning moments
  - Offers y/n documentation choice
  - Updates learning journal

- **Knowledge Integration**
  - Automatic cross-referencing
  - Updates existing documentation
  - Creates specialized docs as needed
  - Maintains knowledge connections

### 4. Command Handling
- **Execution Flow**
  - Automatic command queueing
  - User approval when required
  - Safety checks before execution
  - Automatic post-execution cleanup

- **State Management**
  - Tracks command dependencies
  - Maintains execution order
  - Handles interruptions
  - Ensures completion

## Using This Documentation

- Each section is contained in its own file for better organization
- Cross-references are maintained between related topics
- Documentation is kept up to date with project changes
- Search functionality is available through GitHub

## Best Practices

### 1. Documentation Updates
- Always update relevant sections
- Maintain cross-references
- Follow established formats
- Use provided templates

### 2. Session Management
- Start new sessions when appropriate
- Document decisions and context
- Track technical debt
- Plan next steps

### 3. Learning Opportunities
- Document new concepts
- Update learning journal
- Cross-reference documentation
- Share knowledge effectively

## Maintenance

### Regular Tasks
- Review and update documentation
- Verify cross-references
- Check file integrity
- Archive old sessions

### Emergency Procedures
- Handle interrupted sessions
- Recover from failures
- Maintain data integrity
- Resume operations safely 