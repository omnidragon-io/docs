---
title: OmniDragon VRF — Configuration
sidebar_position: 20
---

# VRF Configuration Guide

## Deployment Configuration

### Contract Addresses

#### Sonic Network (VRF Integrator)
```bash
# ChainlinkVRFIntegratorV2_5 on Sonic
VRF_INTEGRATOR_SONIC=0x694f00e7CAB26F9D05261c3d62F52a81DE18A777
SONIC_CHAIN_ID=146
SONIC_LAYERZERO_EID=30332
SONIC_RPC=https://rpc.soniclabs.com/
SONIC_EXPLORER=https://sonicscan.org
```

#### Arbitrum Network (VRF Consumer Hub)
```bash
# OmniDragonVRFConsumerV2_5 on Arbitrum
VRF_CONSUMER_ARBITRUM=0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5
VRF_INTEGRATOR_ARBITRUM=0x694f00e7CAB26F9D05261c3d62F52a81DE18A777
ARBITRUM_CHAIN_ID=42161
ARBITRUM_LAYERZERO_EID=30110
ARBITRUM_RPC=https://arbitrum-one.publicnode.com
ARBITRUM_EXPLORER=https://arbiscan.io
```

#### Registry and Supporting Contracts
```bash
# OmniDragonRegistry
REGISTRY_ARBITRUM=0x6949936442425f4137807Ac5d269e6Ef66d50777
REGISTRY_SONIC=0x6949936442425f4137807Ac5d269e6Ef66d50777

# Deployment details
DEPLOYER_ADDRESS=0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F
CREATE2_DEPLOYMENT=true
VANITY_PATTERN="0x69...0777"
```

## Chainlink VRF v2.5 Configuration

### Coordinator Settings
```typescript
const CHAINLINK_VRF_CONFIG = {
  coordinator: "0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e",
  subscriptionId: "49130512167777098004519592693541429977179420141459329604059253338290818062746",
  keyHash: "0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409",
  gasLane: "30 gwei",
  network: "arbitrum",
  funded: true,
  requestConfirmations: 3,
  callbackGasLimit: 2500000,
  numWords: 1,
  nativePayment: false
};
```

### Subscription Management
```bash
# Chainlink VRF Subscription Details
SUBSCRIPTION_ID=49130512167777098004519592693541429977179420141459329604059253338290818062746
SUBSCRIPTION_OWNER=0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F
AUTHORIZED_CONSUMERS=0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5

# Funding status
SUBSCRIPTION_FUNDED=true
ESTIMATED_COST_PER_REQUEST=0.001 # LINK tokens
MINIMUM_BALANCE_THRESHOLD=1.0 # LINK tokens
```

## LayerZero V2 Configuration

### Network Endpoints
```typescript
const LAYERZERO_ENDPOINTS = {
  sonic: {
    endpoint: "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B",
    eid: 30332,
    confirmations: 1
  },
  arbitrum: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
    eid: 30110,
    confirmations: 1
  },
  ethereum: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
    eid: 30101,
    confirmations: 1
  },
  base: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
    eid: 30184,
    confirmations: 1
  }
};
```

### Cross-Chain Pathways
```typescript
const CROSS_CHAIN_PATHWAYS = {
  sonic_to_arbitrum: {
    sourceEid: 30332,
    destinationEid: 30110,
    configured: true,
    enforced_options: {
      executor_gas: 200000,
      executor_value: 0
    }
  },
  arbitrum_to_sonic: {
    sourceEid: 30110,
    destinationEid: 30332,
    configured: true,
    enforced_options: {
      executor_gas: 200000,
      executor_value: 0
    }
  }
};
```

### Peer Configuration
```solidity
// Set LayerZero peers for cross-chain communication
// On Sonic VRFIntegrator
vrfIntegrator.setPeer(30110, bytes32(uint256(uint160(arbitrumConsumerAddress))));

// On Arbitrum VRFConsumer  
vrfConsumer.setPeer(30332, bytes32(uint256(uint160(sonicIntegratorAddress))));
```

## Gas Configuration

### Gas Limits per Chain
```typescript
const GAS_LIMITS = {
  sonic: {
    standard_request: 500000,
    callback_processing: 200000,
    layerzero_receive: 200000,
    default_limit: 2500000
  },
  arbitrum: {
    vrf_request: 300000,
    local_request: 200000,
    cross_chain_response: 250000,
    callback_gas: 2500000
  },
  ethereum: {
    cross_chain_limit: 2500000,
    response_gas: 300000
  },
  base: {
    cross_chain_limit: 2500000,
    response_gas: 250000
  }
};
```

