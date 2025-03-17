# Cursor Setup Guide

## Session Management

### 1. Session Initialization
* AI must automatically scan both RULES.md and docs/sessions/README.md first
* AI should maintain context throughout the session
* AI should reference any relevant previous decisions or context from docs/sessions/README.md when appropriate

### 2. Session Documentation
* For docs/sessions/README.md:
  - Load content progressively as needed
  - For docs/sessions/README.md larger than 1MB:
    - Load only recent entries
    - Load full content only when needed

### 3. Documentation Organization
- Store session summaries in docs/sessions/README.md
- Keep file sizes manageable:
  * RULES.md should stay under 100KB
  * docs/sessions/README.md can grow larger but should be split by month if exceeding 1MB
  * Consider archiving old sessions to docs/sessions_ARCHIVE/YYYY-MM.md 