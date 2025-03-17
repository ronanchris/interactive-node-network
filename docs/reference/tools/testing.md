# API Testing Tools

## Postman Collection
Download our [Postman Collection](../assets/interactive-node-network.postman_collection.json) for easy API testing.

## Test Scripts
```bash
# Run all API tests
npm run test:api

# Run specific test suite
npm run test:api -- --suite=nodes
```

## Mock Server
For development and testing, use our mock server:
```bash
npm run mock-server
```

## Load Testing
```bash
npm run load-test -- --endpoints=nodes,network --users=100
``` 