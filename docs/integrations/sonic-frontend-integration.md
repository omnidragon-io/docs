---
title: Sonic Frontend Integration Guide
description: Essential integration guide for OmniDragon on Sonic mainnet.
---

## Setup

**Network**: Sonic mainnet (Chain ID: 146) • **RPC**: `RPC_URL_SONIC` • **Addresses**: Load from `deployments/sonic/*.json` or [Reference](/docs/reference/addresses)  
**Units**: Prices (18 decimals) • USD amounts (6 decimals) • Probabilities (PPM: 1M = 100%) • BPS (10,000 = 100%)

## Code Example

```ts
import { createPublicClient, http, getContract, parseAbi } from 'viem';
import { sonic } from 'viem/chains';

const client = createPublicClient({ chain: sonic, transport: http(process.env.RPC_URL_SONIC!) });
const LM_ADDR = '0x69a6a2813c2224bbc34b3d0bf56c719de3c34777'; // Load from deployments/sonic/*.json

const lm = getContract({ 
  address: LM_ADDR, 
  abi: parseAbi([
    'function getDragonPriceUSD() view returns (int256,bool,uint256)',
    'function calculateWinProbability(address,uint256) view returns (uint256,uint256)',
    'function getCurrentJackpot() view returns (uint256)',
    'function getUserStats(address) view returns (uint256,uint256,uint256,uint256,uint256)'
  ]), 
  client 
});

// Usage examples
const [price18, isValid, timestamp] = await lm.read.getDragonPriceUSD();
const [basePPM, boostedPPM] = await lm.read.calculateWinProbability([user, usdAmount6]);
const jackpot = await lm.read.getCurrentJackpot();
```

## Key Functions

- **Price**: `getDragonPriceUSD()` → (price18, isValid, timestamp) - Convert: `price18 / 1e18`
- **Win probability**: `calculateWinProbability(user, usd6)` → (basePPM, boostedPPM) - Convert: `ppm / 10_000`
- **Jackpot**: `getCurrentJackpot()` → current vault balance in wei
- **User stats**: `getUserStats(user)` → (swaps, volume, wins, rewards, lastTimestamp)
- **Partners**: GOOD, ffDRAGON share 6.9% probability budget via gauge voting
- **Cross-chain**: See [deployments overview](/docs/deployments/overview) for OFT examples


