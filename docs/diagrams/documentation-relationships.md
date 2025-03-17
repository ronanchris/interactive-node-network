# Documentation Relationships

This diagram shows how different parts of our documentation system connect and relate to each other.

## Overview Diagram

```mermaid
graph TD
    %% Main Entry Points
    README[README.md]
    QUICKSTART[quick-start.md]
    DOCSTRUCTURE[documentation-structure.md]
    
    %% Core Systems
    MACHINE[machine-management.md]
    AUTO[automation-rules.md]
    SESSIONS[SESSIONS.md]
    LEARNING[learning/README.md]
    
    %% Technical Docs
    ERRORS[errors/README.md]
    PERF[performance/README.md]
    GLOSS[glossary.md]
    
    %% Entry Flow
    README --> QUICKSTART
    README --> DOCSTRUCTURE
    README --> MACHINE
    
    %% Quick Start Relations
    QUICKSTART --> MACHINE
    QUICKSTART --> AUTO
    QUICKSTART --> SESSIONS
    
    %% Machine Management
    MACHINE --> AUTO
    MACHINE --> ERRORS
    MACHINE --> PERF
    
    %% Session Management
    SESSIONS --> LEARNING
    SESSIONS --> ERRORS
    SESSIONS --> PERF
    
    %% Learning System
    LEARNING --> GLOSS
    LEARNING --> AUTO
    
    %% Cross-System Relations
    AUTO --> ERRORS
    AUTO --> PERF
    ERRORS --> PERF
    
    %% Glossary Relations
    GLOSS --> ERRORS
    GLOSS --> PERF
    GLOSS --> MACHINE
    
    style README fill:#f9f,stroke:#333,stroke-width:4px
    style QUICKSTART fill:#bbf,stroke:#333
    style DOCSTRUCTURE fill:#bbf,stroke:#333
    style MACHINE fill:#bfb,stroke:#333
    style AUTO fill:#bfb,stroke:#333
    style SESSIONS fill:#fbb,stroke:#333
    style LEARNING fill:#fbb,stroke:#333
    style ERRORS fill:#ffb,stroke:#333
    style PERF fill:#ffb,stroke:#333
    style GLOSS fill:#bff,stroke:#333
```

## Documentation Categories

```mermaid
pie
    title Documentation by Category
    "Entry & Setup" : 3
    "Core Systems" : 4
    "Technical Docs" : 2
    "Reference" : 1
```

## Documentation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as README.md
    participant Q as Quick Start
    participant M as Machine Management
    participant S as Sessions
    participant D as Documentation

    U->>R: Start Here
    R->>Q: Setup Guide
    Q->>M: Configure Environment
    M->>S: Begin Session
    S->>D: Document Progress
    D-->>S: Update Documentation
    S-->>M: Verify Environment
    M-->>Q: Update Setup
    Q-->>R: Improve Guide
```

## Key

1. **Entry Points** (Pink)
   - README.md
   - Quick Start
   - Documentation Structure

2. **Core Systems** (Green)
   - Machine Management
   - Automation Rules

3. **Development Flow** (Red)
   - Sessions
   - Learning

4. **Technical Documentation** (Yellow)
   - Errors
   - Performance

5. **Reference** (Blue)
   - Glossary

## Usage

This diagram helps visualize:
1. How documentation pieces connect
2. Natural progression through docs
3. Related documentation sections
4. Documentation categories
5. Information flow

Use this diagram to:
- Find related documentation
- Understand document dependencies
- Navigate the documentation system
- Plan documentation updates

Remember: All documentation relationships are maintained automatically through our documentation automation system. 