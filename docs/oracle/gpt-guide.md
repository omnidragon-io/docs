---
title: OmniDragonOracle Integration Guide
sidebar_position: 40
---

## Overview
The OmniDragonOracle is a multi-source price aggregation system on Sonic providing real-time pricing for DRAGON and Native (S) tokens through four independent oracle sources.

## Contract Details

- Deployed Address: `0x69B96004C850722B98bF307a1e8dd259713A5777`
- Network: Sonic (Chain ID: 146)
- RPC URL: `https://rpc.sonic.mainnet.soniclabs.com/`

## Key Functions for Integration

### 1. Get Current DRAGON Price
```solidity
function getLatestPrice() external view returns (int256 price, uint256 timestamp)
```
- Price uses 8 decimals (e.g., `131496` = $0.00131496)

### 2. Get Current Native (S) Price  
```solidity
function getNativeTokenPrice() external view returns (int256 price, bool isValid, uint256 timestamp)
```

### 3. Get Combined Price Data
```solidity
function getPrice(uint32 _eid) external view returns (
    int256 dragonPrice, 
    int256 nativePrice, 
    uint256 timestamp, 
    bool isValid
)
```

### 4. Trigger Price Update
```solidity
function updatePrice() external payable
```

### 5. Check Oracle Health
```solidity
function validatePrice() external view returns (
    bool localValid,
    bool crossChainValid,
    int256 averagePeerPrice,
    int256 priceDifference
)
```

## Aggregation System

Sources (equal weights by default): Chainlink S/USD, Pyth S/USD, Band S/USD, API3 S/USD.

Price calculation:
```
Native Price = WeightedAverage(Chainlink + Pyth + Band + API3)
DRAGON Price = (Native Price × 1e8) / DEX_Ratio
```

## Web3 Example

```ts
import { ethers } from 'ethers'

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_SONIC!)
const ORACLE_ADDRESS = '0x69B96004C850722B98bF307a1e8dd259713A5777'
const ABI = [
  'function getLatestPrice() view returns (int256,uint256)',
]

const oracle = new ethers.Contract(ORACLE_ADDRESS, ABI, provider)
const [price8] = await oracle.getLatestPrice()
const priceUsd = Number(price8) / 1e8
```

## Notes

- Use Reference → Addresses (Sonic) for canonical addresses
- Prices use 8 decimals; convert by dividing by 1e8

