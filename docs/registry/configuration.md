---
title: OmniDragon Registry — Configuration
sidebar_position: 20
---

# Registry Configuration Guide

## Contract Deployment Configuration

### CREATE2 Deployment
The OmniDragonRegistry uses CREATE2 for deterministic deployment across all chains:

```solidity
// Deployment parameters
bytes32 constant REGISTRY_SALT = 0x6940adc0a505108bc11ca28eefb7e3bac7af0777ced6b4e9b4f7e4e8c2a4e8d9;
address constant CREATE2_FACTORY = 0xAA28020DDA6b954D16208eccF873D79AC6533833;
address constant EXPECTED_ADDRESS = 0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777;
```

### Vanity Address Pattern
All OmniDragon contracts follow the vanity pattern:
- **Registry**: `0x6940...0777` (Configuration hub)
- **Oracle**: `0x69c1...0777` (Price oracle)
- **OmniDragon**: `0x69dc...2777` (Main token contract)

## Network Configuration

### Chain Registration
```solidity
struct ChainConfig {
    uint32 layerZeroEid;
    bool isSupported;
    bool isPrimary;
    string rpcUrl;
    address oracleAddress;
    uint256 gasLimit;
    uint256 baseFee;
}
```

### Supported Networks
```typescript
const CHAIN_CONFIGS = {
  146: {    // Sonic
    layerZeroEid: 30332,
    isSupported: true,
    isPrimary: true,
    rpcUrl: "https://rpc.soniclabs.com/",
    gasLimit: 500000,
    baseFee: "0.001"
  },
  42161: {  // Arbitrum
    layerZeroEid: 30110,
    isSupported: true,
    isPrimary: false,
    rpcUrl: "https://arbitrum-one.publicnode.com",
    gasLimit: 1000000,
    baseFee: "0.0001"
  },
  1: {      // Ethereum
    layerZeroEid: 30101,
    isSupported: true,
    isPrimary: false,
    rpcUrl: "https://eth.publicnode.com",
    gasLimit: 300000,
    baseFee: "20"
  }
};
```

## Contract Address Registry

### Core Infrastructure
```bash
# Primary contracts (deployed on all chains)
REGISTRY_ADDRESS=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
ORACLE_ADDRESS=0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777
OMNIDRAGON_ADDRESS=0x69dc1c36f8b26db3471acf0a6469d815e9a27777

# Supporting infrastructure
CREATE2_FACTORY=0xAA28020DDA6b954D16208eccF873D79AC6533833
MULTISIG_OWNER=0x1234567890123456789012345678901234567890
```

### Network-Specific Addresses
```typescript
export const NETWORK_CONTRACTS = {
  sonic: {
    registry: "0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777",
    oracle: "0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777",
    omnidragon: "0x69dc1c36f8b26db3471acf0a6469d815e9a27777",
    chainlinkFeed: "0xc76dFb89fF298145b417d221B2c747d84952e01d",
    pythFeed: "0x2880aB155794e7179c9eE2e38200202908C17B43"
  },
  arbitrum: {
    registry: "0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777",
    oracle: "0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777",
    omnidragon: "0x69dc1c36f8b26db3471acf0a6469d815e9a27777",
    chainlinkFeed: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612"
  }
};
```

## Administrative Configuration

### Access Control Setup
```solidity
// Initialize with multi-sig owner
registry.initialize(
    0x1234567890123456789012345678901234567890, // Multi-sig address
    0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777, // Oracle address
    0x69dc1c36f8b26db3471acf0a6469d815e9a27777  // OmniDragon address
);

// Set up role-based permissions
registry.grantRole(ADMIN_ROLE, multisigAddress);
registry.grantRole(UPDATER_ROLE, oracleAddress);
registry.grantRole(READER_ROLE, address(0)); // Public read access
```

