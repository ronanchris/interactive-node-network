# Python SDK

## Installation
```bash
pip install interactive-node-network
```

## Quick Start
```python
from interactive_node_network import NetworkClient

client = NetworkClient(api_key='your-api-key')

# Create a node
node = client.nodes.create(type='standard')

# Get network status
status = client.network.get_status()
```

## API Reference
Full SDK documentation with examples and best practices. 