```mermaid
graph TD
    subgraph Root Documents
        README.md
        RULES.md
        SESSIONS.md
        NOTES.md
    end

    subgraph Guides
        coach["docs/guides/coach-michael-stolarz-guide.md"]
        permissions["docs/guides/permissions-guide.md"]
        cursor["docs/guides/cursor-instructions.md"]
    end

    subgraph Technical Documentation
        network["docs/technical/node-network-summary.md"]
    end

    subgraph Documentation Management
        doc_structure["docs/documentation-structure.md"]
        relationships["docs/diagrams/doc-relationships.md"]
        project_structure["docs/diagrams/project-structure.md"]
    end

    subgraph Learning and Development
        learning_readme["docs/learning/README.md"]
        advanced_auto["docs/learning/advanced-automation.md"]
        doc_auto["docs/learning/documentation-automation.md"]
        learning_journal["docs/learning/learning-journal.md"]
    end

    subgraph Performance and Monitoring
        perf_readme["docs/performance/README.md"]
        monitoring["docs/performance/monitoring.md"]
    end

    %% Core Documentation Flow
    README.md --> doc_structure
    doc_structure --> |"Project Overview"| project_structure
    doc_structure --> |"Doc Relationships"| relationships
    
    %% Guide Relationships
    README.md --> |"Getting Started"| cursor
    README.md --> |"Permissions"| permissions
    README.md --> |"Coach's Guide"| coach
    README.md --> |"Technical Overview"| network

    %% Learning Flow
    SESSIONS.md --> learning_journal
    learning_journal --> doc_auto
    doc_auto --> advanced_auto
    
    %% Performance Monitoring
    network --> perf_readme
    perf_readme --> monitoring

    %% Rules and Notes Integration
    RULES.md --> permissions
    NOTES.md --> learning_journal

    %% Documentation Updates
    doc_auto --> |"Updates"| doc_structure
    doc_auto --> |"Updates"| relationships
    doc_auto --> |"Updates"| project_structure

    style README.md fill:#f9f,stroke:#333,stroke-width:4px
    style doc_structure fill:#bbf,stroke:#333,stroke-width:2px
    style coach fill:#dfd,stroke:#333,stroke-width:2px
    style permissions fill:#dfd,stroke:#333,stroke-width:2px
    style cursor fill:#dfd,stroke:#333,stroke-width:2px
    style network fill:#fdd,stroke:#333,stroke-width:2px