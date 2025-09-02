---
title: OmniDragon Oracle — Overview
sidebar_position: 10
---

# OmniDragon Oracle System - Complete Technical Documentation

## Executive Summary

The OmniDragon Oracle is a multi-chain price aggregation system that provides real-time DRAGON/USD and native token pricing data across Sonic and Arbitrum networks. The system uses LayerZero for cross-chain communication and aggregates data from multiple oracle sources for maximum reliability and accuracy.

**Primary Oracle Address**: `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777` (Same on both Sonic and Arbitrum)

## System Architecture

### Core Components

1. **OmniDragonOracle Contract**: Main price aggregation contract inheriting from LayerZero OAppRead
2. **OmniDragonRegistry**: Central configuration registry for cross-chain coordination  
3. **LayerZero Integration**: Cross-chain communication infrastructure
4. **Multi-Oracle Aggregation**: Chainlink, Pyth, Band Protocol, and API3 integration

### Network Topology

```
Sonic (PRIMARY) ←→ LayerZero ←→ Arbitrum (SECONDARY)
     ↓                              ↓
Price Oracles:                Price Fetched from
- Chainlink                   Sonic via LayerZero
- Pyth Network               
- Band Protocol              
- API3                       
```

### Oracle Modes

- **PRIMARY**: Actively aggregates prices from multiple oracle sources
- **SECONDARY**: Fetches price data from PRIMARY Oracle via LayerZero cross-chain reads

## Contract Specifications

### OmniDragonOracle.sol

**Inheritance Chain:**
- `OAppOptionsType3` (LayerZero executor options)
- `OAppRead` (LayerZero cross-chain reads)
- `IOAppMapper` (LayerZero message mapping)
- `IOAppReducer` (LayerZero response aggregation)

**Key Functions:**
- `getLatestPrice()`: Returns (DRAGON price, timestamp, Native price, validity, native timestamp)
- `requestPrice(uint32 _targetEid, bytes calldata _extraOptions)`: Cross-chain price request
- `updatePrice()`: Updates price on PRIMARY Oracle
- `setMode(OracleMode newMode)`: Switch between PRIMARY/SECONDARY modes
- `setPeer(uint32 _eid, address _oracle, bool _active)`: Configure cross-chain peers
- `setEnforcedOptions((uint32,uint16,bytes)[])`: Set LayerZero execution options

### Oracle Sources Configuration

#### Sonic Network Sources
```solidity
// Chainlink S/USD Feed
address constant SONIC_CHAINLINK_S_USD_FEED = 0xc76dFb89fF298145b417d221B2c747d84952e01d;

// Pyth Network Feed  
address constant SONIC_PYTH_FEED = 0x2880aB155794e7179c9eE2e38200202908C17B43;
bytes32 constant PYTH_S_USD_PRICE_ID = 0xf490b178d0c85683b7a0f2388b40af2e6f7c90cbe0f96b31f315f08d0e5a2d6d;

// Band Protocol Feed
address constant SONIC_BAND_FEED = 0x506085050Ea5494Fe4b89Dd5BEa659F506F470Cc;

// API3 Feed
address constant SONIC_API3_FEED = 0x726D2E87d73567ecA1b75C063Bd09c1493655918;
```

#### Arbitrum Network Sources
```solidity
// Chainlink ETH/USD Feed (for Native token pricing)
address constant ARBITRUM_CHAINLINK_ETH_USD_FEED = 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;

// Pyth Network Feed
address constant ARBITRUM_PYTH_FEED = 0xff1a0f4744e8582DF1aE09D5611b887B6a12925C;
bytes32 constant ARBITRUM_PYTH_ETH_USD_ID = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace;
```

## LayerZero Configuration

### Network Endpoints and Chain IDs

```typescript
// LayerZero Endpoint IDs
Sonic EID: 30332
Arbitrum EID: 30110

// Network Chain IDs  
Sonic Chain ID: 146
Arbitrum Chain ID: 42161
```

### LayerZero Infrastructure Addresses

