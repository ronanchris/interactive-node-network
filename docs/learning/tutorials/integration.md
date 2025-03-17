# Integration Tutorial

This tutorial covers how to integrate the Interactive Node Network system with external applications and services.

## Prerequisites

- Understanding of [Basic Usage](./basic-usage.md)
- Familiarity with [Advanced Features](./advanced-features.md)
- Experience with REST APIs and web services

## Integration Methods

### 1. REST API Integration

```typescript
// Configure REST API endpoints
const apiConfig = {
  baseUrl: 'https://api.example.com',
  endpoints: {
    input: '/v1/input',
    output: '/v1/output',
    status: '/v1/status'
  },
  authentication: {
    type: 'bearer',
    token: process.env.API_TOKEN
  }
};

// Create API integration node
const apiNode = network.addNode({
  type: 'api',
  position: { x: 200, y: 200 },
  properties: {
    name: 'External API',
    config: apiConfig,
    methods: ['GET', 'POST'],
    retry: {
      attempts: 3,
      delay: 1000
    }
  }
});

// Handle API events
apiNode.on('request', (request) => {
  console.log('API request:', request);
});

apiNode.on('response', (response) => {
  console.log('API response:', response);
});
```

### 2. WebSocket Integration

```typescript
// Configure WebSocket connection
const wsConfig = {
  url: 'wss://websocket.example.com',
  protocols: ['v1'],
  options: {
    heartbeat: 30000,
    reconnect: true
  }
};

// Create WebSocket node
const wsNode = network.addNode({
  type: 'websocket',
  position: { x: 300, y: 200 },
  properties: {
    name: 'Real-time Data',
    config: wsConfig,
    events: ['message', 'error', 'close']
  }
});

// Handle WebSocket events
wsNode.on('message', (data) => {
  console.log('WebSocket message:', data);
});

wsNode.on('error', (error) => {
  console.error('WebSocket error:', error);
});
```

### 3. Database Integration

```typescript
// Configure database connection
const dbConfig = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'network_db',
  credentials: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};

// Create database node
const dbNode = network.addNode({
  type: 'database',
  position: { x: 400, y: 200 },
  properties: {
    name: 'Data Storage',
    config: dbConfig,
    operations: ['read', 'write', 'query']
  }
});

// Handle database operations
dbNode.on('query', async (query) => {
  const result = await dbNode.execute(query);
  return result;
});
```

## Data Integration

### 1. Data Format Conversion

```typescript
// Configure data format conversion
const formatConfig = {
  input: {
    type: 'json',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        value: { type: 'number' }
      }
    }
  },
  output: {
    type: 'xml',
    template: `
      <data>
        <id>{{id}}</id>
        <value>{{value}}</value>
      </data>
    `
  }
};

// Create format converter node
const converterNode = network.addNode({
  type: 'converter',
  position: { x: 500, y: 200 },
  properties: {
    name: 'Format Converter',
    config: formatConfig
  }
});
```

### 2. Data Validation

```typescript
// Configure data validation
const validationConfig = {
  rules: [
    {
      field: 'value',
      type: 'number',
      required: true,
      min: 0,
      max: 100
    },
    {
      field: 'status',
      type: 'string',
      enum: ['active', 'inactive', 'pending']
    }
  ],
  errorHandling: {
    strategy: 'reject',
    customError: true
  }
};

// Create validator node
const validatorNode = network.addNode({
  type: 'validator',
  position: { x: 600, y: 200 },
  properties: {
    name: 'Data Validator',
    config: validationConfig
  }
});
```

## Security Integration

### 1. Authentication

```typescript
// Configure authentication
const authConfig = {
  type: 'jwt',
  options: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
    algorithm: 'HS256'
  }
};

// Create authentication node
const authNode = network.addNode({
  type: 'auth',
  position: { x: 700, y: 200 },
  properties: {
    name: 'Authentication',
    config: authConfig
  }
});

// Handle authentication
authNode.on('authenticate', async (token) => {
  const decoded = await authNode.verify(token);
  return decoded;
});
```

### 2. Authorization

```typescript
// Configure authorization
const authzConfig = {
  roles: ['admin', 'user', 'guest'],
  permissions: {
    admin: ['read', 'write', 'delete'],
    user: ['read', 'write'],
    guest: ['read']
  }
};

// Create authorization node
const authzNode = network.addNode({
  type: 'authorization',
  position: { x: 800, y: 200 },
  properties: {
    name: 'Authorization',
    config: authzConfig
  }
});

// Handle authorization
authzNode.on('authorize', async (user, action) => {
  const allowed = await authzNode.checkPermission(user, action);
  return allowed;
});
```

## Monitoring Integration

### 1. Metrics Collection

```typescript
// Configure metrics collection
const metricsConfig = {
  provider: 'prometheus',
  options: {
    port: 9090,
    path: '/metrics',
    labels: {
      environment: process.env.NODE_ENV
    }
  }
};

// Create metrics node
const metricsNode = network.addNode({
  type: 'metrics',
  position: { x: 900, y: 200 },
  properties: {
    name: 'Metrics Collector',
    config: metricsConfig
  }
});

// Handle metrics
metricsNode.on('metric', (metric) => {
  console.log('Collected metric:', metric);
});
```

### 2. Logging Integration

```typescript
// Configure logging
const loggingConfig = {
  provider: 'elasticsearch',
  options: {
    url: 'http://localhost:9200',
    index: 'network-logs',
    level: 'info'
  }
};

// Create logging node
const loggingNode = network.addNode({
  type: 'logging',
  position: { x: 1000, y: 200 },
  properties: {
    name: 'Logger',
    config: loggingConfig
  }
});

// Handle logging
loggingNode.on('log', (log) => {
  console.log('Network log:', log);
});
```

## Best Practices

1. **Error Handling**
   - Implement proper error handling for all external services
   - Use retry mechanisms for transient failures
   - Log all integration errors for debugging

2. **Security**
   - Never store sensitive credentials in code
   - Use environment variables for configuration
   - Implement proper authentication and authorization

3. **Performance**
   - Use connection pooling for database connections
   - Implement caching where appropriate
   - Monitor integration performance metrics

4. **Maintenance**
   - Keep integration dependencies up to date
   - Document all integration points
   - Implement proper versioning for APIs

## Next Steps

1. Explore [Customization](./customization.md)
2. Review [Best Practices](../best-practices/development.md)
3. Check [Security Guide](../../security/README.md)
4. Learn about [Monitoring](../../monitoring/README.md)

## Related Documentation

- [Core Concepts](../core-concepts.md)
- [System Overview](../system-overview.md)
- [Error Handling](../../errors/README.md)
- [Security Guidelines](../../security/README.md) 