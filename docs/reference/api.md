# API Documentation

## Overview
This document provides comprehensive documentation for the Interactive Node Network API endpoints and usage guidelines.

## API Endpoints

### Node Management

#### GET /api/nodes
Retrieves all nodes in the network.

**Parameters:**
- `filter` (optional): Filter nodes by type
- `limit` (optional): Limit the number of returned nodes

**Response:**
```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "standard",
      "connections": []
    }
  ]
}
```

#### POST /api/nodes
Creates a new node in the network.

**Request Body:**
```json
{
  "type": "standard",
  "initialConnections": []
}
```

**Response:**
```json
{
  "id": "node-1",
  "type": "standard",
  "connections": []
}
```

### Network Operations

#### GET /api/network/status
Retrieves the current status of the network.

**Response:**
```json
{
  "nodeCount": 10,
  "connectionCount": 15,
  "status": "healthy"
}
```

## Usage Guidelines

### Authentication
All API requests must include an authentication token in the header:
```
Authorization: Bearer <your-token>
```

### Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per token

### Error Handling
The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Examples

### Creating and Connecting Nodes
```javascript
// Create first node
const node1 = await fetch('/api/nodes', {
  method: 'POST',
  body: JSON.stringify({ type: 'standard' })
});

// Create second node
const node2 = await fetch('/api/nodes', {
  method: 'POST',
  body: JSON.stringify({ type: 'standard' })
});

// Connect nodes
await fetch('/api/connections', {
  method: 'POST',
  body: JSON.stringify({
    source: node1.id,
    target: node2.id
  })
});
```

## Best Practices
1. Always check response status codes
2. Implement proper error handling
3. Use connection pooling for multiple requests
4. Cache responses when appropriate
5. Follow rate limiting guidelines

## SDK and Tools
- [Node.js SDK](./sdk/nodejs.md)
- [Python SDK](./sdk/python.md)
- [API Testing Tools](./tools/testing.md)

## Changelog
- **1.0.0** (2024-03-17): Initial API release
- **1.0.1** (2024-03-17): Added rate limiting
- **1.1.0** (2024-03-17): Added network status endpoint 