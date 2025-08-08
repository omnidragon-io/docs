---
sidebar_position: 1
---

# Quick Start Guide

Get your dApp connected to Red Dragon in 5 minutes with ready-to-use code examples.

## Prerequisites

Before you begin, you'll need:
- **Node.js 18+** and **npm/yarn**
- **Web3 wallet** (MetaMask, WalletConnect, etc.)
- **Basic React/JavaScript** knowledge

## 1. Install Dependencies

```bash
# Install ethers.js for blockchain interaction
npm install ethers

# Optional: Install wagmi for React hooks (recommended)
npm install wagmi viem @tanstack/react-query
```

## 2. Addresses & EIDs (single source)

Use the Frontend Config cheat sheet for all constants (token/registry, EIDs, RPCs, VRF):

- See: /docs/guides/frontend-config

## 3. Basic Token Integration

### Check DRAGON Balance

```javascript
import { ethers } from 'ethers';

// Minimal ERC-20 ABI for balance checking
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

async function getDragonBalance(userAddress, chainId = 'sonic') {
  // Connect to provider
  const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId));
  
  // Create contract instance
  // Import DRAGON_ADDRESS from the Frontend Config cheat sheet
  const contract = new ethers.Contract(DRAGON_ADDRESS, ERC20_ABI, provider);
  
  try {
    const balance = await contract.balanceOf(userAddress);
    const decimals = await contract.decimals();
    
    // Convert from wei to human readable
    const formattedBalance = ethers.formatUnits(balance, decimals);
    
    return {
      raw: balance.toString(),
      formatted: formattedBalance,
      symbol: 'DRAGON'
    };
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
}

// Usage example
const balance = await getDragonBalance('0x742d35Cc6bF4532C747eb30F34D4AdBDce3b3123', 'sonic');
console.log(`Balance: ${balance.formatted} DRAGON`);
```

### Send DRAGON Tokens
Use the minimal example in Frontend Config or reuse the balance code above with a signer.

## 4. React
Use your app’s existing state/query patterns. For a ready hook and more examples, see the full Frontend Integration guide.

## 5. Network Configuration

```javascript
// RPC URLs for each supported chain
function getRpcUrl(chainId) {
  const rpcUrls = {
    sonic: "https://rpc.soniclabs.com",
    arbitrum: "https://arb1.arbitrum.io/rpc", 
    ethereum: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    base: "https://mainnet.base.org",
    avalanche: "https://api.avax.network/ext/bc/C/rpc"
  };
  
  return rpcUrls[chainId];
}

// Chain configurations for wallet switching
const SUPPORTED_CHAINS = {
  sonic: {
    chainId: '0x3D', // 61 in hex
    chainName: 'Sonic',
    rpcUrls: ['https://rpc.soniclabs.com'],
    blockExplorerUrls: ['https://sonicscan.org']
  },
  arbitrum: {
    chainId: '0xA4B1', // 42161 in hex  
    chainName: 'Arbitrum One',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io']
  }
};
```

## 6. Error Handling
Handle errors per your app’s conventions. Common cases: user rejection (4001), insufficient funds, and provider connectivity.

## Next Steps

1. **Check Balance** - Test the balance fetching with your wallet address
2. **View Transactions** - Monitor your transactions on the block explorers
3. **Cross-Chain** - Try the same code on different supported chains
4. **Build Features** - Integrate DRAGON into your dApp features

## Need Help?

- **Block Explorers**: Check transactions on [Sonic Scan](https://sonicscan.org) or [Arbiscan](https://arbiscan.io)
- **Contract ABIs**: Full ABIs available in [Contract Documentation](/docs/contracts/overview)
- **Support**: Join our [Telegram](https://t.me/RedDragon) for developer support