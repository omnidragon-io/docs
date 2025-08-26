# OmniDragon Oracle - Technical Reference & Configuration Guide

## Environment Configuration (.env)

### Core Contract Addresses
```bash
# Main Oracle (Same address on both chains)
ORACLE_ADDRESS=0x69B96004C850722B98bF307a1e8dd259713A5777

# Supporting Infrastructure
REGISTRY_ADDRESS=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
CREATE2_FACTORY_ADDRESS=0xAA28020DDA6b954D16208eccF873D79AC6533833
OMNIDRAGON_ADDRESS=0x69dc1c36f8b26db3471acf0a6469d815e9a27777

# Deployment Salt (for vanity address generation)
ORACLE_SALT=0x50ad0b6ce868db473641530bb0b17dc8e206718ec1eecb863a525053be5de3c5
```

### Network RPC URLs
```bash
# Sonic Network
RPC_URL_SONIC=https://rpc.soniclabs.com/
SONIC_CHAIN_ID=146

# Arbitrum Network  
RPC_URL_ARBITRUM=https://arbitrum-one.publicnode.com
ARBITRUM_CHAIN_ID=42161
```

### Oracle Feed Addresses

#### Sonic Mainnet Feeds
```bash
# Native Token (S) Price Feeds
SONIC_CHAINLINK_S_USD_FEED=0xc76dFb89fF298145b417d221B2c747d84952e01d
SONIC_PYTH_FEED=0x2880aB155794e7179c9eE2e38200202908C17B43
SONIC_BAND_FEED=0x506085050Ea5494Fe4b89Dd5BEa659F506F470Cc
SONIC_API3_FEED=0x726D2E87d73567ecA1b75C063Bd09c1493655918

# Price Feed IDs
CHAINLINK_S_USD_FEED_ID=0x0003bda9e85d7d4eccc82d4a5f5f074ce25ff7ba23892ca3abf2ea0d2250ad11
PYTH_S_USD_PRICE_ID=0xf490b178d0c85683b7a0f2388b40af2e6f7c90cbe0f96b31f315f08d0e5a2d6d

# DEX Integration
WRAPPED_SONIC_TOKEN=0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38
DRAGON_S_LP_POOL=0x33503bc86f2808151a6e083e67d7d97a66dfec11
```

#### Arbitrum Mainnet Feeds
```bash
# Native Token (ETH) Price Feeds  
ARBITRUM_CHAINLINK_ETH_USD_FEED=0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612
ARBITRUM_PYTH_FEED=0xff1a0f4744e8582DF1aE09D5611b887B6a12925C
ARBITRUM_PYTH_ETH_USD_ID=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace

# CREATE2 Factory
ARBITRUM_CREATE2_FACTORY=0xAA28020DDA6b954D16208eccF873D79AC6533833
```

### LayerZero Configuration

#### Sonic Network LayerZero
```bash
# Core LayerZero Infrastructure
SONIC_LZ_ENDPOINT_V2=0x6F475642a6e85809B1c36Fa62763669b1b48DD5B
SONIC_SEND_ULN_302=0xC39161c743D0307EB9BCc9FEF03eeb9Dc4802de7
SONIC_RECEIVE_ULN_302=0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043
SONIC_READ_LIB_1002=0x860E8D714944E7accE4F9e6247923ec5d30c0471

# LayerZero Workers and DVNs
SONIC_LZ_EXECUTOR=0x4208D6E27538189bB48E603D6123A94b8Abe0A0b  
SONIC_LZ_DVN=0x282b3386571f7f794450d5789911a9804fa346b4
SONIC_LZ_READ_DVN=0x78f607fc38e071ceb8630b7b12c358ee01c31e96
SONIC_LZ_DEAD_DVN=0x6788f52439ACA6BFF597d3eeC2DC9a44B8FEE842

# Channel Configuration
SONIC_LZ_READ_CHANNEL_ID=4294967295
SONIC_EID=30332
```

