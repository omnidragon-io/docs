---
title: omniDRAGON Token — Configuration
sidebar_position: 20
---

# Token Configuration Guide

## Deployment Configuration

### Contract Addresses

#### Primary Deployment (Sonic)
```bash
# omniDRAGON Token on Sonic (Primary Chain)
OMNIDRAGON_TOKEN=0x69dc1c36f8b26db3471acf0a6469d815e9a27777
SONIC_CHAIN_ID=146
SONIC_LAYERZERO_EID=30332
SONIC_RPC=https://rpc.soniclabs.com/
SONIC_EXPLORER=https://sonicscan.org
INITIAL_SUPPLY=69420000000000000000000000 # 69,420,000 DRAGON
```

#### Secondary Deployments
```bash
# Arbitrum Deployment
OMNIDRAGON_ARBITRUM=0x69dc1c36f8b26db3471acf0a6469d815e9a27777
ARBITRUM_CHAIN_ID=42161
ARBITRUM_LAYERZERO_EID=30110

# Ethereum Deployment (Planned)
OMNIDRAGON_ETHEREUM=0x69dc1c36f8b26db3471acf0a6469d815e9a27777
ETHEREUM_CHAIN_ID=1
ETHEREUM_LAYERZERO_EID=30101

# Base Deployment (Planned)
OMNIDRAGON_BASE=0x69dc1c36f8b26db3471acf0a6469d815e9a27777
BASE_CHAIN_ID=8453
BASE_LAYERZERO_EID=30184
```

#### Supporting Infrastructure
```bash
# Registry and ecosystem contracts
OMNIDRAGON_REGISTRY=0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777
LOTTERY_MANAGER=0x...  # To be set after deployment
JACKPOT_VAULT=0x...    # To be set after deployment  
REVENUE_DISTRIBUTOR=0x...  # To be set after deployment
FUSION_INTEGRATOR=0x...    # To be set after deployment

# Deployment details
DEPLOYER_ADDRESS=0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F
VANITY_PATTERN="0x69dc1c36...27777"
CREATE2_SALT=0x69dc1c36f8b26db3471acf0a6469d815e9a27777
```

## LayerZero V2 OFT Configuration

### Network Endpoints
```typescript
const LAYERZERO_ENDPOINTS = {
  sonic: {
    endpoint: "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B",
    eid: 30332,
    chainId: 146
  },
  arbitrum: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c", 
    eid: 30110,
    chainId: 42161
  },
  ethereum: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
    eid: 30101,
    chainId: 1
  },
  base: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c",
    eid: 30184,
    chainId: 8453
  }
};
```

### OFT Deployment Parameters
```typescript
const OFT_DEPLOYMENT_CONFIG = {
  name: "omniDRAGON",
  symbol: "DRAGON",
  delegate: process.env.DELEGATE_ADDRESS, // LayerZero delegate
  registry: process.env.OMNIDRAGON_REGISTRY,
  owner: process.env.DEPLOYER_ADDRESS,
  
  // Sonic-specific (initial mint)
  initialMintChain: 146,
  initialSupply: "69420000000000000000000000", // 69.42M tokens
  
  // Cross-chain configuration
  peers: {
    30110: "0x69dc1c36f8b26db3471acf0a6469d815e9a27777", // Arbitrum
    30101: "0x69dc1c36f8b26db3471acf0a6469d815e9a27777", // Ethereum  
    30184: "0x69dc1c36f8b26db3471acf0a6469d815e9a27777"  // Base
  }
};
```

## Smart Fee Detection Configuration

### Operation Type Classifications
```solidity
enum OperationType {
    Unknown,        // Apply fees (default for safety)
    SwapOnly,       // Apply fees for swaps only  
    NoFees,         // Never apply fees (exempt addresses)
    LiquidityOnly   // Only liquidity operations (no fees)
}
```