### Configuration Updates
```solidity
// Add new supported chain
registry.addChain(
    43114,  // Avalanche Chain ID
    30106,  // LayerZero EID
    "https://api.avax.network/ext/bc/C/rpc",
    true,   // Is supported
    false   // Is primary
);

// Update contract address
registry.setOracleAddress(newOracleAddress);

// Update network configuration
registry.updateChainConfig(
    42161,  // Arbitrum
    ChainConfig({
        layerZeroEid: 30110,
        isSupported: true,
        isPrimary: false,
        rpcUrl: "https://arbitrum-one.publicnode.com",
        oracleAddress: oracleAddress,
        gasLimit: 1000000,
        baseFee: 100000000 // 0.1 gwei
    })
);
```

## LayerZero Integration

### Endpoint Configuration
```typescript
const LAYERZERO_ENDPOINTS = {
  sonic: "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B",
  arbitrum: "0x1a44076050125825900e736c501f859c50fE728c",
  ethereum: "0x1a44076050125825900e736c501f859c50fE728c",
  base: "0x1a44076050125825900e736c501f859c50fE728c",
  hyperliquid: "0x1a44076050125825900e736c501f859c50fE728c"
};

// Set LayerZero configuration
registry.setLayerZeroConfig(
    30332, // Sonic EID
    LAYERZERO_ENDPOINTS.sonic,
    "0xC39161c743D0307EB9BCc9FEF03eeb9Dc4802de7", // Send ULN
    "0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043"  // Receive ULN
);
```

### Peer Configuration
```solidity
// Configure cross-chain peers
struct PeerConfig {
    uint32 eid;
    bytes32 peerAddress;
    bool isActive;
    uint256 gasLimit;
}

PeerConfig[] memory peers = new PeerConfig[](3);
peers[0] = PeerConfig(30110, bytes32(uint256(uint160(arbitrumRegistry))), true, 200000);
peers[1] = PeerConfig(30101, bytes32(uint256(uint160(ethereumRegistry))), true, 150000);
peers[2] = PeerConfig(30184, bytes32(uint256(uint160(baseRegistry))), true, 180000);

registry.configurePeers(peers);
```

## Gas Optimization Configuration

### Gas Limit Settings
```solidity
// Set gas limits per operation type
registry.setGasLimits(
    150000, // Network discovery
    80000,  // Address lookup
    120000, // Chain configuration
    300000  // Route calculation
);

// Configure gas price multipliers
registry.setGasMultipliers(
    110, // 1.1x for standard operations
    150, // 1.5x for urgent operations
    200  // 2.0x for emergency operations
);
```

### Fee Structure
```typescript
const GAS_CONFIGS = {
  sonic: {
    baseGasPrice: "1000000000", // 1 gwei
    priorityFee: "2000000000",  // 2 gwei
    maxGasPrice: "10000000000"  // 10 gwei
  },
  arbitrum: {
    baseGasPrice: "100000000",   // 0.1 gwei
    priorityFee: "100000000",    // 0.1 gwei
    maxGasPrice: "2000000000"    // 2 gwei
  },
  ethereum: {
    baseGasPrice: "20000000000", // 20 gwei
    priorityFee: "2000000000",   // 2 gwei
    maxGasPrice: "100000000000"  // 100 gwei
  }
};
```

## Environment Variables

### Production Configuration
```bash
# Registry settings
REGISTRY_ADMIN=0x1234567890123456789012345678901234567890
REGISTRY_UPDATER=0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777
REGISTRY_MULTISIG_THRESHOLD=3

# Network endpoints
SONIC_RPC=https://rpc.soniclabs.com/
ARBITRUM_RPC=https://arbitrum-one.publicnode.com
ETHEREUM_RPC=https://eth.publicnode.com
BASE_RPC=https://base.publicnode.com

# LayerZero configuration  
LZ_SONIC_ENDPOINT=0x6F475642a6e85809B1c36Fa62763669b1b48DD5B
LZ_ARBITRUM_ENDPOINT=0x1a44076050125825900e736c501f859c50fE728c
LZ_ETHEREUM_ENDPOINT=0x1a44076050125825900e736c501f859c50fE728c

# Gas settings
MAX_GAS_PRICE_GWEI=100
GAS_MULTIPLIER=120
EMERGENCY_GAS_MULTIPLIER=200
```

