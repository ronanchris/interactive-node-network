# Basic Usage Tutorial

This tutorial will guide you through the basic operations of the Interactive Node Network system.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Basic understanding of TypeScript
- Familiarity with the [Core Concepts](../core-concepts.md)

## Getting Started

### 1. Create a New Network

```typescript
import { NodeNetwork } from '@interactive-node-network/core';

// Create a new network
const network = new NodeNetwork({
  name: 'My First Network',
  description: 'A simple data processing network'
});
```

### 2. Add Basic Nodes

```typescript
// Add an input node
const inputNode = network.addNode({
  type: 'input',
  position: { x: 100, y: 100 },
  properties: {
    name: 'Data Input',
    source: 'file',
    format: 'json'
  }
});

// Add a process node
const processNode = network.addNode({
  type: 'process',
  position: { x: 300, y: 100 },
  properties: {
    name: 'Data Transform',
    algorithm: 'filter',
    conditions: { /* ... */ }
  }
});

// Add an output node
const outputNode = network.addNode({
  type: 'output',
  position: { x: 500, y: 100 },
  properties: {
    name: 'Data Output',
    destination: 'file',
    format: 'csv'
  }
});
```

### 3. Connect Nodes

```typescript
// Connect input to process
network.connectNodes(inputNode.id, processNode.id);

// Connect process to output
network.connectNodes(processNode.id, outputNode.id);
```

### 4. Configure Node Properties

```typescript
// Update input node properties
network.updateNode(inputNode.id, {
  properties: {
    ...inputNode.properties,
    filePath: './data/input.json'
  }
});

// Update process node properties
network.updateNode(processNode.id, {
  properties: {
    ...processNode.properties,
    filterRules: {
      field: 'status',
      operator: 'equals',
      value: 'active'
    }
  }
});

// Update output node properties
network.updateNode(outputNode.id, {
  properties: {
    ...outputNode.properties,
    filePath: './data/output.csv'
  }
});
```

### 5. Validate the Network

```typescript
// Validate network structure
const validationResult = network.validate();
if (!validationResult.isValid) {
  console.error('Network validation failed:', validationResult.errors);
}
```

### 6. Execute the Network

```typescript
// Execute the network
try {
  await network.execute();
  console.log('Network execution completed successfully');
} catch (error) {
  console.error('Network execution failed:', error);
}
```

## Working with Data

### 1. Input Data Format

```typescript
// Example input data
const inputData = {
  records: [
    { id: 1, status: 'active', value: 100 },
    { id: 2, status: 'inactive', value: 200 }
  ]
};
```

### 2. Process Data

```typescript
// Example data processing
network.on('nodeStart', (node) => {
  if (node.type === 'process') {
    console.log('Processing data...');
  }
});

network.on('nodeComplete', (node) => {
  if (node.type === 'process') {
    console.log('Data processing completed');
  }
});
```

### 3. Output Data Format

```typescript
// Example output data
const outputData = {
  records: [
    { id: 1, status: 'active', value: 100 }
  ]
};
```

## Error Handling

### 1. Basic Error Handling

```typescript
// Handle network errors
network.on('error', (error) => {
  console.error('Network error:', error);
});

// Handle node errors
network.on('nodeError', (node, error) => {
  console.error(`Error in node ${node.id}:`, error);
});
```

### 2. Recovery Procedures

```typescript
// Handle execution failures
try {
  await network.execute();
} catch (error) {
  // Log error
  console.error('Execution failed:', error);
  
  // Attempt recovery
  await network.reset();
  await network.validate();
}
```

## Best Practices

1. **Network Design**
   - Keep networks simple and focused
   - Use meaningful node names
   - Document node purposes
   - Validate connections

2. **Data Management**
   - Validate input data
   - Handle data transformations
   - Monitor data flow
   - Secure sensitive data

3. **Error Handling**
   - Implement proper error handling
   - Log errors appropriately
   - Provide recovery options
   - Monitor system health

## Next Steps

1. Explore [Advanced Features](./advanced-features.md)
2. Learn about [Integration](./integration.md)
3. Study [Customization](./customization.md)
4. Review [Best Practices](../best-practices/development.md)

## Related Documentation

- [Core Concepts](../core-concepts.md)
- [System Overview](../system-overview.md)
- [Performance Guide](../../performance/README.md)
- [Error Handling](../../errors/README.md) 