### DEX Protocol Configuration
```typescript
const DEX_CONFIGURATIONS = {
  // Uniswap V2
  uniswapV2Router: {
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    operationType: "SwapOnly",
    classification: "swapRouter"
  },
  
  // Uniswap V3
  uniswapV3Router: {
    address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    operationType: "SwapOnly", 
    classification: "swapRouter"
  },
  uniswapV3PositionManager: {
    address: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    operationType: "LiquidityOnly",
    classification: "positionManager"
  },
  
  // Balancer
  balancerVault: {
    address: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    operationType: "SwapOnly",
    classification: "balancerVault"
  },
  
  // 1inch
  oneInchRouter: {
    address: "0x111111125421cA6dc452d289314280a0f8842A65",
    operationType: "SwapOnly",
    classification: "swapRouter"
  }
};
```

## Fee Structure Configuration

### Current Fee Settings
```typescript
const FEE_CONFIGURATION = {
  buyFees: {
    jackpot: 690,    // 6.90% in basis points
    veDRAGON: 241,   // 2.41% in basis points
    burn: 69,        // 0.69% in basis points
    total: 1000      // 10.00% in basis points
  },
  sellFees: {
    jackpot: 690,    // 6.90% in basis points
    veDRAGON: 241,   // 2.41% in basis points  
    burn: 69,        // 0.69% in basis points
    total: 1000      // 10.00% in basis points
  },
  
  // Constants
  BASIS_POINTS: 10000,
  MAX_FEE_BPS: 2500,  // Maximum 25% fee cap
  
  // Distribution addresses
  jackpotVault: process.env.JACKPOT_VAULT,
  revenueDistributor: process.env.REVENUE_DISTRIBUTOR,
  burnAddress: "0x000000000000000000000000000000000000dEaD"
};
```

### Fee Exemption Configuration
```solidity
// No hardcoded exemption lists to avoid scanner flags
// Fee exemptions handled through operation type classification

// Example exempt addresses (configured via setAddressOperationType)
mapping(address => OperationType) exemptOperations = {
    bridge_contract: OperationType.NoFees,
    liquidity_vault: OperationType.LiquidityOnly,
    rewards_distributor: OperationType.NoFees,
    cross_chain_messenger: OperationType.NoFees
}
```

## Environment Setup

### Production Environment
```bash
# Network Configuration
export SONIC_RPC_URL="https://rpc.soniclabs.com/"
export ARBITRUM_RPC_URL="https://arbitrum-one.publicnode.com"
export ETHEREUM_RPC_URL="https://ethereum.publicnode.com"
export BASE_RPC_URL="https://base.publicnode.com"

# Token Configuration
export DRAGON_NAME="omniDRAGON"
export DRAGON_SYMBOL="DRAGON" 
export DRAGON_DECIMALS=18
export DRAGON_SUPPLY=69420000
export DRAGON_INITIAL_MINT_CHAIN=146

# LayerZero Configuration
export LZ_DELEGATE="0xYourDelegateAddress"
export LZ_ENDPOINT_SONIC="0x6F475642a6e85809B1c36Fa62763669b1b48DD5B"
export LZ_ENDPOINT_ARBITRUM="0x1a44076050125825900e736c501f859c50fE728c"

# Ecosystem Contracts
export OMNIDRAGON_REGISTRY="0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777"
export LOTTERY_MANAGER="0x..." 
export JACKPOT_VAULT="0x..."
export REVENUE_DISTRIBUTOR="0x..."
export FUSION_INTEGRATOR="0x..."

# Security
export OWNER_PRIVATE_KEY="your_private_key_here"
export DEPLOYER_ADDRESS="0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F"

# Fee Configuration
export FEE_ENABLED=true
export BUY_FEE_JACKPOT=690   # 6.90%
export BUY_FEE_REVENUE=241   # 2.41%
export BUY_FEE_BURN=69       # 0.69%
export SELL_FEE_JACKPOT=690  # 6.90%
export SELL_FEE_REVENUE=241  # 2.41%
export SELL_FEE_BURN=69      # 0.69%
```