#### Arbitrum Network LayerZero
```bash  
# Core LayerZero Infrastructure
ARBITRUM_LZ_ENDPOINT_V2=0x1a44076050125825900e736c501f859c50fE728c
ARBITRUM_SEND_ULN_302=0x975bcD720be66659e3EB3C0e4F1866a3020E493A
ARBITRUM_RECEIVE_ULN_302=0x7B9E184e07a6EE1aC23eAe0fe8D6Be2f663f05e6
ARBITRUM_READ_LIB_1002=0xbcd4CADCac3F767C57c4F402932C4705DF62BEFf

# LayerZero Workers and DVNs
ARBITRUM_LZ_EXECUTOR=0x31CAe3B7fB82d847621859fb1585353c5720660D
ARBITRUM_LZ_DVN=0x2f55c492897526677c5b68fb199ea31e2c126416
ARBITRUM_LZ_READ_DVN=0x1308151a7ebac14f435d3ad5ff95c34160d539a5
ARBITRUM_LZ_DEAD_DVN=0x758C419533ad64Ce9D3413BC8d3A97B026098EC1

# Channel Configuration  
ARBITRUM_LZ_READ_CHANNEL_ID=4294967295
ARBITRUM_EID=30110
```

## Deployment Scripts Reference

### 1. Vanity Address Deployment (Sonic)

**File**: `deploy/DeployOracleVanity.s.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/core/oracles/OmniDragonOracle.sol";

contract DeployOracleVanity is Script {
    
    bytes32 constant SALT = 0x50ad0b6ce868db473641530bb0b17dc8e206718ec1eecb863a525053be5de3c5;
    address constant CREATE2_FACTORY = 0xAA28020DDA6b954D16208eccF873D79AC6533833;
    address constant REGISTRY = 0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777;
    address constant LZ_ENDPOINT = 0x6F475642a6e85809B1c36Fa62763669b1b48DD5B;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("=== DEPLOYING OMNIDRAGON ORACLE TO VANITY ADDRESS ===");
        
        // Predict address
        bytes memory bytecode = abi.encodePacked(
            type(OmniDragonOracle).creationCode,
            abi.encode(LZ_ENDPOINT, REGISTRY)
        );
        
        address predictedAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            CREATE2_FACTORY,
            SALT,
            keccak256(bytecode)
        )))));
        
        console.log("Predicted Address:", predictedAddress);
        console.log("Target Pattern: 0x69...777");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy using CREATE2
        (bool success, bytes memory result) = CREATE2_FACTORY.call(
            abi.encodeWithSignature("deploy(bytes32,bytes)", SALT, bytecode)
        );
        
        require(success, "Deployment failed");
        
        address deployedAddress = abi.decode(result, (address));
        console.log("SUCCESS: Oracle deployed to", deployedAddress);
        
        vm.stopBroadcast();
    }
}
```

### 2. Arbitrum Deployment (Same Address)

**File**: `deploy/DeployOracleArbitrum.s.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/core/oracles/OmniDragonOracle.sol";

contract DeployOracleArbitrum is Script {
    
    bytes32 constant SALT = 0x50ad0b6ce868db473641530bb0b17dc8e206718ec1eecb863a525053be5de3c5;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address factory = vm.envAddress("ARBITRUM_CREATE2_FACTORY");
        address registry = vm.envAddress("REGISTRY_ADDRESS");
        address lzEndpoint = vm.envAddress("ARBITRUM_LZ_ENDPOINT_V2");
        
        console.log("Deploying Oracle to Arbitrum with same vanity address...");
        
        vm.startBroadcast(deployerPrivateKey);
        
        bytes memory bytecode = abi.encodePacked(
            type(OmniDragonOracle).creationCode,
            abi.encode(lzEndpoint, registry)
        );
        
        (bool success, bytes memory result) = factory.call(
            abi.encodeWithSignature("deploy(bytes32,bytes)", SALT, bytecode)
        );
        
        require(success, "Arbitrum deployment failed");
        address deployedAddress = abi.decode(result, (address));
        
        console.log("SUCCESS: Oracle deployed to", deployedAddress);
        
        vm.stopBroadcast();
    }
}
```