### Fee Structure
```typescript
const FEE_STRUCTURE = {
  layerzero_fees: {
    standard_quote: "~0.195 ETH",
    custom_gas_200k: "~0.151 ETH",
    safety_margin: "10%",
    note: "Varies with gas prices and network congestion"
  },
  chainlink_vrf: {
    base_fee: "0.25 LINK",
    gas_price_adjustment: "variable",
    subscription_model: true
  },
  contract_operations: {
    quote_fee: "~15000 gas",
    request_submission: "~100000 gas",
    response_processing: "~80000 gas"
  }
};
```

## Environment Setup

### Production Environment
```bash
# Network Configuration
export SONIC_RPC_URL="https://rpc.soniclabs.com/"
export ARBITRUM_RPC_URL="https://arbitrum-one.publicnode.com"
export ETHEREUM_RPC_URL="https://ethereum.publicnode.com"
export BASE_RPC_URL="https://base.publicnode.com"

# Contract Addresses
export VRF_INTEGRATOR_SONIC="0x694f00e7CAB26F9D05261c3d62F52a81DE18A777"
export VRF_CONSUMER_ARBITRUM="0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5"
export REGISTRY_ADDRESS="0x6949936442425f4137807Ac5d269e6Ef66d50777"

# Chainlink VRF Configuration
export VRF_COORDINATOR="0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e"
export VRF_SUBSCRIPTION_ID="49130512167777098004519592693541429977179420141459329604059253338290818062746"
export VRF_KEY_HASH="0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409"

# Security
export OWNER_PRIVATE_KEY="your_private_key_here"
export DEPLOYER_ADDRESS="0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F"

# Monitoring
export MIN_ETH_BALANCE="0.1" # Minimum ETH for LayerZero fees
export MIN_LINK_BALANCE="1.0" # Minimum LINK for VRF requests
export REQUEST_TIMEOUT="3600" # 1 hour timeout
```

### Development Environment
```bash
# Development Configuration
export DEV_SONIC_RPC="https://rpc.testnet.soniclabs.com/"
export DEV_ARBITRUM_RPC="https://arbitrum-goerli.publicnode.com"

# Test addresses (deployed to same addresses on testnets)
export DEV_VRF_INTEGRATOR="0x694f00e7CAB26F9D05261c3d62F52a81DE18A777"
export DEV_VRF_CONSUMER="0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5"

# Test VRF configuration
export DEV_VRF_COORDINATOR="0x5CE8D5A2BC84beb22a398CCA51996F7930313D61" # Goerli coordinator
export DEV_SUBSCRIPTION_ID="your_test_subscription_id"
export DEV_KEY_HASH="0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c" # Goerli 30 gwei

# Test funding
export TEST_ETH_AMOUNT="0.5"
export TEST_LINK_AMOUNT="10"
```

## Deployment Scripts

### Complete VRF System Deployment
```bash
#!/bin/bash
# deploy-vrf-system.sh

echo "Deploying OmniDragon VRF System..."

# Set deployment parameters
REGISTRY_SALT="0x6949936442425f4137807ac5d269e6ef66d50777"
VRF_SALT="0x2bd68f5e956ca9789a7ab7674670499e65140bd5"

# Deploy VRF Integrator on Sonic
echo "Deploying VRF Integrator on Sonic..."
forge create \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY \
  --create2 \
  --salt $VRF_SALT \
  contracts/vrf/ChainlinkVRFIntegratorV2_5.sol:ChainlinkVRFIntegratorV2_5 \
  --constructor-args $REGISTRY_ADDRESS

# Deploy VRF Consumer on Arbitrum
echo "Deploying VRF Consumer on Arbitrum..."
forge create \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY \
  --create2 \
  --salt $VRF_SALT \
  contracts/vrf/OmniDragonVRFConsumerV2_5.sol:OmniDragonVRFConsumerV2_5 \
  --constructor-args $REGISTRY_ADDRESS

# Verify contracts
echo "Verifying contracts..."
forge verify-contract \
  --chain arbitrum \
  --etherscan-api-key $ARBISCAN_API_KEY \
  $VRF_CONSUMER_ARBITRUM \
  contracts/vrf/OmniDragonVRFConsumerV2_5.sol:OmniDragonVRFConsumerV2_5

echo "VRF System deployment complete!"
```

