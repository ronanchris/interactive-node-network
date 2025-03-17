# Quick Start Guide

This guide will help you get started with the Interactive Node Network project quickly.

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
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

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

## Configuration

1. Open `.env` and configure your environment variables
2. Review `machine-config.json` for machine-specific settings

## Running the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Development Tools

- Documentation Dashboard: `npm run docs:dashboard`
- Run Tests: `npm test`
- Build Project: `npm run build`
- Check Types: `npm run typecheck`

## Next Steps

1. Review the [Documentation Overview](./documentation-overview.md)
2. Set up your [development environment](./guides/development-guide.md)
3. Read our [contribution guidelines](../CONTRIBUTING.md)

## Need Help?

- Check our [troubleshooting guide](./reference/troubleshooting.md)
- Review [common issues](./reference/common-issues.md)
- Join our community chat 