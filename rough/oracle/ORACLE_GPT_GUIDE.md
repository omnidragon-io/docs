# 🐉 OmniDragonOracle GPT Integration Guide

## Overview
The OmniDragonOracle is a sophisticated, multi-source price aggregation system deployed on Sonic network that provides real-time pricing for DRAGON tokens and Native (S) tokens through 4 independent oracle sources.

## 🏗️ Contract Details

**Deployed Address:** `0x69B96004C850722B98bF307a1e8dd259713A5777`
**Network:** Sonic (Chain ID: 146)
**RPC URL:** `https://rpc.soniclabs.com/`

## 🎯 Key Functions for Game Integration

### 1. **Get Current DRAGON Price**
```solidity
function getLatestPrice() external view returns (int256 price, uint256 timestamp)
```
- Returns: DRAGON price in 8-decimal USD format
- Example: `131496` = $0.00131496
- `timestamp`: Last update time (Unix timestamp)

### 2. **Get Current Native (S) Price**  
```solidity
function getNativeTokenPrice() external view returns (int256 price, bool isValid, uint256 timestamp)
```
- Returns: Native (S) price in 8-decimal USD format  
- Example: `30265489` = $0.30265489
- `isValid`: Whether price is fresh (< 1 hour old)

### 3. **Get Combined Price Data**
```solidity
function getPrice(uint32 _eid) external view returns (
    int256 dragonPrice, 
    int256 nativePrice, 
    uint256 timestamp, 
    bool isValid
)
```
- Use `_eid = 0` for local prices
- Returns both prices in one call

### 4. **Trigger Price Update** (Community Interaction)
```solidity
function updatePrice() external payable
```
- Community can call this to refresh prices
- Requires small gas fee
- Updates both DRAGON and Native prices
- Emits `PriceUpdated` event

### 5. **Check Oracle Health**
```solidity
function validatePrice() external view returns (
    bool localValid,
    bool crossChainValid,
    int256 averagePeerPrice,
    int256 priceDifference
)
```

## 📊 Oracle Aggregation System

### **4 Equal-Weight Sources (25% each):**
1. **Chainlink S/USD** - Traditional oracle leader
2. **Pyth Network S/USD** - High-frequency price feeds  
3. **Band Protocol S/USD** - Decentralized oracle network
4. **API3 S/USD** - First-party oracle solution

### **Price Calculation:**
```
Native Price = WeightedAverage(Chainlink×25% + Pyth×25% + Band×25% + API3×25%)
DRAGON Price = (Native Price × 1e8) / DEX_Ratio
```

### **Safety Requirements:**
- Minimum 2/4 sources must be active
- Prices must be fresh (< 30 minutes from source)
- Positive price validation
- Cross-chain validation available

## 🎮 Game Integration Patterns

### **Price Prediction Setup:**
```javascript
// Get current price for prediction baseline
const [currentPrice, timestamp] = await oracle.getLatestPrice();
const priceUSD = currentPrice / 1e8; // Convert to readable USD

// Set prediction window (e.g., 1 hour)
const predictionWindow = 3600; // seconds
const targetTime = timestamp + predictionWindow;
```

### **Price Monitoring:**
```javascript
// Check if price needs community update
const [nativePrice, isValid, lastUpdate] = await oracle.getNativeTokenPrice();
const staleness = Date.now()/1000 - lastUpdate;

if (staleness > 1800) { // 30 minutes
    // Reward community for calling updatePrice()
    incentivizePriceUpdate();
}
```

### **Oracle Health Monitoring:**
```javascript
// Check aggregation health
const [localValid, crossChainValid, avgPeerPrice, diff] = await oracle.validatePrice();

if (!localValid) {
    alertCommunity("Oracle needs price update!");
} else if (Math.abs(diff) > threshold) {
    alertCommunity("Price discrepancy detected!");
}
```

## 🔢 Price Format Guide

**All prices use 8-decimal precision:**
- Raw: `30265489` = USD: `$0.30265489`
- Raw: `131496` = USD: `$0.00131496`

**Conversion Formula:**
```javascript
const priceUSD = rawPrice / 100000000; // Divide by 1e8
const displayPrice = `$${priceUSD.toFixed(8)}`;
```

## 🚨 Error Handling

**Common Revert Reasons:**
- `"NotOwner"` - Only owner can call certain functions
- `"NotPrimary"` - Oracle not in PRIMARY mode
- `"CalculationFailed"` - Insufficient valid sources
- `"InvalidAmount"` - Invalid parameter values

**Price Validation:**
```javascript
// Check if price is reasonable
function isPriceReasonable(price) {
    const usdPrice = price / 1e8;
    
    // DRAGON should be ~$0.001-$0.01
    if (price < 50000 || price > 10000000) return false;
    
    return true;
}
```

## 🎯 Game Mechanics Ideas

### **Community Oracle Keepers:**
- Reward players for calling `updatePrice()` when stale
- Track "Oracle Hero" leaderboards
- Bonus points for maintaining price freshness

### **Price Prediction Accuracy:**
- Use aggregated price as "ground truth" 
- Higher accuracy = better rewards
- Factor in Oracle confidence levels

### **Oracle Health Monitoring:**
- Gamify cross-chain price validation
- Community alerts for price discrepancies  
- Reputation system for reliable monitors

## 📱 Web3 Integration Example

```javascript
import { ethers } from 'ethers';

// Contract setup
const provider = new ethers.JsonRpcProvider('https://rpc.sonic.mainnet.soniclabs.com/');
const oracleAddress = '0x6969b78c68127B50fCF7Fd66777777777EaF777777';
const oracle = new ethers.Contract(oracleAddress, oracleABI, provider);

// Game integration
async function getCurrentGameState() {
    const [dragonPrice, timestamp] = await oracle.getLatestPrice();
    const [nativePrice, isValid] = await oracle.getNativeTokenPrice();
    
    return {
        dragonUSD: dragonPrice / 1e8,
        nativeUSD: nativePrice / 1e8,
        lastUpdate: new Date(timestamp * 1000),
        isHealthy: isValid,
        staleness: Date.now()/1000 - timestamp
    };
}

// Community interaction
async function communityPriceUpdate(signer) {
    const oracleWithSigner = oracle.connect(signer);
    const tx = await oracleWithSigner.updatePrice();
    
    // Reward user for keeping Oracle fresh!
    return tx.hash;
}
```

## 🔐 Security Considerations

- Oracle is **owned** - only owner can configure sources
- Price updates are **permissionless** - anyone can call
- Cross-chain validation provides additional security layer
- Multiple source aggregation prevents single point of failure

## 📊 Monitoring Dashboard Data

**Key Metrics to Track:**
- Individual source prices vs aggregated price
- Price update frequency by community
- Oracle uptime and health scores
- Cross-chain validation success rate
- Community engagement with Oracle functions

This Oracle system is designed to be both robust and community-interactive, perfect for gamification! 🚀
