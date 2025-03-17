# Project Glossary

## Documentation Terms

### Core Documentation Concepts
- **Documentation Hierarchy**: The organized structure of documentation, from high-level overviews to detailed technical specifications.
- **Documentation Map**: A visual representation showing relationships between different documentation files.
- **Documentation Health**: Metrics and indicators that measure the quality, completeness, and maintainability of documentation.
- **Living Documentation**: Documentation that evolves alongside the codebase, maintained through automated tools and regular updates.

### Documentation Types
- **Quick Start Documents**: Entry-point documentation that helps users begin using the project immediately.
- **Technical Documentation**: Detailed documentation about implementation, architecture, and technical decisions.
- **Learning Resources**: Documents focused on knowledge sharing and educational content.
- **Process Documentation**: Documentation describing workflows, procedures, and methodologies.

## Development Concepts

### Version Control
- **Checksum**: A hash value used to verify file integrity and track changes.
- **Checksum Tracking**: System for monitoring file modifications using checksums.
- **Version Sync**: Ensuring documentation versions match corresponding code versions.

### Automation
- **Documentation Generation**: Automated creation of documentation from code and other sources.
- **Diagram Generation**: Automated creation of visual representations using tools like Mermaid.
- **Coverage Analysis**: Automated assessment of documentation completeness.
- **Health Checks**: Automated verification of documentation quality and accuracy.

### Project Structure
- **Interactive Node Network**: Our core visualization system for displaying and manipulating network nodes.
- **Node Network Wrapper**: Component that encapsulates the node network functionality.
- **Network Visualization Controller**: Component managing the visual aspects of the network.

## Educational Support

### Learning Management
- **Learning Journal**: Document tracking new concepts, tools, and practices encountered during development.
- **Learning Opportunity**: A moment or situation that presents a chance to acquire new knowledge or skills.
- **Knowledge Capture**: The process of documenting new learnings and insights.

### Documentation Practices
- **DRY Documentation**: Documentation that follows the "Don't Repeat Yourself" principle.
- **Cross-Reference Map**: Visual representation of how different documentation files reference each other.
- **Documentation Coverage**: Measure of how completely the codebase is documented.

## Technical Implementation

### Visualization Components
- **Theme Variants**: Different color schemes and visual styles (default, warm, cool, night, high contrast, neon).
- **Network Parameters**: Configurable settings that control network behavior and appearance.
- **Canvas Rendering**: The process of drawing the network visualization using HTML5 Canvas.

### Performance
- **Performance Optimization**: Techniques used to improve application speed and efficiency.
- **Animation Smoothness**: Measure of how fluid and responsive the network animations are.
- **Render Efficiency**: How effectively the application draws and updates visual elements.

### Accessibility
- **Contrast Ratio**: Measurement of color contrast between elements for readability.
- **Accessibility Features**: Tools and design elements that make the application more accessible.
- **Mobile Responsiveness**: Application's ability to adapt to different screen sizes.

## Tools and Scripts

### Documentation Tools
- **Mermaid**: Markdown-based tool for creating diagrams and visualizations.
- **Table of Contents Generator**: Tool for automatically creating document navigation.
- **Link Validator**: Tool for checking the validity of documentation links.

### Development Tools
- **ESM (ECMAScript Modules)**: JavaScript module system used in the project.
- **TypeScript Configuration**: Settings that control TypeScript compilation and behavior.
- **Vite** (v6.2.2): Next-generation frontend build tool that offers faster development server startup and hot module replacement (HMR). Used as our primary development and build tool.

### Build Tools
- **ts-node** (v10.9.2): TypeScript execution environment for running TypeScript files directly.
- **npx**: npm package runner, used to execute package binaries (comes with npm).
- **ESLint**: JavaScript/TypeScript code linting tool for maintaining code quality.
- **Prettier**: Code formatter for maintaining consistent code style.
- **esbuild** (v0.25.1): An extremely fast JavaScript bundler and minifier used by Vite.

### IDE and Extensions
- **Cursor**: Our primary IDE for development, built on modern AI capabilities.
- **VS Code**: Alternative IDE supporting TypeScript and React development.
- **Development Extensions**:
  * TypeScript language support
  * ESLint integration
  * Prettier formatting
  * Git integration
  * Mermaid diagram preview

### Environment Variables
- **PATH**: System variable that tells the shell where to find executable programs.
- **NODE_ENV**: Environment variable that specifies the current Node.js environment (development/production).
- **NPM_CONFIG_**: Prefix for npm configuration variables.

### System Requirements
- **Operating System**: macOS (darwin 24.3.0 or later)
- **Memory**: Minimum 8GB RAM recommended
- **Disk Space**: At least 1GB free space for dependencies
- **Architecture**: Compatible with ARM64 (M1/M2) and x86_64

## Development Environment

### Machine Configuration
- **Machine ID**: A unique identifier for each development machine, typically combining hostname and platform.
- **Environment Detection**: Automated process of identifying and verifying development environment characteristics.
- **Configuration Drift**: When a machine's actual configuration deviates from the documented/expected configuration.
- **Machine Setup**: Automated process of installing and configuring development tools and environments.

### Environment Management
- **nvm (Node Version Manager)**: Tool for managing multiple Node.js versions.
- **Homebrew**: Package manager for macOS, used for installing development tools.
- **Environment Variables**: System-level variables that affect program behavior.
- **Shell Configuration**: Settings and customizations for command-line interface (e.g., .zshrc, .bashrc).

### Testing
- **Environment Testing**: Automated verification of development environment setup.
- **Configuration Testing**: Validation of machine-specific configurations.
- **Integration Testing**: Testing the complete setup process end-to-end.
- **Test Mocking**: Simulating different machine environments for testing.

### Documentation
- **Machine Management**: System for tracking and managing development environments across multiple machines.
- **Configuration History**: Record of changes to machine configurations over time.
- **Setup Documentation**: Instructions and automation for environment setup.
- **Environment Verification**: Process of checking that all required tools and configurations are correct.

## Notes
- Terms are organized by category for easier reference
- Each term includes a brief, clear definition
- Technical terms are linked to their detailed documentation where applicable
- This glossary is maintained alongside code changes and updated regularly

### Core Dependencies
- **React** (v18.2.0): JavaScript library for building user interfaces.
- **TypeScript** (v5.8.2): Typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS** (v3.3.3): Utility-first CSS framework for rapid UI development.
- **React Colorful** (v5.6.1): A tiny color picker component for modern React apps. 