### Development Environment  
```bash
# Development Configuration
export DEV_SONIC_RPC="https://rpc.testnet.soniclabs.com/"
export DEV_ARBITRUM_RPC="https://arbitrum-goerli.publicnode.com"

# Test token addresses (same vanity pattern on testnets)
export DEV_DRAGON_ADDRESS="0x69dc1c36f8b26db3471acf0a6469d815e9a27777"

# Reduced supply for testing
export DEV_DRAGON_SUPPLY=1000000  # 1M tokens for testing

# Test fee configuration
export DEV_FEE_ENABLED=true
export DEV_REDUCED_FEES=true  # Lower fees for testing

# Test infrastructure addresses  
export DEV_JACKPOT_VAULT="0x..."
export DEV_REVENUE_DISTRIBUTOR="0x..."
export DEV_LOTTERY_MANAGER="0x..."

# Mock DEX addresses for testing
export DEV_UNISWAP_V2_ROUTER="0x..."
export DEV_UNISWAP_V3_ROUTER="0x..."
export DEV_BALANCER_VAULT="0x..."
```

## Deployment Scripts

### Complete Token Deployment
```bash
#!/bin/bash
# deploy-omnidragon-token.sh

echo "Deploying omniDRAGON Token System..."

# Set deployment parameters
TOKEN_SALT="0x69dc1c36f8b26db3471acf0a6469d815e9a27777"
DELEGATE_ADDRESS="0xYourDelegateAddress"
REGISTRY_ADDRESS="0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777"

# Deploy on Sonic (Primary Chain)
echo "Deploying omniDRAGON on Sonic..."
forge create \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY \
  --create2 \
  --salt $TOKEN_SALT \
  contracts/tokens/omniDRAGON.sol:omniDRAGON \
  --constructor-args \
    "omniDRAGON" \
    "DRAGON" \
    $DELEGATE_ADDRESS \
    $REGISTRY_ADDRESS \
    $DEPLOYER_ADDRESS

# Deploy on Arbitrum (Secondary Chain)  
echo "Deploying omniDRAGON on Arbitrum..."
forge create \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY \
  --create2 \
  --salt $TOKEN_SALT \
  contracts/tokens/omniDRAGON.sol:omniDRAGON \
  --constructor-args \
    "omniDRAGON" \
    "DRAGON" \
    $DELEGATE_ADDRESS \
    $REGISTRY_ADDRESS \
    $DEPLOYER_ADDRESS

# Verify contracts
echo "Verifying contracts..."
forge verify-contract \
  --chain arbitrum \
  --etherscan-api-key $ARBISCAN_API_KEY \
  $DRAGON_ADDRESS \
  contracts/tokens/omniDRAGON.sol:omniDRAGON

echo "Token deployment complete!"
```

### Post-Deployment Configuration
```bash
#!/bin/bash
# configure-omnidragon-token.sh

echo "Configuring omniDRAGON Token..."

DRAGON_ADDRESS="0x69dc1c36f8b26db3471acf0a6469d815e9a27777"

# Configure ecosystem contracts
cast send $DRAGON_ADDRESS \
  "setLotteryManager(address)" \
  $LOTTERY_MANAGER \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

cast send $DRAGON_ADDRESS \
  "setJackpotVault(address)" \
  $JACKPOT_VAULT \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

cast send $DRAGON_ADDRESS \
  "setRevenueDistributor(address)" \
  $REVENUE_DISTRIBUTOR \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

# Configure DEX addresses
cast send $DRAGON_ADDRESS \
  "configureDEXAddresses()" \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

# Set LayerZero peers
cast send $DRAGON_ADDRESS \
  "setPeer(uint32,bytes32)" \
  30110 \
  0x00000000000000000000000069dc1c36f8b26db3471acf0a6469d815e9a27777 \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

# Register with Sonic FeeM
cast send $DRAGON_ADDRESS \
  "registerMe()" \
  --rpc-url $SONIC_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY

echo "Token configuration complete!"
```

## DEX Integration Configuration

### Uniswap V2 Integration
```typescript
const UNISWAP_V2_CONFIG = {
  router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  operationType: "SwapOnly",
  
  // Configure pairs
  pairs: {
    "DRAGON/WETH": "0x...", // Will be set after pair creation
    "DRAGON/USDC": "0x...", // Will be set after pair creation
  },
  
  setup: async function(dragonContract) {
    // Set router as swap-only
    await dragonContract.setAddressOperationType(this.router, 1); // SwapOnly
    
    // Configure pairs when created
    for (const [pair, address] of Object.entries(this.pairs)) {
      if (address !== "0x...") {
        await dragonContract.setPair(address, true);
      }
    }
  }
};
```

