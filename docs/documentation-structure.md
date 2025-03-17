# Documentation Structure Guide

This guide explains how our documentation is organized and how different pieces connect together. Think of this as your documentation map.

## 📚 Documentation Hierarchy

```
Root (/)
├── README.md                    # Entry point & quick reference
├── RULES.md                     # Core rules and guidelines
├── SESSIONS.md                  # Active session tracking
├── NOTES.md                     # Project-level notes
├── docs/                        # Main documentation directory
│   ├── README.md               # Documentation index
│   ├── quick-start.md          # Getting started guide
│   ├── guides/                 # Guidance documentation
│   │   ├── coach-michael-stolarz-guide.md  # Coach's guide
│   │   ├── permissions-guide.md            # Access rules
│   │   └── cursor-instructions.md          # Cursor AI usage
│   ├── technical/             # Technical documentation
│   │   └── node-network-summary.md        # Network details
│   ├── machine-management.md   # Environment setup guide
│   ├── automation-rules.md     # Automation documentation
│   ├── documentation-structure.md  # This file
│   ├── glossary.md            # Terminology reference
│   ├── errors/                # Error handling documentation
│   │   └── README.md         # Error handling guide
│   ├── performance/          # Performance documentation
│   │   └── README.md        # Performance guide
│   ├── sessions/            # Session management
│   │   └── README.md       # Session management guide
│   └── learning/           # Learning system
│       └── README.md      # Learning documentation
└── scripts/              # Automation scripts
    └── docs/            # Documentation automation
```

## 🗺️ Documentation Flow

### 1. Entry Points
- **[README.md](../README.md)**: Start here for project overview
  - Quick start instructions
  - Documentation navigation
  - Available commands
  - Best practices

### 2. First Steps
1. **[Quick Start Guide](./quick-start.md)**
   - Initial setup
   - Basic configuration
   - First commands

2. **[Machine Management](./machine-management.md)**
   - Environment setup
   - Cross-machine development
   - Configuration management

3. **This Guide**
   - Documentation organization
   - Navigation help
   - File relationships

### 3. Core Systems

#### Documentation Types

1. **Guides**
   - Coach's guide for project overview and educational aspects
   - Permission guide for access control
   - Cursor instructions for AI interaction
   
2. **Technical Documentation**
   - Network visualization details
   - Performance considerations
   - Error handling
   - Machine configuration

3. **Learning Resources**
   - Session tracking
   - Knowledge capture
   - Best practices
   - Process documentation

### 4. Technical Documentation

#### Error Handling
- **[Error Documentation](./errors/README.md)**
  - Error categories
  - Recovery procedures
  - Prevention strategies

#### Performance
- **[Performance Guide](./performance/README.md)**
  - Monitoring
  - Optimization
  - Benchmarks

## 🔄 Documentation Lifecycle

1. **Session Start**
   ```bash
   npm run docs:session start
   ```
   - Creates session context
   - Loads environment
   - Prepares tracking

2. **During Development**
   ```bash
   npm run docs:learn     # Document learnings
   npm run docs:check    # Verify documentation
   ```
   - Capture knowledge
   - Track progress
   - Maintain health

3. **Session End**
   ```bash
   npm run docs:session end
   ```
   - Archive session
   - Update documentation
   - Generate diagrams

## 🔍 Finding Information

### 1. Quick Reference
- Check root [README.md](../README.md) for common tasks
- Use [Glossary](./glossary.md) for terminology
- Review [Sessions](../SESSIONS.md) for recent work

### 2. Detailed Guides
- Visit specific system READMEs
- Follow cross-references
- Check automation rules

### 3. Technical Details
- Review error documentation
- Check performance guides
- Examine learning entries

## 🤝 Contributing to Documentation

1. **Adding New Documentation**
   - Follow existing structure
   - Include cross-references
   - Update this guide

2. **Updating Existing Docs**
   - Maintain relationships
   - Update diagrams
   - Verify health

3. **Documentation Health**
   ```bash
   npm run docs:check
   ```
   - Validates links
   - Checks references
   - Ensures completeness

## 📈 Documentation Evolution

Our documentation is designed to grow and improve:
1. Regular updates through automation
2. Continuous learning capture
3. Health monitoring
4. Cross-reference maintenance

Remember: Good documentation is a living system. Use the automation tools to help maintain it, and always think about how to make it more useful for the next person. 