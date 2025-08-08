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

```javascript
async function sendDragon(recipientAddress, amount, chainId = 'sonic') {
  // Connect to user's wallet
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // Create contract instance with signer
  // Import DRAGON_ADDRESS from the Frontend Config cheat sheet
  const contract = new ethers.Contract(DRAGON_ADDRESS, ERC20_ABI, signer);
  
  try {
    // Convert amount to wei (18 decimals for DRAGON)
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    
    // Send transaction
    const tx = await contract.transfer(recipientAddress, amountWei);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.transactionHash);
    
    return {
      success: true,
      txHash: receipt.transactionHash,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('Transfer failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Usage example
const result = await sendDragon('0x742d35Cc6bF4532C747eb30F34D4AdBDce3b3123', 100);
```

## 4. React Hook Example

For React applications, here's a reusable hook:

```jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function useDragonBalance(userAddress, chainId = 'sonic') {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userAddress) return;

    async function fetchBalance() {
      setLoading(true);
      setError(null);
      
      try {
        const balanceData = await getDragonBalance(userAddress, chainId);
        setBalance(balanceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [userAddress, chainId]);

  return { balance, loading, error };
}

// Usage in component
function DragonWallet({ userAddress }) {
  const { balance, loading, error } = useDragonBalance(userAddress);

  if (loading) return <div>Loading balance...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!balance) return <div>No balance data</div>;

  return (
    <div className="dragon-balance">
      <h3>Your DRAGON Balance</h3>
      <p>{balance.formatted} DRAGON</p>
    </div>
  );
}
```

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

```javascript
// Comprehensive error handling for common issues
function handleWeb3Error(error) {
  if (error.code === 4001) {
    return "User rejected the transaction";
  }
  
  if (error.code === -32603) {
    return "Internal error - check your connection";
  }
  
  if (error.message.includes('insufficient funds')) {
    return "Insufficient funds for transaction";
  }
  
  if (error.message.includes('user rejected')) {
    return "Transaction was cancelled";
  }
  
  return error.message || "An unknown error occurred";
}
```

## Next Steps

1. **Check Balance** - Test the balance fetching with your wallet address
2. **View Transactions** - Monitor your transactions on the block explorers
3. **Cross-Chain** - Try the same code on different supported chains
4. **Build Features** - Integrate DRAGON into your dApp features

## Need Help?

- **Block Explorers**: Check transactions on [Sonic Scan](https://sonicscan.org) or [Arbiscan](https://arbiscan.io)
- **Contract ABIs**: Full ABIs available in [Contract Documentation](/docs/contracts/overview)
- **Support**: Join our [Telegram](https://t.me/RedDragon) for developer support