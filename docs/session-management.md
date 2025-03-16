# Session Management

## Overview

This document outlines how AI sessions are managed, tracked, and utilized for maintaining context and continuity across interactions.

## Session Structure

### Current Session File
```json
{
  "metadata": {
    "session_start": "<ISO-timestamp>",
    "last_updated": "<ISO-timestamp>",
    "main_topic": "<string>",
    "linked_issues": ["<issue-refs>"],
    "environment": {
      "branch": "<current-branch>",
      "last_commit": "<commit-hash>"
    }
  },
  "context": {
    "active_files": ["<file-paths>"],
    "recent_changes": ["<change-descriptions>"],
    "pending_tasks": ["<task-descriptions>"]
  }
}
```

## Session Management Rules

### 1. Session Initialization
- AI must scan both `RULES.md` and `SESSIONS.md` at start
- No user prompt needed - this is AI's responsibility
- Acknowledge having reviewed documentation
- Reference relevant previous decisions

### 2. Performance Guidelines
- Initial scanning timeout: 5 seconds
- For `SESSIONS.md` > 1MB:
  - Scan last 3 sessions by default
  - Implement lazy loading
  - Cache frequent sections

### 3. File Management
- Keep one active `current_session.md`
- Archive to `SESSIONS.md` when starting new
- Monthly archival of old sessions
- Maintain checksums for change detection

### 4. Memory Management
- Warning at 80% memory usage
- Force new session at 90%
- Emergency save at 95%
- Stream large files in 50KB chunks

## Session Archives

### Archive Structure
```markdown
# Session Archive

## Session <ISO-date>
### Context
- Main topic
- Related issues
- Environment state

### Decisions
- Key decisions made
- Rationale
- Implementation details

### Technical Debt
- Identified issues
- Workarounds used
- Future improvements

### Next Steps
- Pending tasks
- Planned features
- Known limitations
```

## Checksum Implementation

### Checksum File
```json
{
  "rules.md": {
    "hash": "<sha256-hash>",
    "last_checked": "<ISO-timestamp>",
    "last_modified": "<ISO-timestamp>"
  },
  "sessions.md": {
    "hash": "<sha256-hash>",
    "last_checked": "<ISO-timestamp>",
    "last_modified": "<ISO-timestamp>"
  }
}
```

## Emergency Procedures

### Save Trigger Conditions
- Memory threshold exceeded
- System signals (SIGTERM, SIGINT)
- Unexpected errors
- Network issues

### Recovery Process
1. Detect emergency files
2. Present recovery options
3. Merge recovered content
4. Clean up emergency files

## Cross-References

- [Performance Monitoring](./performance/monitoring.md) for metrics tracking
- [Error Handling](./errors/README.md) for issue management
- [Development Workflow](./development-workflow.md) for process integration 