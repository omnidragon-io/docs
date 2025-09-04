---
title: OmniDragon Registry — Overview
sidebar_position: 10
---

# OmniDragon Registry Infrastructure

> **Central configuration registry for cross-chain coordination in the OmniDragon ecosystem**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![LayerZero](https://img.shields.io/badge/LayerZero%20V2-Compatible-6366f1?style=flat-square)](https://layerzero.network/)
[![Multi-Chain](https://img.shields.io/badge/Multi--Chain-Registry-22c55e?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://opensource.org/licenses/MIT)

## Overview

The OmniDragonRegistry serves as the **central configuration hub** for the entire OmniDragon cross-chain ecosystem. It provides unified contract addresses, network configurations, and routing information across all supported blockchains.

### Key Features
- **Cross-Chain Coordination**: Unified configuration across all supported networks
- **Vanity Address Management**: Consistent `0x69...0777` addresses across chains
- **Network Discovery**: Automatic network detection and routing
- **Configuration Registry**: Centralized storage for contract addresses and settings
- **Multi-Chain Deployment**: Identical contracts deployed on all supported networks
- **Gas Optimization**: Efficient cross-chain lookups and routing

**Registry Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` (Same on all networks)

## Architecture

```
┌─────────────────┐    Registry Query    ┌─────────────────┐
│   CLIENT APP    │◄───────────────────►│ OMNIDRAGON      │
│                 │                      │ REGISTRY        │
│ - Network Auto  │                      │                 │
│   Detection     │                      │ ┌─────────────┐ │
│ - Contract      │                      │ │Config Store │ │
│   Discovery     │                      │ │• Addresses  │ │
│ - Route Lookup  │                      │ │• Networks   │ │
└─────────────────┘                      │ │• Endpoints  │ │
                                         │ │• Routing    │ │
┌─────────────────┐    LayerZero Data    │ └─────────────┘ │
│   ORACLE NET    │◄───────────────────►│                 │
│                 │                      │ ┌─────────────┐ │
│ - Price Feeds   │                      │ │Chain Config │ │
│ - Cross-Chain   │                      │ │• Chain IDs  │ │
│   Communication │                      │ │• LZ EIDs    │ │
│ - Peer Discovery│                      │ │• Gas Limits │ │
└─────────────────┘                      │ └─────────────┘ │
                                         └─────────────────┘
```

## Supported Networks

The OmniDragonRegistry is deployed on all networks supported by the OmniDragon ecosystem:

### Primary Network
| Network | Chain ID | LayerZero EID | Registry Address |
|---------|----------|---------------|------------------|
| **Sonic** | 146 | 30332 | `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` |

### Secondary Networks
| Network | Chain ID | LayerZero EID | Registry Address |
|---------|----------|---------------|------------------|
| **Arbitrum** | 42161 | 30110 | `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` |
| **Ethereum** | 1 | 30101 | `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` |
| **Base** | 8453 | 30184 | `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` |
| **Hyperliquid** | 999 | 30377 | `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` |
| **Unichain** | TBD | TBD | `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` |
| **Avalanche** | 43114 | 30106 | `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` |

## Core Functions

### Contract Discovery
```solidity
// Get Oracle address for current chain
function getOracleAddress() external view returns (address oracle)

// Get Oracle address for specific chain
function getOracleAddress(uint256 chainId) external view returns (address oracle)

// Get all contract addresses
function getAllAddresses() external view returns (
    address oracle,
    address registry,
    address omnidragon,
    address factory
)
```

### Network Information
```solidity
// Get chain configuration
function getChainConfig(uint256 chainId) external view returns (
    uint32 layerZeroEid,
    bool isSupported,
    bool isPrimary,
    string memory rpcUrl
)

// Get LayerZero EID from chain ID
function getLayerZeroEid(uint256 chainId) external view returns (uint32 eid)

// Check if chain is supported
function isChainSupported(uint256 chainId) external view returns (bool supported)
```

### Cross-Chain Routing
```solidity
// Get optimal route for cross-chain operations
function getOptimalRoute(uint256 fromChain, uint256 toChain) 
    external view returns (
        uint32[] memory intermediateEids,
        uint256 estimatedGas,
        uint256 estimatedFee
    )

// Get peer addresses for LayerZero
function getPeerAddress(uint32 eid) external view returns (bytes32 peer)
```

## Integration Examples

### Frontend Integration

#### Web3.js Example
```javascript
const Web3 = require('web3');

const REGISTRY_ADDRESS = '0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777';
const REGISTRY_ABI = [
  {
    "inputs": [],
    "name": "getOracleAddress",
    "outputs": [{"type": "address", "name": "oracle"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "chainId"}],
    "name": "getChainConfig", 
    "outputs": [
      {"type": "uint32", "name": "layerZeroEid"},
      {"type": "bool", "name": "isSupported"},
      {"type": "bool", "name": "isPrimary"},
      {"type": "string", "name": "rpcUrl"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function initializeOmniDragon() {
  // Auto-detect network
  const chainId = await web3.eth.getChainId();
  
  // Get Registry contract
  const registry = new web3.eth.Contract(REGISTRY_ABI, REGISTRY_ADDRESS);
  
  // Get Oracle address for current chain
  const oracleAddress = await registry.methods.getOracleAddress().call();
  
  // Get chain configuration
  const [eid, isSupported, isPrimary, rpcUrl] = await registry.methods
    .getChainConfig(chainId).call();
    
  console.log({
    chainId,
    oracleAddress,
    layerZeroEid: eid,
    isSupported,
    isPrimary
  });
  
  return { oracleAddress, layerZeroEid: eid };
}
```

#### Ethers.js Example
```javascript
const { ethers } = require('ethers');

class OmniDragonRegistry {
  constructor(providerOrSigner) {
    this.provider = providerOrSigner;
    this.address = '0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777';
    this.contract = new ethers.Contract(this.address, REGISTRY_ABI, this.provider);
  }
  
  async discoverNetwork() {
    const network = await this.provider.getNetwork();
    const chainId = network.chainId;
    
    const config = await this.contract.getChainConfig(chainId);
    const oracleAddress = await this.contract.getOracleAddress();
    
    return {
      chainId: Number(chainId),
      layerZeroEid: config.layerZeroEid,
      isSupported: config.isSupported,
      isPrimary: config.isPrimary,
      oracleAddress,
      rpcUrl: config.rpcUrl
    };
  }
  
  async getOptimalRoute(toChainId) {
    const fromChainId = (await this.provider.getNetwork()).chainId;
    return await this.contract.getOptimalRoute(fromChainId, toChainId);
  }
}
```

### Contract Integration
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IOmniDragonRegistry {
    function getOracleAddress() external view returns (address);
    function getChainConfig(uint256 chainId) external view returns (
        uint32 layerZeroEid, bool isSupported, bool isPrimary, string memory rpcUrl
    );
}

contract GameContract {
    IOmniDragonRegistry constant registry = IOmniDragonRegistry(0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777);
    
    function getPriceFromOracle() external view returns (int256 price, uint256 timestamp) {
        address oracleAddress = registry.getOracleAddress();
        // Call oracle contract...
    }
    
    function checkNetworkSupport(uint256 targetChainId) external view returns (bool) {
        (, bool isSupported,,) = registry.getChainConfig(targetChainId);
        return isSupported;
    }
}
```

## Configuration Management

### Environment Setup
```bash
# Registry addresses (same on all chains)
REGISTRY_SONIC=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
REGISTRY_ARBITRUM=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
REGISTRY_ETHEREUM=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
REGISTRY_BASE=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
REGISTRY_HYPERLIQUID=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
REGISTRY_UNICHAIN=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
REGISTRY_AVALANCHE=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777

# Supporting contracts
ORACLE_ADDRESS=0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777
OMNIDRAGON_ADDRESS=0x69dc1c36f8b26db3471acf0a6469d815e9a27777
CREATE2_FACTORY_ADDRESS=0xAA28020DDA6b954D16208eccF873D79AC6533833
```

### Network Configuration
```typescript
// registry.config.ts
export const REGISTRY_CONFIG = {
  address: '0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777',
  networks: {
    sonic: {
      chainId: 146,
      layerZeroEid: 30332,
      rpc: 'https://rpc.soniclabs.com/',
      isPrimary: true,
      explorer: 'https://explorer.soniclabs.com/'
    },
    arbitrum: {
      chainId: 42161,
      layerZeroEid: 30110,
      rpc: 'https://arbitrum-one.publicnode.com',
      isPrimary: false,
      explorer: 'https://arbiscan.io/'
    },
    ethereum: {
      chainId: 1,
      layerZeroEid: 30101,
      rpc: 'https://eth.publicnode.com',
      isPrimary: false,
      explorer: 'https://etherscan.io/'
    },
    base: {
      chainId: 8453,
      layerZeroEid: 30184,
      rpc: 'https://base.publicnode.com',
      isPrimary: false,
      explorer: 'https://basescan.org/'
    }
  }
};
```

## Security Features

- **Immutable Addresses**: Registry addresses are consistent across all chains
- **Access Control**: Only authorized addresses can update configurations
- **Multi-Signature**: Critical updates require multi-sig approval
- **Vanity Pattern**: All addresses follow `0x69...0777` pattern for easy verification
- **Cross-Chain Verification**: Network configurations verified across chains

## Performance & Gas Costs

### Gas Costs
- **Network discovery**: ~15,000 gas
- **Address lookup**: ~3,000 gas  
- **Chain configuration**: ~8,000 gas
- **Route calculation**: ~25,000 gas

### Optimization Tips
1. Cache frequently accessed addresses locally
2. Batch multiple lookups in single call
3. Use view functions for read-only operations
4. Pre-compute routes for known chain pairs

## Troubleshooting

### Common Issues

#### 1. Network Not Supported
**Cause**: Chain not added to registry configuration  
**Solution**: Check `isChainSupported()` before operations

#### 2. Address Lookup Fails
**Cause**: Registry not deployed on current chain  
**Solution**: Verify registry deployment status

#### 3. Outdated Configuration
**Cause**: Registry configuration out of sync  
**Solution**: Update to latest registry version

### Health Check
```javascript
// Check registry health
async function checkRegistryHealth(chainId) {
  const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider);
  
  try {
    const [eid, isSupported, isPrimary] = await registry.getChainConfig(chainId);
    const oracleAddress = await registry.getOracleAddress();
    
    return {
      registryHealthy: true,
      isSupported,
      isPrimary,
      layerZeroEid: eid,
      oracleAddress,
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      registryHealthy: false,
      error: error.message,
      timestamp: Date.now()
    };
  }
}
```

## API Reference

### Core Functions
| Function | Description | Returns |
|----------|-------------|---------|
| `getOracleAddress()` | Get Oracle contract address | `address` |
| `getChainConfig(chainId)` | Get chain configuration | `(uint32, bool, bool, string)` |
| `getAllAddresses()` | Get all contract addresses | `(address, address, address, address)` |
| `isChainSupported(chainId)` | Check if chain is supported | `bool` |

### Network Functions
| Function | Description | Gas Cost |
|----------|-------------|----------|
| `getLayerZeroEid(chainId)` | Get LayerZero EID for chain | ~5,000 gas |
| `getPeerAddress(eid)` | Get peer address for EID | ~3,000 gas |
| `getOptimalRoute(from, to)` | Calculate optimal route | ~25,000 gas |

### Events
```solidity
event ChainAdded(uint256 indexed chainId, uint32 indexed layerZeroEid);
event AddressUpdated(bytes32 indexed key, address indexed newAddress);
event ConfigurationUpdated(uint256 indexed chainId, bytes32 configHash);
```

---

**Built for seamless cross-chain coordination in the OmniDragon ecosystem**
