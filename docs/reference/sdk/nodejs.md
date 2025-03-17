# Node.js SDK

## Installation
```bash
npm install interactive-node-network
```

## Quick Start
```javascript
const { NetworkClient } = require('interactive-node-network');

const client = new NetworkClient({
  apiKey: 'your-api-key'
});

// Create a node
const node = await client.nodes.create({
  type: 'standard'
});

// Get network status
const status = await client.network.getStatus();
```

## API Reference
Full SDK documentation with examples and best practices. 