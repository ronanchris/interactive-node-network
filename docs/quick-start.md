# Quick Start Guide

This guide will help you get started with the Interactive Node Network project quickly and efficiently.

## Prerequisites

- Node.js (v23.10.0 or later)
- npm (v10.9.2 or later)
- Git
- A modern web browser
- Code editor (VS Code recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/interactive-node-network.git
   cd interactive-node-network
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

## Development Server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173/interactive-node-network/
   ```

## Basic Usage

### Project Structure
```
/
├── src/               # Source code
├── public/            # Static assets
├── docs/             # Documentation
├── tests/            # Test files
└── scripts/          # Utility scripts
```

### Key Commands
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run test          # Run tests
npm run docs:serve    # Serve documentation
npm run lint         # Lint code
```

## Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push changes and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Documentation

- [Project Documentation](./README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Machine Management](./machine-management.md)
- [Documentation Structure](./documentation-structure.md)

## Common Tasks

### Adding a New Node
1. Create node component in `src/components/`
2. Register node in `src/nodes/index.ts`
3. Add node documentation
4. Test node functionality

### Modifying Network Behavior
1. Update network configuration in `src/config/`
2. Modify network handlers in `src/handlers/`
3. Test changes
4. Update documentation

## Troubleshooting

### Common Issues
1. **Server won't start**
   - Check Node.js version
   - Verify port availability
   - Check environment variables

2. **Build errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`

3. **Network errors**
   - Check network configuration
   - Verify node connections
   - Review error logs

## Next Steps

1. Review [Documentation Structure](./documentation-structure.md)
2. Explore [Machine Management](./machine-management.md)
3. Read [Contributing Guidelines](../CONTRIBUTING.md)
4. Join the development community

## Support

- Create an issue in the repository
- Check existing documentation
- Contact the development team

## Related Documentation

- [Project Standards](./project-standards.md)
- [Error Handling](./errors/README.md)
- [Performance Guide](./performance/README.md)
- [Learning System](./learning/README.md)