### 3. Primary Oracle Configuration

**File**: `deploy/SetOraclePrimary.s.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/core/oracles/OmniDragonOracle.sol";

contract SetOraclePrimary is Script {
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address oracleAddress = vm.envAddress("ORACLE_ADDRESS");
        
        OmniDragonOracle oracle = OmniDragonOracle(payable(oracleAddress));
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Set to PRIMARY mode
        oracle.setMode(OmniDragonOracle.OracleMode.PRIMARY);
        
        // Configure Chainlink (30% weight)
        oracle.setPullOracle(
            OmniDragonOracle.OracleId.CHAINLINK,
            true,    // active
            30,      // weight  
            3600,    // staleness
            vm.envAddress("SONIC_CHAINLINK_S_USD_FEED"),
            bytes32(0)
        );
        
        // Configure Pyth (25% weight)
        oracle.setPullOracle(
            OmniDragonOracle.OracleId.PYTH,
            true,
            25,
            1800,
            vm.envAddress("SONIC_PYTH_FEED"), 
            vm.envBytes32("PYTH_S_USD_PRICE_ID")
        );
        
        // Configure Band Protocol (25% weight)
        oracle.setPushOracle(
            OmniDragonOracle.OracleId.BAND,
            true,
            25,
            3600,
            vm.envAddress("SONIC_BAND_FEED"),
            "S"
        );
        
        // Configure API3 (20% weight)
        oracle.setPushOracle(
            OmniDragonOracle.OracleId.API3,
            true,
            20,
            3600,
            vm.envAddress("SONIC_API3_FEED"),
            "S"
        );
        
        vm.stopBroadcast();
        
        // Display current prices
        (int256 dragonPrice, uint256 timestamp, int256 nativePrice, bool isValid, uint256 nativeTs) = 
            oracle.getLatestPrice();
            
        console.log("=== ORACLE CONFIGURATION COMPLETE ===");
        console.log("Updated DRAGON Price: %d (8-decimals, divide by 1e8 for USD)", uint256(dragonPrice));
        console.log("Updated Native Price: %d (8-decimals, divide by 1e8 for USD)", uint256(nativePrice));
        console.log("Oracle Valid: %s", isValid ? "true" : "false");
        console.log("Timestamp: %d", timestamp);
    }
}
```

### 4. LayerZero Peer Configuration  

**File**: `deploy/SetOracleDelegate.s.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/core/oracles/OmniDragonOracle.sol";

contract SetOracleDelegate is Script {
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address oracleAddress = vm.envAddress("ORACLE_ADDRESS");
        
        uint32 sonicEid = 30332;
        uint32 arbitrumEid = 30110;
        
        OmniDragonOracle oracle = OmniDragonOracle(payable(oracleAddress));
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Configure peer connections (bidirectional)
        bytes32 arbitrumPeer = bytes32(uint256(uint160(oracleAddress)));
        bytes32 sonicPeer = bytes32(uint256(uint160(oracleAddress)));
        
        // Set Arbitrum peer from Sonic
        oracle.setPeer(arbitrumEid, arbitrumPeer);
        console.log("Set Arbitrum peer:", arbitrumEid);
        
        // Set Sonic peer from Arbitrum  
        oracle.setPeer(sonicEid, sonicPeer);
        console.log("Set Sonic peer:", sonicEid);
        
        vm.stopBroadcast();
        
        console.log("=== LAYERZERO PEER CONFIGURATION COMPLETE ===");
    }
}
```

## LayerZero Configuration Files

### OApp Configuration

**File**: `layerzero-oracle.config.ts`