#### Sonic Mainnet
```solidity
LZ_ENDPOINT_V2: 0x6F475642a6e85809B1c36Fa62763669b1b48DD5B
SEND_ULN_302: 0xC39161c743D0307EB9BCc9FEF03eeb9Dc4802de7
RECEIVE_ULN_302: 0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043
READ_LIB_1002: 0x860E8D714944E7accE4F9e6247923ec5d30c0471
LZ_EXECUTOR: 0x4208D6E27538189bB48E603D6123A94b8Abe0A0b
LZ_DVN: 0x282b3386571f7f794450d5789911a9804fa346b4
LZ_READ_DVN: 0x78f607fc38e071ceb8630b7b12c358ee01c31e96
READ_CHANNEL_ID: 4294967295
```

#### Arbitrum Mainnet
```solidity
LZ_ENDPOINT_V2: 0x1a44076050125825900e736c501f859c50fE728c
SEND_ULN_302: 0x975bcD720be66659e3EB3C0e4F1866a3020E493A
RECEIVE_ULN_302: 0x7B9E184e07a6EE1aC23eAe0fe8D6Be2f663f05e6
READ_LIB_1002: 0xbcd4CADCac3F767C57c4F402932C4705DF62BEFf
LZ_EXECUTOR: 0x31CAe3B7fB82d847621859fb1585353c5720660D
LZ_DVN: 0x2f55c492897526677c5b68fb199ea31e2c126416
LZ_READ_DVN: 0x1308151a7ebac14f435d3ad5ff95c34160d539a5
READ_CHANNEL_ID: 4294967295
```

## Deployment Process

### 1. Vanity Address Generation

The Oracle contracts are deployed to a vanity address starting with `0x69` and ending with `777` using CREATE2 deterministic deployment.

**Salt Used**: `0x50ad0b6ce868db473641530bb0b17dc8e206718ec1eecb863a525053be5de3c5`
**Factory**: `0xAA28020DDA6b954D16208eccF873D79AC6533833`
**Result**: `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777`

### 2. Contract Size Optimization

The Oracle contract required aggressive optimization to fit within the EIP-170 size limit (24,576 bytes):
- Custom error implementations
- String literal shortening  
- Function name optimization
- Removal of unused code paths
- Comment minimization

### 3. Deployment Scripts

#### Sonic Deployment (PRIMARY)
```solidity
// deploy/DeployOracleVanity.s.sol
contract DeployOracleVanity is Script {
    bytes32 constant SALT = 0x50ad0b6ce868db473641530bb0b17dc8e206718ec1eecb863a525053be5de3c5;
    address constant CREATE2_FACTORY = 0xAA28020DDA6b954D16208eccF873D79AC6533833;
    
    function run() external {
        // Deploy to vanity address using CREATE2
    }
}
```

#### Arbitrum Deployment (SECONDARY)
```solidity
// deploy/DeployOracleArbitrum.s.sol - Uses same salt for same address
```

### 4. Configuration Scripts

#### Primary Oracle Configuration
```solidity
// deploy/SetOraclePrimary.s.sol
// Sets Oracle to PRIMARY mode and configures all oracle sources
```

#### LayerZero Peer Configuration
```solidity
// deploy/SetOracleDelegate.s.sol  
// Configures cross-chain peer connections
```

## LayerZero Integration Details

### OApp Read Configuration

The system uses LayerZero's OApp Read functionality for cross-chain price requests:

```typescript
// layerzero-oracle.config.ts
const primary: OmniPointHardhat = {
  eid: EndpointId.SONIC_V2_MAINNET,
  contractName: 'OmniDragonOracle',
  address: '0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777',
}

const secondaryArb: OmniPointHardhat = {
  eid: EndpointId.ARBITRUM_V2_MAINNET,
  contractName: 'OmniDragonOracle', 
  address: '0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777',
}
```

### Read Channel Configuration

```typescript
readChannelConfigs: [
  {
    channelId: 4294967295,
    active: true,
    readLibrary: '0x860E8D714944E7accE4F9e6247923ec5d30c0471', // Sonic
    ulnConfig: {
      confirmations: 1,
      requiredDVNs: ['0x78f607fc38e071ceb8630b7b12c358ee01c31e96'],
      optionalDVNs: [],
      optionalDVNThreshold: 0,
    },
    executorConfig: {
      executor: '0x4Cf1B3Fa61465c2c907f82fC488B43223BA0CF93',
      maxMessageSize: 10000,
      gasLimit: 200000,
    },
  },
]
```

