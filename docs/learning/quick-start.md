# Quick Start Guide

This guide will help you get started with the Interactive Node Network system quickly.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/interactive-node-network.git
   cd interactive-node-network
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Basic Usage

1. Access the web interface at `http://localhost:3000`
2. Create a new node network:
   ```typescript
   const network = new NodeNetwork({
     name: 'My Network',
     description: 'A test network'
   });
   ```

3. Add nodes to your network:
   ```typescript
   const node1 = network.addNode({
     type: 'input',
     position: { x: 100, y: 100 }
   });

   const node2 = network.addNode({
     type: 'process',
     position: { x: 300, y: 100 }
   });
   ```

4. Connect nodes:
   ```typescript
   network.connectNodes(node1.id, node2.id);
   ```

## Next Steps

- Read the [System Overview](./system-overview.md)
- Learn about [Core Concepts](./core-concepts.md)
- Explore [Advanced Features](../tutorials/advanced-features.md)
- Check out [Best Practices](../best-practices/development.md)

## Troubleshooting

If you encounter any issues:

1. Check the [Common Issues](../reference/common-issues.md) guide
2. Review the [Troubleshooting](../reference/troubleshooting.md) documentation
3. Search existing issues on GitHub
4. Create a new issue if needed

## Getting Help

- Join our community chat
- Check the [Documentation Overview](../documentation-overview.md)
- Contact the maintainers

## Related Documentation

- [Development Guide](../guides/development-guide.md)
- [Session Management](../guides/session-management.md)
- [Performance Optimization](../performance/optimization.md) 