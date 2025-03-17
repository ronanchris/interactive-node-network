```mermaid
graph TD
  interactive node network["interactive node network"]
  0.github[".github"]
  00workflows["workflows"]
  1NOTES.md["NOTES.md"]
  2README.md["README.md"]
  3RULES.md["RULES.md"]
  4SESSIONS.md["SESSIONS.md"]
  6docs["docs"]
  60README.md["README.md"]
  61diagrams["diagrams"]
  610doc-relationships.md["doc-relationships.md"]
  611project-structure.md["project-structure.md"]
  62guides["guides"]
  620coach-guide["coach-michael-stolarz-guide.md"]
  621permissions["permissions-guide.md"]
  622cursor["cursor-instructions.md"]
  63technical["technical"]
  630network["node-network-summary.md"]
  64errors["errors"]
  65learning["learning"]
  650README.md["README.md"]
  651advanced-automation.md["advanced-automation.md"]
  652documentation-automation.md["documentation-automation.md"]
  653learning-journal.md["learning-journal.md"]
  66performance["performance"]
  660README.md["README.md"]
  661monitoring.md["monitoring.md"]
  67session-management.md["session-management.md"]
  68user-interaction.md["user-interaction.md"]
  9postcss.config.js["postcss.config.js"]
  10scripts["scripts"]
  100docs["docs"]
  1000coverage.ts["coverage.ts"]
  1001diagrams.ts["diagrams.ts"]
  1002toc.js["toc.js"]
  1003versions.ts["versions.ts"]
  11src["src"]
  110App.tsx["App.tsx"]
  111components["components"]
  1110InteractiveNodeNetwork.tsx["InteractiveNodeNetwork.tsx"]
  1111NetworkVisualizationController.tsx["NetworkVisualizationController.tsx"]
  1112NodeNetworkWrapper.tsx["NodeNetworkWrapper.tsx"]
  112interactive-node-network.tsx["interactive-node-network.tsx"]
  113main.tsx["main.tsx"]
  12tailwind.config.js["tailwind.config.js"]
  13vite.config.ts["vite.config.ts"]
  
  %% Directory Structure
  interactive node network --> 0.github
  0.github --> 00workflows
  interactive node network --> 1NOTES.md
  interactive node network --> 2README.md
  interactive node network --> 3RULES.md
  interactive node network --> 4SESSIONS.md
  interactive node network --> 6docs
  6docs --> 60README.md
  6docs --> 61diagrams
  61diagrams --> 610doc-relationships.md
  61diagrams --> 611project-structure.md
  6docs --> 62guides
  62guides --> 620coach-guide
  62guides --> 621permissions
  62guides --> 622cursor
  6docs --> 63technical
  63technical --> 630network
  6docs --> 64errors
  6docs --> 65learning
  65learning --> 650README.md
  65learning --> 651advanced-automation.md
  65learning --> 652documentation-automation.md
  65learning --> 653learning-journal.md
  6docs --> 66performance
  66performance --> 660README.md
  66performance --> 661monitoring.md
  6docs --> 67session-management.md
  6docs --> 68user-interaction.md
  interactive node network --> 9postcss.config.js
  interactive node network --> 10scripts
  10scripts --> 100docs
  100docs --> 1000coverage.ts
  100docs --> 1001diagrams.ts
  100docs --> 1002toc.js
  100docs --> 1003versions.ts
  interactive node network --> 11src
  11src --> 110App.tsx
  11src --> 111components
  111components --> 1110InteractiveNodeNetwork.tsx
  111components --> 1111NetworkVisualizationController.tsx
  111components --> 1112NodeNetworkWrapper.tsx
  11src --> 112interactive-node-network.tsx
  11src --> 113main.tsx
  interactive node network --> 12tailwind.config.js
  interactive node network --> 13vite.config.ts
```