```typescript
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { TwoWayConfig, generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const primary: OmniPointHardhat = {
  eid: EndpointId.SONIC_V2_MAINNET,
  contractName: 'OmniDragonOracle',
  address: '0x69B96004C850722B98bF307a1e8dd259713A5777',
}

const secondaryArb: OmniPointHardhat = {
  eid: EndpointId.ARBITRUM_V2_MAINNET,
  contractName: 'OmniDragonOracle',
  address: '0x69B96004C850722B98bF307a1e8dd259713A5777',
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = []

export default async function () {
  return {
    contracts: [
      {
        contract: primary,
        config: {
          readChannelConfigs: [
            {
              channelId: 4294967295,
              active: true,
              readLibrary: '0x860E8D714944E7accE4F9e6247923ec5d30c0471',
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
          ],
        },
      },
      {
        contract: secondaryArb,
        config: {
          readChannelConfigs: [
            {
              channelId: 4294967295,
              active: true,
              readLibrary: '0xbcd4CADCac3F767C57c4F402932C4705DF62BEFf',
              ulnConfig: {
                confirmations: 1,
                requiredDVNs: ['0x1308151a7ebac14f435d3ad5ff95c34160d539a5'],
                optionalDVNs: [],
                optionalDVNThreshold: 0,
              },
              executorConfig: {
                executor: '0x31CAe3B7fB82d847621859fb1585353c5720660D',
                maxMessageSize: 10000,
                gasLimit: 200000,
              },
            },
          ],
        },
      },
    ],
    connections: await generateConnectionsConfig([
      [
        primary,
        secondaryArb,
        [['LayerZero Labs'], []],
        [1, 1],
        [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
      ],
    ]),
  }
}
```

## Command Reference

### Deployment Commands

```bash
# Deploy to Sonic (PRIMARY)
forge script deploy/DeployOracleVanity.s.sol:DeployOracleVanity \
  --fork-url $RPC_URL_SONIC \
  --broadcast \
  --verify

# Deploy to Arbitrum (SECONDARY)  
forge script deploy/DeployOracleArbitrum.s.sol:DeployOracleArbitrum \
  --fork-url $RPC_URL_ARBITRUM \
  --broadcast \
  --verify
```

### Configuration Commands

```bash
# Configure Sonic PRIMARY Oracle
forge script deploy/SetOraclePrimary.s.sol:SetOraclePrimary \
  --fork-url $RPC_URL_SONIC \
  --broadcast

# Configure LayerZero Peers (run on both networks)
forge script deploy/SetOracleDelegate.s.sol:SetOracleDelegate \
  --fork-url $RPC_URL_SONIC \
  --broadcast

forge script deploy/SetOracleDelegate.s.sol:SetOracleDelegate \
  --fork-url $RPC_URL_ARBITRUM \
  --broadcast
```

### LayerZero Wiring

```bash
# Apply LayerZero configuration
npx hardhat lz:oapp-read:wire --oapp-config layerzero-oracle.config.ts
```

### Contract Interaction Commands

```bash
# Check Oracle price
cast call $ORACLE_ADDRESS "getLatestPrice()" --rpc-url $RPC_URL_SONIC

# Check Oracle mode (0=SECONDARY, 1=PRIMARY)
cast call $ORACLE_ADDRESS "mode()" --rpc-url $RPC_URL_SONIC

# Fund Oracle for cross-chain gas
cast send $ORACLE_ADDRESS --value 0.003ether --rpc-url $RPC_URL_ARBITRUM --private-key $PRIVATE_KEY

# Set enforced options for LayerZero
cast send $ORACLE_ADDRESS "setEnforcedOptions((uint32,uint16,bytes)[])" \
  "[(30332,1,0x00030100030100000000000000000000000000030d40)]" \
  --rpc-url $RPC_URL_ARBITRUM --private-key $PRIVATE_KEY

# Request cross-chain price
cast send $ORACLE_ADDRESS "requestPrice(uint32,bytes)" 30332 "0x" \
  --value 0.001ether --rpc-url $RPC_URL_ARBITRUM --private-key $PRIVATE_KEY
```