### Enforced Options Setup

LayerZero enforced options are configured directly on the contracts:

```solidity
// Set enforced options for automatic gas limit inclusion
oracle.setEnforcedOptions([
    (30332, 1, hex"00030100030100000000000000000000000000030d40") // 200k gas
]);
```

## Price Calculation System

### DRAGON Price Algorithm

1. **Native Token Price Aggregation**: Combines Chainlink, Pyth, Band, and API3 feeds
2. **DEX Pair Integration**: Uses DRAGON/Native pair for ratio calculation  
3. **TWAP Calculation**: Time-weighted average price from DEX (when available)
4. **Final Calculation**: `DRAGON_USD = (DRAGON/Native_Ratio) × Native_USD_Price`

### Price Format

All prices are returned in **8-decimal format**:
- DRAGON/USD: `131496` = $0.00131496
- Native/USD: `30265489` = $0.30265489

### Aggregation Weights

Each oracle source has configurable weights for price aggregation:
- Chainlink: Weight 25
- Pyth: Weight 25  
- Band: Weight 25
- API3: Weight 25

## Integration Guide

### Web3 Integration Example

```javascript
const Web3 = require('web3');
const web3 = new Web3('https://rpc.soniclabs.com/');

const ORACLE_ADDRESS = '0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777';
const ORACLE_ABI = [
  {
    "inputs": [],
    "name": "getLatestPrice", 
    "outputs": [
      {"type": "int256", "name": "dragonUsd8"},
      {"type": "uint256", "name": "timestamp"},
      {"type": "int256", "name": "nativeUsd8"}, 
      {"type": "bool", "name": "isValid"},
      {"type": "uint256", "name": "nativeTimestamp"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const oracleContract = new web3.eth.Contract(ORACLE_ABI, ORACLE_ADDRESS);

async function getDragonPrice() {
  const result = await oracleContract.methods.getLatestPrice().call();
  const dragonPriceUSD = parseInt(result.dragonUsd8) / 1e8;
  const nativePriceUSD = parseInt(result.nativeUsd8) / 1e8; 
  
  return {
    dragonPrice: dragonPriceUSD,
    nativePrice: nativePriceUSD,
    timestamp: result.timestamp,
    isValid: result.isValid
  };
}
```

### Ethers.js Integration

```javascript
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://rpc.soniclabs.com/');
const oracleContract = new ethers.Contract(
  '0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777',
  ORACLE_ABI,
  provider
);

async function getPriceData() {
  const [dragonUsd8, timestamp, nativeUsd8, isValid, nativeTimestamp] = 
    await oracleContract.getLatestPrice();
    
  return {
    dragonPrice: Number(dragonUsd8) / 1e8,
    nativePrice: Number(nativeUsd8) / 1e8,
    timestamp: Number(timestamp),
    isValid,
    nativeTimestamp: Number(nativeTimestamp)
  };
}
```

## Security Considerations

### Oracle Security Features

1. **Multi-Source Aggregation**: Reduces single point of failure
2. **Staleness Protection**: Rejects outdated price feeds
3. **Weight-Based Validation**: Requires minimum weight threshold
4. **Emergency Mode**: Owner can pause operations
5. **Access Controls**: Owner-only administrative functions

### Cross-Chain Security

1. **LayerZero DVN Verification**: Uses decentralized verifier networks
2. **Peer Validation**: Only authorized peer contracts can communicate  
3. **Message Authentication**: LayerZero message integrity verification
4. **Gas Limit Enforcement**: Prevents execution DOS attacks

## Troubleshooting Guide

### Common Issues

#### 1. Oracle Returns Zero Prices
**Cause**: Oracle not in PRIMARY mode or sources not configured
**Solution**: 
```solidity
oracle.setMode(OracleMode.PRIMARY);
oracle.setPullOracle(OracleId.CHAINLINK, true, 30, 3600, CHAINLINK_FEED, bytes32(0));
```