### Uniswap V3 Integration
```typescript
const UNISWAP_V3_CONFIG = {
  router: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  
  pools: {
    "DRAGON/WETH/0.3%": "0x...",  // 0.3% fee tier
    "DRAGON/USDC/0.05%": "0x...", // 0.05% fee tier
  },
  
  setup: async function(dragonContract) {
    // Router = SwapOnly (fees apply)
    await dragonContract.setAddressOperationType(this.router, 1);
    
    // Position Manager = LiquidityOnly (no fees)
    await dragonContract.setAddressOperationType(this.positionManager, 3);
    
    // Configure pools
    for (const [pool, address] of Object.entries(this.pools)) {
      if (address !== "0x...") {
        await dragonContract.setUniswapV3Pool(address, true);
      }
    }
  }
};
```

### Balancer Integration
```typescript
const BALANCER_CONFIG = {
  vault: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
  
  pools: {
    "DRAGON/WETH/USDC": {
      poolId: "0x...",
      address: "0x..."
    }
  },
  
  setup: async function(dragonContract) {
    // Vault = SwapOnly for swaps
    await dragonContract.setAddressOperationType(this.vault, 1);
    
    // Configure pools as liquidity-only
    for (const [pool, config] of Object.entries(this.pools)) {
      if (config.address !== "0x...") {
        await dragonContract.setBalancerPool(config.address, true);
      }
    }
  }
};
```

## Smart Detection Rules Configuration

### Classification Rules
```typescript
const SMART_DETECTION_RULES = {
  // Automatic fee application rules
  applyFeesWhen: [
    "isPair[from] || isPair[to]",
    "isSwapRouter[from] || isSwapRouter[to]", 
    "isBalancerVault[from] && !isBalancerPool[to]",
    "isUniswapV3Pool[from] && !isPositionManager[to]"
  ],
  
  // Skip fees when
  skipFeesWhen: [
    "operationType[from] == NoFees || operationType[to] == NoFees",
    "operationType[from] == LiquidityOnly || operationType[to] == LiquidityOnly",
    "isPositionManager[from] || isPositionManager[to]",
    "isBalancerPool[from] && isBalancerVault[to]"
  ],
  
  // Default behavior
  defaultBehavior: "skipFees" // Conservative approach
};
```

### Address Classification Setup
```bash
# Configure known DEX contracts
configure_address() {
    local address=$1
    local operation_type=$2
    local description=$3
    
    echo "Configuring $description: $address as $operation_type"
    cast send $DRAGON_ADDRESS \
      "setAddressOperationType(address,uint8)" \
      $address \
      $operation_type \
      --rpc-url $RPC_URL \
      --private-key $OWNER_PRIVATE_KEY
}

# Swap routers (fees apply)
configure_address "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" 1 "Uniswap V2 Router"
configure_address "0xE592427A0AEce92De3Edee1F18E0157C05861564" 1 "Uniswap V3 Router"
configure_address "0x111111125421cA6dc452d289314280a0f8842A65" 1 "1inch Router"

# Liquidity managers (no fees)
configure_address "0xC36442b4a4522E871399CD717aBDD847Ab11FE88" 3 "Uniswap V3 Position Manager"

# Balancer (special handling)
configure_address "0xBA12222222228d8Ba445958a75a0704d566BF2C8" 1 "Balancer Vault"
```

## Testing Configuration

### Test Environment Setup
```bash
# Test Configuration
export TEST_NETWORKS="sonic,arbitrum"
export TEST_SCENARIOS="trading,liquidity,cross_chain,fee_detection"
export TEST_USERS=5
export TEST_DRAGON_AMOUNT="1000000000000000000000" # 1000 DRAGON

# Mock DEX setup
export TEST_UNISWAP_V2_ROUTER="0x..."
export TEST_UNISWAP_V3_ROUTER="0x..."
export TEST_BALANCER_VAULT="0x..."

# Test fee recipients
export TEST_JACKPOT_VAULT="0x..."
export TEST_REVENUE_DISTRIBUTOR="0x..." 
export TEST_BURN_ADDRESS="0x000000000000000000000000000000000000dEaD"
```