## Contract ABI Reference

### Core Functions ABI

```json
[
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
  },
  {
    "inputs": [{"type": "uint8", "name": "newMode"}],
    "name": "setMode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "uint32", "name": "_targetEid"},
      {"type": "bytes", "name": "_extraOptions"}
    ],
    "name": "requestPrice", 
    "outputs": [{"type": "tuple", "name": "receipt", "components": [
      {"type": "bytes32", "name": "guid"},
      {"type": "uint64", "name": "nonce"},
      {"type": "tuple", "name": "fee", "components": [
        {"type": "uint256", "name": "nativeFee"},
        {"type": "uint256", "name": "lzTokenFee"}
      ]}
    ]}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "uint32", "name": "_eid"},
      {"type": "bytes32", "name": "_peer"}
    ],
    "name": "setPeer",
    "outputs": [],
    "stateMutability": "nonpayable", 
    "type": "function"
  }
]
```

## Error Reference

### Common Contract Errors

```solidity
// Oracle Errors
error OnlyPrimary();           // Function only available on PRIMARY mode
error NotConfigured();         // Oracle source not configured
error Inactive();              // Oracle source or peer inactive
error CalculationFailed();     // Price calculation failed
error InvalidOracle();         // Invalid oracle address
error EmergencyActive();       // Emergency mode enabled

// LayerZero Errors  
error LZ_ULN_InvalidWorkerOptions(uint256);  // Invalid executor options
error Executor_UnsupportedOptionType(uint256); // Unsupported option type
error LZ_ULN_InvalidWorkerId(uint256);       // Invalid worker ID
```

### Error Solutions

| Error | Solution |
|-------|----------|
| `OnlyPrimary()` | Call function on PRIMARY Oracle, or use `requestPrice()` on SECONDARY |
| `NotConfigured()` | Set up oracle sources with `setPullOracle()` or `setPushOracle()` |
| `Inactive()` | Activate peer with `setPeer(eid, address, true)` |
| `LZ_ULN_InvalidWorkerOptions` | Set enforced options with correct format |
| `Executor_UnsupportedOptionType` | Use type 3 executor options |

## Performance Metrics

### Expected Response Times
- **Local Price Query**: <100ms
- **Cross-Chain Request**: 10-30 seconds (LayerZero confirmation)
- **Oracle Update**: 5-15 seconds (depending on gas)

### Gas Usage Estimates
- **Price Query**: ~50,000 gas
- **Oracle Update**: ~200,000-400,000 gas  
- **Cross-Chain Request**: ~150,000 gas + LayerZero fees
- **Configuration Changes**: ~30,000-80,000 gas

### Reliability Targets
- **Uptime**: 99.9%
- **Price Freshness**: <5 minutes
- **Cross-Chain Success**: >95%
- **Source Availability**: >99% (multi-source redundancy)

## Security Checklist

### Pre-Deployment
- [ ] Contract size within EIP-170 limit (24,576 bytes)
- [ ] All oracle sources configured with proper weights
- [ ] LayerZero endpoints verified for target networks
- [ ] Vanity address generation salt secured
- [ ] Test deployments on testnets completed

### Post-Deployment
- [ ] Contract verification on block explorers
- [ ] Oracle mode set correctly (PRIMARY/SECONDARY)
- [ ] LayerZero peer connections established
- [ ] Price feeds returning valid data
- [ ] Cross-chain communication tested
- [ ] Emergency controls functional
- [ ] Access control permissions verified

### Operational Security
- [ ] Private keys secured in hardware wallets
- [ ] Multi-signature controls for critical functions
- [ ] Price deviation monitoring enabled
- [ ] Gas balance monitoring for contracts
- [ ] LayerZero message delivery monitoring
- [ ] Backup oracle sources identified

This technical reference provides all the specific configuration details, commands, and troubleshooting information needed to deploy, configure, and maintain the OmniDragon Oracle system.