### Post-Deployment Configuration
```bash
#!/bin/bash
# configure-vrf-system.sh

echo "Configuring VRF System..."

# Configure VRF Consumer on Arbitrum
cast send $VRF_CONSUMER_ARBITRUM \
  "setVRFConfig(address,uint256,bytes32)" \
  $VRF_COORDINATOR \
  $VRF_SUBSCRIPTION_ID \
  $VRF_KEY_HASH \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

# Set LayerZero peers
cast send $VRF_INTEGRATOR_SONIC \
  "setPeer(uint32,bytes32)" \
  30110 \
  0x000000000000000000000000697a9d438a5b61ea75aa823f98a85efb70fd23d5 \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

cast send $VRF_CONSUMER_ARBITRUM \
  "setPeer(uint32,bytes32)" \
  30332 \
  0x0000000000000000000000002BD68f5E956ca9789A7Ab7674670499e65140Bd5 \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

# Fund contracts with ETH for LayerZero fees
cast send $VRF_INTEGRATOR_SONIC \
  --value 0.5ether \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

cast send $VRF_CONSUMER_ARBITRUM \
  "fundContract()" \
  --value 1.0ether \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

echo "VRF System configuration complete!"
```

## Network-Specific Configuration

### Sonic Network Setup
```typescript
const SONIC_CONFIG = {
  chainId: 146,
  layerZeroEid: 30332,
  rpcUrl: "https://rpc.soniclabs.com/",
  blockExplorer: "https://sonicscan.org",
  contracts: {
    vrfIntegrator: "0x694f00e7CAB26F9D05261c3d62F52a81DE18A777",
    registry: "0x6949936442425f4137807Ac5d269e6Ef66d50777"
  },
  layerzero: {
    endpoint: "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B",
    enforced_options: "0x000301001101000000000000000000000000000A88F4" // 690420 gas
  },
  feeM: {
    enabled: true,
    registrationId: 143,
    contractAddress: "0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830"
  }
};
```

### Arbitrum Network Setup
```typescript
const ARBITRUM_CONFIG = {
  chainId: 42161,
  layerZeroEid: 30110,
  rpcUrl: "https://arbitrum-one.publicnode.com",
  blockExplorer: "https://arbiscan.io",
  contracts: {
    vrfConsumer: "0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5",
    vrfIntegrator: "0x694f00e7CAB26F9D05261c3d62F52a81DE18A777",
    registry: "0x6949936442425f4137807Ac5d269e6Ef66d50777"
  },
  chainlink: {
    coordinator: "0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e",
    subscriptionId: "49130512167777098004519592693541429977179420141459329604059253338290818062746",
    keyHash: "0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409",
    gasLane: "30 gwei"
  },
  layerzero: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
    supportedChains: [30332, 30101, 30184, 30106] // Sonic, Ethereum, Base, Avalanche
  }
};
```

## Authorization Configuration

### Local VRF Access Control
```solidity
// Authorize addresses for local VRF requests on Arbitrum
address[] memory authorizedCallers = [
    0x1234567890123456789012345678901234567890, // Game contract
    0x0987654321098765432109876543210987654321, // Lottery contract
    0xABCDEF1234567890ABCDEF1234567890ABCDEF12  // NFT minting contract
];

for (uint i = 0; i < authorizedCallers.length; i++) {
    vrfConsumer.setLocalCallerAuthorization(authorizedCallers[i], true);
}
```

### Admin Role Configuration
```bash
# Set up admin roles and permissions
cast send $VRF_CONSUMER_ARBITRUM \
  "transferOwnership(address)" \
  $MULTISIG_WALLET_ADDRESS \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

cast send $VRF_INTEGRATOR_SONIC \
  "transferOwnership(address)" \
  $MULTISIG_WALLET_ADDRESS \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY
```

## Monitoring Configuration

