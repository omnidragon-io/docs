---
title: omniDRAGON Token — Overview
sidebar_position: 10
---

# omniDRAGON Cross-Chain Token

> **Intelligent cross-chain token with LayerZero V2 OFT, smart fee detection, and lottery integration**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![LayerZero](https://img.shields.io/badge/LayerZero%20V2-OFT-6366f1?style=flat-square)](https://layerzero.network/)
[![Cross-Chain](https://img.shields.io/badge/Cross--Chain-Token-22c55e?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://opensource.org/licenses/MIT)

## Overview

omniDRAGON is a sophisticated cross-chain token built on LayerZero V2 OFT (Omni-Chain Fungible Token) standard with intelligent DEX operation detection, automated fee distribution, and lottery integration. The token features zero fees on bridging and liquidity operations while applying trading fees to DEX swaps.

### Key Features
- **LayerZero V2 OFT**: Seamless cross-chain transfers without wrapping
- **Smart Fee Detection**: Distinguishes trading vs liquidity operations
- **Multi-DEX Support**: Uniswap V2/V3, Balancer, 1inch, and custom integrations
- **Lottery Integration**: Automatic lottery entries on buy transactions
- **Revenue Distribution**: Automated fee distribution to multiple recipients
- **Burn Mechanism**: Deflationary tokenomics with automatic burning
- **Cross-Chain Native**: No bridges required for cross-chain transfers

**Token Address**: `0x69dc1c36f8b26db3471acf0a6469d815e9a27777` (Vanity pattern across all chains)

## Token Specifications

### Basic Information
- **Name**: omniDRAGON
- **Symbol**: DRAGON
- **Decimals**: 18
- **Total Supply**: 69,420,000 DRAGON
- **Initial Supply**: 69,420,000 DRAGON (minted on Sonic)
- **Contract Standard**: LayerZero V2 OFT + ERC-20

### Supply Distribution
```
Total Supply: 69,420,000 DRAGON
├── Initial Mint: 69,420,000 DRAGON (Sonic Chain)
├── Cross-Chain: Native bridging via LayerZero V2
├── Deflationary: Automatic burning on trades
└── Maximum Supply: Fixed at 69,420,000 DRAGON
```

## Smart Fee Detection System

### Operation Type Classifications
The token uses sophisticated logic to classify different types of operations:

```typescript
enum OperationType {
  Unknown,        // Apply fees (default for safety)
  SwapOnly,       // Apply fees for swaps only
  NoFees,         // Never apply fees (exempt addresses)
  LiquidityOnly   // Only liquidity operations (no fees)
}
```

### Fee Structure
**Buy Fees (10% total)**:
- 🎰 Jackpot: 6.90% → Lottery vault
- 💰 Revenue: 2.41% → veDRAGON holders
- 🔥 Burn: 0.69% → Dead address

**Sell Fees (10% total)**:
- 🎰 Jackpot: 6.90% → Lottery vault  
- 💰 Revenue: 2.41% → veDRAGON holders
- 🔥 Burn: 0.69% → Dead address

### Zero Fee Operations
- ✅ Cross-chain bridging (LayerZero OFT)
- ✅ Liquidity provision/removal
- ✅ Direct wallet transfers
- ✅ Contract interactions (non-trading)

## Multi-DEX Integration

### Supported DEX Protocols

| Protocol | Detection Method | Fee Application |
|----------|------------------|-----------------|
| **Uniswap V2** | Pair contracts | ✅ Trading fees |
| **Uniswap V3** | Pool + Router detection | ✅ Trading fees |
| **Balancer** | Vault + Pool classification | ✅ Trading fees |
| **1inch** | Aggregation router | ✅ Trading fees |
| **Custom DEXs** | Configurable classification | ✅ Trading fees |
| **Liquidity Operations** | Position managers | ❌ No fees |

### Smart Detection Logic
```
Trading Operation Detection:
1. Check operation type classification
2. Analyze contract interaction patterns
3. Distinguish swap vs liquidity operations
4. Apply fees only to confirmed trading
```

## Cross-Chain Architecture

```
┌─────────────────┐    LayerZero V2 OFT    ┌─────────────────┐
│     SONIC       │◄─────────────────────►│    ARBITRUM     │
│   (PRIMARY)     │                        │   (SECONDARY)   │
│                 │                        │                 │
│ 69,420,000      │  Native Bridging       │ Bridged Supply  │
│ DRAGON          │  (No Wrapping)         │ (Same Token)    │
│                 │                        │                 │
│ ┌─────────────┐ │                        │ ┌─────────────┐ │
│ │Smart Fees   │ │                        │ │Smart Fees   │ │
│ │Lottery      │ │                        │ │Lottery      │ │
│ │Revenue      │ │                        │ │Revenue      │ │
│ └─────────────┘ │                        │ └─────────────┘ │
└─────────────────┘                        └─────────────────┘

┌─────────────────┐    LayerZero V2 OFT    ┌─────────────────┐
│    ETHEREUM     │◄─────────────────────►│      BASE       │
│   (SECONDARY)   │                        │   (SECONDARY)   │
│                 │                        │                 │
│ Bridged Supply  │  Cross-Chain Sync      │ Bridged Supply  │
│ (Same Token)    │  (Instant & Native)    │ (Same Token)    │
└─────────────────┘                        └─────────────────┘
```

## Lottery Integration

### Automatic Lottery Entries
- **Trigger**: Buy transactions only (not sells)
- **Integration**: OmniDragonLotteryManager contract
- **Error Handling**: Safe execution (failures don't block transfers)
- **Cross-Chain**: Works on all supported chains

### Lottery Flow
```
Buy Transaction → Fee Calculation → Fee Distribution → Lottery Trigger
                                                           ↓
                                  Lottery Manager ← USD Value Estimation
                                           ↓
                                  Lottery Entry Created
```

## Revenue Distribution System

### Immediate Distribution
All fees are distributed immediately without accumulation:

```solidity
Fee Collection → Contract Balance → Immediate Distribution
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Jackpot Vault   Revenue      Dead Address
    (6.90%)       Distributor     (0.69%)
                   (2.41%)
```

### Distribution Targets
- **Jackpot Vault**: Funds cross-chain lottery system
- **Revenue Distributor**: Rewards for veDRAGON stakers
- **Burn Address**: Permanent token removal (deflationary)

## Supported Networks

### Primary Network
| Network | Chain ID | LayerZero EID | Token Address | Status |
|---------|----------|---------------|---------------|---------|
| **Sonic** | 146 | 30332 | `0x69dc1c36...27777` | 🟢 Primary |

### Secondary Networks  
| Network | Chain ID | LayerZero EID | Token Address | Status |
|---------|----------|---------------|---------------|---------|
| **Arbitrum** | 42161 | 30110 | `0x69dc1c36...27777` | 🟢 Active |
| **Ethereum** | 1 | 30101 | `0x69dc1c36...27777` | 🔄 Planned |
| **Base** | 8453 | 30184 | `0x69dc1c36...27777` | 🔄 Planned |
| **Avalanche** | 43114 | 30106 | `0x69dc1c36...27777` | 🔄 Planned |

## Core Functions

### Token Operations
```solidity
// Standard ERC-20 with smart fee detection
function transfer(address to, uint256 amount) external returns (bool)
function transferFrom(address from, address to, uint256 amount) external returns (bool)

// Preview fee calculation
function previewFeesForTransfer(address from, address to, uint256 amount) 
    external view returns (bool feesApply, uint256 feeAmount, uint256 transferAmount, string memory reason)
```

### LayerZero V2 OFT Functions
```solidity
// Cross-chain transfer with custom options
function send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)
    external payable returns (MessagingReceipt memory msgReceipt, OFTReceipt memory oftReceipt)

// Quote cross-chain transfer fee
function quoteSend(SendParam calldata _sendParam, bool _payInLzToken)
    external view returns (MessagingFee memory msgFee)
```

### Smart Detection Functions
```solidity
// Configure operation types for addresses
function setAddressOperationType(address addr, OperationType opType) external onlyOwner

// Configure DEX classifications
function setPair(address pair, bool _isPair) external onlyOwner
function setUniswapV3Pool(address pool, bool isPool) external onlyOwner
function setBalancerPool(address pool, bool isPool) external onlyOwner

// View functions
function getOperationType(address addr) external view returns (OperationType)
function isTradingVenue(address addr) external view returns (bool)
```

## Integration Examples

### Basic Token Operations
```javascript
const DRAGON_ADDRESS = '0x69dc1c36f8b26db3471acf0a6469d815e9a27777';
const DRAGON_ABI = [...]; // Standard ERC-20 ABI

const dragon = new ethers.Contract(DRAGON_ADDRESS, DRAGON_ABI, signer);

// Standard transfer (may have fees if trading)
await dragon.transfer(recipientAddress, ethers.parseEther('100'));

// Check if fees would apply
const [feesApply, feeAmount, transferAmount, reason] = await dragon.previewFeesForTransfer(
    signer.address,
    recipientAddress, 
    ethers.parseEther('100')
);

console.log(`Fees apply: ${feesApply}, Reason: ${reason}`);
if (feesApply) {
    console.log(`Fee: ${ethers.formatEther(feeAmount)} DRAGON`);
    console.log(`You receive: ${ethers.formatEther(transferAmount)} DRAGON`);
}
```

### Cross-Chain Transfer (LayerZero V2 OFT)
```javascript
const LayerZeroEndpointABI = [...];
const endpoint = new ethers.Contract(LAYERZERO_ENDPOINT, LayerZeroEndpointABI, provider);

// Destination chain details
const ARBITRUM_EID = 30110;
const recipientAddress = '0x...'; // Recipient on Arbitrum
const amountToSend = ethers.parseEther('1000');

// Prepare send parameters
const sendParam = {
    dstEid: ARBITRUM_EID,
    to: ethers.zeroPadValue(recipientAddress, 32),
    amountLD: amountToSend,
    minAmountLD: amountToSend,
    extraOptions: '0x',
    composeMsg: '0x',
    oftCmd: '0x'
};

// Quote the fee
const [nativeFee] = await dragon.quoteSend(sendParam, false);
console.log(`Cross-chain fee: ${ethers.formatEther(nativeFee)} ETH`);

// Send cross-chain (NO TRADING FEES - only LayerZero fees)
const tx = await dragon.send(
    sendParam,
    { nativeFee: nativeFee, lzTokenFee: 0 },
    signer.address,
    { value: nativeFee }
);

await tx.wait();
console.log('Cross-chain transfer initiated!');
```

### DEX Trading with Fee Preview
```javascript
class DragonTrading {
    constructor(provider, signer) {
        this.dragon = new ethers.Contract(DRAGON_ADDRESS, DRAGON_ABI, signer);
        this.signer = signer;
    }
    
    async previewTrade(dexAddress, amount) {
        // Preview fees for trading
        const [feesApply, feeAmount, transferAmount, reason] = await this.dragon.previewFeesForTransfer(
            this.signer.address,
            dexAddress,
            amount
        );
        
        return {
            feesApply,
            feeAmount: ethers.formatEther(feeAmount),
            transferAmount: ethers.formatEther(transferAmount),
            reason,
            effectiveFeeRate: feesApply ? (Number(feeAmount) / Number(amount)) * 100 : 0
        };
    }
    
    async executeTrade(dexContract, tradeFunction, amount) {
        // First preview the fees
        const preview = await this.previewTrade(dexContract.address, amount);
        console.log('Trade preview:', preview);
        
        // Approve DEX for the full amount
        await this.dragon.approve(dexContract.address, amount);
        
        // Execute trade (fees will be automatically applied)
        const tx = await tradeFunction();
        const receipt = await tx.wait();
        
        // Check for lottery trigger (on buys)
        const lotteryEvents = receipt.logs.filter(log => 
            log.topics[0] === ethers.keccak256(ethers.toUtf8Bytes('LotteryTriggered(address,uint256,uint256)'))
        );
        
        if (lotteryEvents.length > 0) {
            console.log('🎰 Lottery entry created!');
        }
        
        return receipt;
    }
}
```

### Liquidity Operations (Fee-Free)
```javascript
// Adding liquidity to Uniswap V3 - NO FEES
const positionManager = new ethers.Contract(UNISWAP_V3_POSITION_MANAGER, abi, signer);

// Approve position manager
await dragon.approve(UNISWAP_V3_POSITION_MANAGER, liquidityAmount);

// Add liquidity (classified as LiquidityOnly - no fees)
await positionManager.mint({
    token0: DRAGON_ADDRESS,
    token1: USDC_ADDRESS,
    fee: 3000,
    tickLower: lowerTick,
    tickUpper: upperTick,
    amount0Desired: liquidityAmount,
    amount1Desired: usdcAmount,
    amount0Min: 0,
    amount1Min: 0,
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 1200
});
```

### Contract Integration Pattern
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GameContract {
    IERC20 constant dragon = IERC20(0x69dc1c36f8b26db3471acf0a6469d815e9a27777);
    
    mapping(address => uint256) public playerBalances;
    
    // Deposit DRAGON tokens (direct transfer - no fees)
    function deposit(uint256 amount) external {
        dragon.transferFrom(msg.sender, address(this), amount);
        playerBalances[msg.sender] += amount;
    }
    
    // Withdraw DRAGON tokens (direct transfer - no fees)
    function withdraw(uint256 amount) external {
        require(playerBalances[msg.sender] >= amount, "Insufficient balance");
        playerBalances[msg.sender] -= amount;
        dragon.transfer(msg.sender, amount);
    }
    
    // Note: DEX trading from this contract would trigger fees
    // Direct transfers to/from users do not trigger fees
}
```

## Security Features

- **Smart Fee Detection**: Prevents fee avoidance while allowing legitimate operations
- **Reentrancy Protection**: ReentrancyGuard on critical functions
- **Access Control**: Owner-only administrative functions
- **Error Handling**: Safe lottery integration with graceful failures
- **Vanity Addresses**: Consistent deployment pattern across chains
- **Registry Integration**: Centralized configuration management

## Performance Metrics

### Gas Costs
| Operation | Gas Cost | Fee Applied |
|-----------|----------|-------------|
| Standard Transfer | ~65,000 | No fees |
| DEX Trade (Buy) | ~150,000 | 10% fees + lottery |
| DEX Trade (Sell) | ~120,000 | 10% fees |
| Cross-Chain Send | ~200,000 + LZ fees | No fees |
| Liquidity Add/Remove | ~80,000 | No fees |

### Fee Distribution Speed
- **Immediate**: No accumulation or swapping delays
- **Direct Distribution**: Fees sent directly to target addresses
- **Gas Efficient**: Single transaction fee processing

### Cross-Chain Performance
- **LayerZero V2**: Native cross-chain transfers
- **No Wrapping**: Direct token bridging
- **Fast Finality**: 2-5 minutes typical cross-chain time
- **Low Fees**: Only LayerZero messaging costs

## Sonic FeeM Integration

### Network Benefits
- **FeeM Registration**: Contract registered for Sonic network benefits
- **Fee Optimization**: Reduced transaction costs on Sonic
- **Network Participation**: Contributing to Sonic ecosystem growth

```solidity
// Register with Sonic FeeM
function registerMe() external onlyOwner {
    (bool success,) = address(0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830).call(
        abi.encodeWithSignature("selfRegister(uint256)", 143)
    );
    require(success, "FeeM registration failed");
}
```

## Tokenomics Summary

### Deflationary Mechanics
- **Burn on Trading**: 0.69% of each trade permanently burned
- **No New Minting**: Fixed supply with decreasing circulating supply
- **Cross-Chain Burns**: Burns occur on all chains with trading activity

### Revenue Streams
- **Lottery Funding**: 6.90% of trades fund cross-chain lottery
- **Staker Rewards**: 2.41% of trades reward veDRAGON holders
- **Ecosystem Growth**: Fee structure supports sustainable development

### Utility Features
- **Cross-Chain Gaming**: Native support for multi-chain applications
- **DeFi Integration**: Smart fee detection for optimal DeFi usage
- **Lottery Participation**: Automatic lottery entries create engagement
- **Governance Token**: Future governance integration via veDRAGON

---

**Built for the future of cross-chain DeFi and gaming on the OmniDragon platform**