#### 2. Cross-Chain Requests Fail
**Cause**: Insufficient gas or improper LayerZero configuration
**Solution**:
```solidity
// Fund the contract
oracle.receive{value: 0.003 ether}();

// Set enforced options
oracle.setEnforcedOptions([(30332, 1, hex"00030100030100000000000000000000000000030d40")]);
```

#### 3. Price Staleness Issues  
**Cause**: Oracle feeds not updating
**Solution**: Check individual feed staleness and update configuration

### LayerZero Configuration Issues

#### Invalid Worker Options Error
This occurs when LayerZero executor options are malformed:
```solidity
// Correct format: Type 3, Executor Option, Gas Limit 200000
bytes memory options = hex"00030100030100000000000000000000000000030d40";
```

#### DVN Configuration
Ensure correct DVN addresses for LZ Read operations:
- Sonic: `0x78f607fc38e071ceb8630b7b12c358ee01c31e96`
- Arbitrum: `0x1308151a7ebac14f435d3ad5ff95c34160d539a5`

## Contract Verification

### Sonic Network Verification
```bash
forge verify-contract \
  --chain sonic \
  --etherscan-api-key $SONIC_API_KEY \
  0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777 \
  contracts/core/oracles/OmniDragonOracle.sol:OmniDragonOracle
```

### Arbitrum Network Verification
```bash
forge verify-contract \
  --chain arbitrum \
  --etherscan-api-key $ARBITRUM_API_KEY \
  0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777 \
  contracts/core/oracles/OmniDragonOracle.sol:OmniDragonOracle
```

## Monitoring and Maintenance

### Price Feed Monitoring

Monitor individual oracle sources for:
- Price deviation (>5% from aggregate)
- Staleness (>1 hour old)
- Feed availability
- Gas costs for updates

### Contract Health Checks

```solidity
// Check Oracle status
uint256 mode = oracle.mode(); // 0=SECONDARY, 1=PRIMARY
(int256 price, uint256 timestamp,,bool isValid,) = oracle.getLatestPrice();

// Validate price freshness
require(block.timestamp - timestamp < 3600, "Price stale");
require(isValid, "Price invalid");
require(price > 0, "Invalid price");
```

### LayerZero Maintenance

- Monitor cross-chain message delivery
- Check DVN performance and costs
- Update executor gas limits as needed
- Monitor contract gas balances

## Cost Analysis

### Deployment Costs
- Sonic Deployment: ~0.5 S
- Arbitrum Deployment: ~0.002 ETH
- Configuration: ~0.1 S + 0.001 ETH

### Operational Costs  
- Price Updates (PRIMARY): ~0.01-0.05 S per update
- Cross-Chain Requests: ~0.001-0.003 ETH per request
- Oracle Feed Calls: Gas varies by source

### Gas Optimization Tips
1. Batch multiple configuration calls
2. Use enforced options to prevent gas estimation failures
3. Monitor and adjust staleness thresholds
4. Consider price update frequency vs cost

## Future Enhancements

### Planned Features
1. Additional Chains: Avalanche, Base, Optimism support
2. Advanced TWAP: Multi-pair aggregation
3. Price Volatility Metrics: Standard deviation calculations
4. Historical Data: On-chain price history storage
5. Automated Rebalancing: Dynamic weight adjustment

### Technical Improvements
1. Gas Optimization: Further contract size reduction
2. Oracle Source Expansion: Additional price feed integrations  
3. Cross-Chain Efficiency: Reduced LayerZero costs
4. Monitoring Integration: Automated health checks

## Conclusion

The OmniDragon Oracle system provides a robust, multi-chain price aggregation solution with LayerZero cross-chain capabilities. The system is designed for high reliability, security, and cost-effectiveness while maintaining easy integration for dApps and games.

**Key Achievements:**
- Deployed to identical vanity addresses on both chains
- Multi-oracle price aggregation with 99.9% uptime target
- LayerZero cross-chain communication infrastructure
- Comprehensive monitoring and security features
- Production-ready game integration patterns

The Oracle is fully operational on Sonic mainnet and ready for immediate integration into price prediction games and other DeFi applications.