### Development Configuration
```bash
# Development registry settings
DEV_REGISTRY_ADDRESS=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
DEV_ADMIN=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
DEV_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Test networks
SONIC_TESTNET_RPC=https://rpc.testnet.soniclabs.com/
ARBITRUM_GOERLI_RPC=https://arbitrum-goerli.publicnode.com
ETHEREUM_GOERLI_RPC=https://goerli.publicnode.com

# Lower gas limits for testing
TEST_GAS_LIMIT=100000
TEST_GAS_PRICE=1000000000
```

## Deployment Scripts

### Registry Deployment
```bash
#!/bin/bash
# deploy-registry.sh

echo "Deploying OmniDragonRegistry..."

# Deploy to Sonic (Primary)
forge create \
  --rpc-url $SONIC_RPC \
  --private-key $PRIVATE_KEY \
  --create2 \
  --salt $REGISTRY_SALT \
  contracts/OmniDragonRegistry.sol:OmniDragonRegistry \
  --constructor-args $ADMIN_ADDRESS $ORACLE_ADDRESS

# Deploy to Arbitrum
forge create \
  --rpc-url $ARBITRUM_RPC \
  --private-key $PRIVATE_KEY \
  --create2 \
  --salt $REGISTRY_SALT \
  contracts/OmniDragonRegistry.sol:OmniDragonRegistry \
  --constructor-args $ADMIN_ADDRESS $ORACLE_ADDRESS

echo "Registry deployed to: 0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777"
```

### Configuration Script
```bash
#!/bin/bash
# configure-registry.sh

echo "Configuring OmniDragonRegistry..."

# Add supported chains
cast send $REGISTRY_ADDRESS \
  "addChain(uint256,uint32,string,bool,bool)" \
  146 30332 "https://rpc.soniclabs.com/" true true \
  --rpc-url $SONIC_RPC \
  --private-key $PRIVATE_KEY

cast send $REGISTRY_ADDRESS \
  "addChain(uint256,uint32,string,bool,bool)" \
  42161 30110 "https://arbitrum-one.publicnode.com" true false \
  --rpc-url $ARBITRUM_RPC \
  --private-key $PRIVATE_KEY

echo "Registry configuration complete!"
```

## Monitoring & Maintenance

### Health Check Configuration
```typescript
const HEALTH_CHECK_CONFIG = {
  intervals: {
    addressLookup: 60000,    // 1 minute
    networkConfig: 300000,   // 5 minutes
    peerStatus: 600000,      // 10 minutes
    gasMetrics: 120000       // 2 minutes
  },
  thresholds: {
    maxResponseTime: 5000,   // 5 seconds
    maxGasPrice: 100,        // 100 gwei
    minSuccessRate: 0.95     // 95%
  }
};
```

### Automated Monitoring
```javascript
class RegistryMonitor {
  constructor(registryAddress, networks) {
    this.registryAddress = registryAddress;
    this.networks = networks;
    this.healthMetrics = new Map();
  }
  
  async startMonitoring() {
    setInterval(() => this.checkHealth(), 60000); // Every minute
    setInterval(() => this.validateConfig(), 300000); // Every 5 minutes
    setInterval(() => this.updateMetrics(), 120000); // Every 2 minutes
  }
  
  async checkHealth() {
    for (const [chainId, config] of Object.entries(this.networks)) {
      try {
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);
        const registry = new ethers.Contract(
          this.registryAddress, 
          REGISTRY_ABI, 
          provider
        );
        
        const startTime = Date.now();
        const isSupported = await registry.isChainSupported(chainId);
        const responseTime = Date.now() - startTime;
        
        this.healthMetrics.set(chainId, {
          isHealthy: isSupported,
          responseTime,
          lastCheck: Date.now()
        });
        
      } catch (error) {
        console.error(`Health check failed for chain ${chainId}:`, error);
        this.healthMetrics.set(chainId, {
          isHealthy: false,
          error: error.message,
          lastCheck: Date.now()
        });
      }
    }
  }
}
```

---

**Registry configuration is critical for seamless cross-chain operations**
