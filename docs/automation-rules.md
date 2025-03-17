# Documentation Automation Rules

## Trigger Events

### Learning Opportunities
**When to Capture**:
- New technical concept is introduced
- New tool or library is used
- New pattern or practice is implemented
- User asks a question about functionality
- Error or issue resolution provides insight

**Required Actions**:
1. Update `docs/learning/learning-journal.md`
2. Add new terms to `docs/glossary.md`
3. Cross-reference in relevant documentation

### Session Documentation
**When to Update**:
- Start of new conversation
- Major code changes
- Documentation updates
- Configuration changes
- Error resolution
- Learning capture

**Required Actions**:
1. Update `SESSIONS.md` with:
   - Date and time
   - Context from previous sessions
   - Goals and objectives
   - Actions taken
   - Decisions made
   - Next steps

### README Updates
**When to Update**:
- New features added
- API changes
- Dependencies updated
- Setup requirements changed
- New documentation sections added
- Project structure changes

**Required Actions**:
1. Update relevant README section
2. Regenerate project structure diagram
3. Update documentation relationships

### Glossary Updates
**When to Add Terms**:
- New technical terms used
- New tools introduced
- New concepts explained
- New patterns implemented
- New documentation sections added

**Required Actions**:
1. Add term to appropriate category
2. Include clear definition
3. Add cross-references
4. Update related documentation

## Cross-Referencing Rules

### Documentation Map
- Every new document must be added to documentation relationship diagram
- Update cross-references in related documents
- Maintain hierarchy in documentation overview

### Version Control
- Track documentation changes in commit messages
- Update CHANGELOG.md for significant changes
- Tag documentation versions with code releases

### Automated Checks
- Run `generate-diagrams` after structure changes
- Run `check-env` after dependency updates
- Verify documentation links
- Check glossary references

## Multi-Machine Development

### Machine Identification
**When to Check**:
- Start of new conversation
- Workspace path changes
- Shell environment changes
- System information changes

**Required Actions**:
1. Compare current machine info against known configurations:
   - OS version
   - Shell type
   - Workspace path
   - Node.js version
   - Installed tools

2. If new/different machine detected:
   - Run full environment check
   - Verify tool installations
   - Check configuration files
   - Validate access permissions
   - Test build commands

### Configuration Sync
**Required Files to Track**:
- `.zshrc` or shell configuration
- Node.js version (via `.nvmrc`)
- Git configuration
- IDE settings
- Environment variables
- Project-specific configs

**Sync Process**:
1. Document all required configurations
2. Maintain setup scripts
3. Track environment differences
4. Provide machine-specific troubleshooting

### Environment Variables
**Per-Machine Requirements**:
- Document required env vars
- Provide `.env.example`
- Track machine-specific paths
- Note system-specific settings

## AI Assistant Behavior

### Session Start
1. Load and parse:
   - Previous session notes
   - Current documentation structure
   - Glossary terms
   - Project status
   - **Machine identification**
   - **Environment configuration**

2. Establish context:
   - Active features/changes
   - Pending tasks
   - Recent learning entries
   - Current machine status
   - Required setup steps

### During Session
1. Monitor for trigger events
2. Prompt for documentation updates
3. Maintain session notes
4. Track learning opportunities
5. **Monitor chat memory consumption:**
   - Track conversation length and complexity
   - Monitor number of tool calls and operations
   - Check context accumulation
   - Proactively suggest new sessions when:
     * Chat duration exceeds 1 hour
     * Complex operations are complete
     * Major milestones are reached
     * Context switching is about to occur
     * Memory usage approaches 80%
     * Before starting new major features
   - Provide clear transition recommendations:
     * "I notice we've been working for over an hour. Would you like me to summarize our progress and start a fresh chat?"
     * "We've completed [feature/task]. This would be a good time to document our progress and start a new session."
     * "Before we begin [new task], let's summarize our current work and start fresh to ensure optimal performance."

### Session End
1. Update session documentation
2. Commit documentation changes
3. Generate updated diagrams
4. Verify cross-references

## Documentation Health Metrics

### Coverage Tracking
- All terms used have glossary entries
- All documents are cross-referenced
- All features are documented
- All changes are tracked

### Quality Checks
- Documentation is up to date
- Links are valid
- Terms are consistent
- Format follows standards

## Automation Scripts

### Required Checks
```typescript
interface DocumentationCheck {
  type: 'learning' | 'session' | 'readme' | 'glossary' | 'machine_check';
  trigger: string;
  required: boolean;
  actions: string[];
}

const DOCUMENTATION_CHECKS: DocumentationCheck[] = [
  {
    type: 'learning',
    trigger: 'new_concept',
    required: true,
    actions: ['update_journal', 'update_glossary', 'cross_reference']
  },
  {
    type: 'session',
    trigger: 'conversation_start',
    required: true,
    actions: ['create_session_entry', 'load_context', 'set_goals']
  },
  {
    type: 'machine_check',
    trigger: 'new_session',
    required: true,
    actions: ['verify_environment', 'check_configs', 'sync_requirements']
  }
];

interface MachineConfig {
  identifier: string;
  osVersion: string;
  shell: string;
  workspacePath: string;
  nodeVersion: string;
  requiredTools: string[];
  lastVerified: string;
}
```

### Machine-Specific Implementation Notes
- Store machine configurations in `.machine-config.json`
- Track per-machine environment requirements
- Maintain setup scripts for each machine
- Document machine-specific workarounds
- Regular sync of shared configurations
``` 