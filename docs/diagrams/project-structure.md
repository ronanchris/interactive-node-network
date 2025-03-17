```mermaid
graph TD
  interactive node network["interactive node network"]
  0.github[".github"]
  00workflows["workflows"]
  1NOTES.md["NOTES.md"]
  2README.md["README.md"]
  3RULES.md["RULES.md"]
  4SESSIONS.md["SESSIONS.md"]
  5cursor-instructions.md["cursor-instructions.md"]
  6docs["docs"]
  60README.md["README.md"]
  61diagrams["diagrams"]
  610doc-relationships.md["doc-relationships.md"]
  611project-structure.md["project-structure.md"]
  62educational-support.md["educational-support.md"]
  63errors["errors"]
  64learning["learning"]
  640README.md["README.md"]
  641advanced-automation.md["advanced-automation.md"]
  642documentation-automation.md["documentation-automation.md"]
  643learning-journal.md["learning-journal.md"]
  65performance["performance"]
  650README.md["README.md"]
  651monitoring.md["monitoring.md"]
  66session-management.md["session-management.md"]
  67user-interaction.md["user-interaction.md"]
  7node-network-summary.md["node-network-summary.md"]
  8permissions-guide.md["permissions-guide.md"]
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
  interactive node network --> 0.github
  0.github --> 00workflows
  interactive node network --> 1NOTES.md
  interactive node network --> 2README.md
  interactive node network --> 3RULES.md
  interactive node network --> 4SESSIONS.md
  interactive node network --> 5cursor-instructions.md
  interactive node network --> 6docs
  6docs --> 60README.md
  6docs --> 61diagrams
  61diagrams --> 610doc-relationships.md
  61diagrams --> 611project-structure.md
  6docs --> 62educational-support.md
  6docs --> 63errors
  6docs --> 64learning
  64learning --> 640README.md
  64learning --> 641advanced-automation.md
  64learning --> 642documentation-automation.md
  64learning --> 643learning-journal.md
  6docs --> 65performance
  65performance --> 650README.md
  65performance --> 651monitoring.md
  6docs --> 66session-management.md
  6docs --> 67user-interaction.md
  interactive node network --> 7node-network-summary.md
  interactive node network --> 8permissions-guide.md
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