### Health Check Setup
```typescript
const HEALTH_CHECK_CONFIG = {
  intervals: {
    contractBalance: 300000,    // 5 minutes
    vrfSubscription: 900000,    // 15 minutes
    layerzeroFees: 600000,      // 10 minutes
    requestFulfillment: 120000  // 2 minutes
  },
  thresholds: {
    minEthBalance: "0.1",       // ETH
    minLinkBalance: "1.0",      // LINK
    maxRequestAge: 3600,        // 1 hour
    maxResponseTime: 300        // 5 minutes
  },
  alerts: {
    email: "admin@omnidragon.io",
    webhook: "https://hooks.slack.com/...",
    telegram: "@omnidragon_alerts"
  }
};
```

### Automated Monitoring Script
```javascript
class VRFSystemMonitor {
  constructor(config) {
    this.config = config;
    this.providers = this.initializeProviders();
    this.contracts = this.initializeContracts();
  }
  
  async startMonitoring() {
    setInterval(() => this.checkContractBalances(), this.config.intervals.contractBalance);
    setInterval(() => this.checkVRFSubscription(), this.config.intervals.vrfSubscription);
    setInterval(() => this.checkLayerZeroFees(), this.config.intervals.layerzeroFees);
    setInterval(() => this.checkPendingRequests(), this.config.intervals.requestFulfillment);
  }
  
  async checkContractBalances() {
    const sonicBalance = await this.providers.sonic.getBalance(VRF_INTEGRATOR_SONIC);
    const arbitrumBalance = await this.providers.arbitrum.getBalance(VRF_CONSUMER_ARBITRUM);
    
    if (ethers.utils.formatEther(sonicBalance) < this.config.thresholds.minEthBalance) {
      await this.sendAlert(`Low ETH balance on Sonic VRF Integrator: ${ethers.utils.formatEther(sonicBalance)} ETH`);
    }
    
    if (ethers.utils.formatEther(arbitrumBalance) < this.config.thresholds.minEthBalance) {
      await this.sendAlert(`Low ETH balance on Arbitrum VRF Consumer: ${ethers.utils.formatEther(arbitrumBalance)} ETH`);
    }
  }
  
  async sendAlert(message) {
    console.log(`ALERT: ${message}`);
    // Implement webhook/email/Telegram notifications
  }
}
```

## Testing Configuration

### Test Suite Setup
```bash
# VRF System Test Configuration
export TEST_NETWORKS="sonic,arbitrum"
export TEST_SCENARIOS="cross_chain,local,callbacks,gas_estimation"
export TEST_ITERATIONS=10
export TEST_TIMEOUT=600 # 10 minutes

# Test funding
export TEST_ETH_SONIC="1.0"
export TEST_ETH_ARBITRUM="2.0"
export TEST_LINK_AMOUNT="50.0"

# Test request parameters
export TEST_NUM_REQUESTS=5
export TEST_CONCURRENT_REQUESTS=3
export TEST_CALLBACK_GAS=2500000
```

### Automated Test Suite
```javascript
describe("VRF System Integration Tests", function() {
  const TEST_CONFIG = {
    sonic: {
      rpc: process.env.SONIC_RPC_URL,
      vrfIntegrator: process.env.VRF_INTEGRATOR_SONIC
    },
    arbitrum: {
      rpc: process.env.ARBITRUM_RPC_URL,
      vrfConsumer: process.env.VRF_CONSUMER_ARBITRUM
    }
  };
  
  it("should complete cross-chain VRF request", async function() {
    // Test cross-chain VRF flow
    const fee = await sonicVRF.quoteFee();
    const tx = await sonicVRF.requestRandomWordsPayable(30110, {value: fee.nativeFee});
    const receipt = await tx.wait();
    
    const requestId = receipt.events.find(e => e.event === 'RandomWordsRequested').args.requestId;
    
    // Wait for fulfillment (up to 10 minutes)
    await waitForFulfillment(requestId, 600000);
    
    const [randomWord, fulfilled] = await sonicVRF.getRandomWord(requestId);
    expect(fulfilled).to.be.true;
    expect(randomWord).to.be.gt(0);
  });
  
  it("should handle local VRF requests", async function() {
    // Test local VRF on Arbitrum
    const requestId = await arbitrumVRF.requestRandomWordsLocal();
    
    await waitForLocalFulfillment(requestId, 120000); // 2 minutes
    
    const request = await arbitrumVRF.getLocalRequest(requestId);
    expect(request.fulfilled).to.be.true;
    expect(request.randomWord).to.be.gt(0);
  });
});
```

---

**Complete configuration guide for deploying and maintaining the OmniDragon VRF System**