### Automated Test Suite Configuration
```javascript
const TEST_CONFIG = {
  networks: {
    sonic: {
      rpc: process.env.SONIC_RPC_URL,
      chainId: 146,
      dragonAddress: process.env.DRAGON_ADDRESS
    },
    arbitrum: {
      rpc: process.env.ARBITRUM_RPC_URL,
      chainId: 42161,
      dragonAddress: process.env.DRAGON_ADDRESS
    }
  },
  
  testScenarios: {
    feeDetection: {
      testAmount: ethers.parseEther('1000'),
      expectedFeeRate: 0.10, // 10%
      testAddresses: [
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
        "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap V3 Router
        "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"  // Position Manager (no fees)
      ]
    },
    
    crossChain: {
      sourceChain: 146,  // Sonic
      destChain: 42161,  // Arbitrum
      testAmount: ethers.parseEther('5000'),
      expectedFees: 0    // No fees on cross-chain
    },
    
    lottery: {
      minTriggerAmount: ethers.parseEther('100'),
      testBuyAmount: ethers.parseEther('500'),
      expectedLotteryEntry: true
    }
  }
};
```

## Monitoring Configuration

### Contract Health Monitoring
```typescript
const MONITORING_CONFIG = {
  intervals: {
    feeDistribution: 300000,    // 5 minutes
    crossChainSync: 900000,     // 15 minutes
    lotteryTriggers: 600000,    // 10 minutes
    supplyTracking: 1800000     // 30 minutes
  },
  
  thresholds: {
    maxPendingFees: ethers.parseEther('10000'),  // Alert if >10k fees pending
    minLotteryTriggers: 5,      // Alert if <5 lottery triggers/hour
    maxFeeRate: 0.25,           // Alert if fees >25%
    crossChainDelay: 600        // Alert if cross-chain >10 minutes
  },
  
  alerts: {
    email: "admin@omnidragon.io",
    webhook: "https://hooks.slack.com/...",
    telegram: "@omnidragon_alerts"
  }
};
```

### Performance Monitoring
```javascript
class DragonTokenMonitor {
  constructor(config) {
    this.config = config;
    this.providers = this.initializeProviders();
    this.contracts = this.initializeContracts();
  }
  
  async startMonitoring() {
    setInterval(() => this.checkFeeDistribution(), this.config.intervals.feeDistribution);
    setInterval(() => this.checkCrossChainSync(), this.config.intervals.crossChainSync);
    setInterval(() => this.monitorLotteryTriggers(), this.config.intervals.lotteryTriggers);
    setInterval(() => this.trackSupplyMetrics(), this.config.intervals.supplyTracking);
  }
  
  async checkFeeDistribution() {
    for (const [network, config] of Object.entries(this.config.networks)) {
      const dragon = this.contracts[network];
      const balance = await dragon.balanceOf(dragon.address);
      
      if (balance > this.config.thresholds.maxPendingFees) {
        await this.sendAlert(`High pending fees on ${network}: ${ethers.formatEther(balance)} DRAGON`);
      }
    }
  }
  
  async monitorLotteryTriggers() {
    // Monitor lottery trigger events
    const recentBlocks = 100;
    
    for (const [network, config] of Object.entries(this.config.networks)) {
      const dragon = this.contracts[network];
      const currentBlock = await this.providers[network].getBlockNumber();
      
      const events = await dragon.queryFilter(
        dragon.filters.LotteryTriggered(),
        currentBlock - recentBlocks,
        currentBlock
      );
      
      const hourlyTriggers = events.length * (3600 / (recentBlocks * 12)); // Estimate hourly rate
      
      if (hourlyTriggers < this.config.thresholds.minLotteryTriggers) {
        await this.sendAlert(`Low lottery activity on ${network}: ${hourlyTriggers} triggers/hour`);
      }
    }
  }
}
```

---

**Complete configuration guide for deploying and managing the omniDRAGON token ecosystem**
