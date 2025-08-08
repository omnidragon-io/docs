---
sidebar_position: 1
---

# Smart Contracts Reference

Complete technical reference for Red Dragon smart contracts with ABIs and integration examples.

## Core Contracts

### DRAGON Token (ERC-20)

Address: see Frontend Config cheat sheet (/docs/guides/frontend-config)

```javascript
// Essential ERC-20 functions for frontend integration
const DRAGON_ABI = [
  // Read functions
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  
  // Write functions  
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];
```

**Key Properties:**
- **Decimals**: 18
- **Symbol**: DRAGON  
- **Total Supply**: Dynamic (varies by chain)
- **Cross-Chain**: LayerZero V2 OFT compatible

### VRF Integrator

**Deployed on select chains at:** `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5`

```javascript
// VRF functions for lottery and randomness
const VRF_ABI = [
  // Request randomness
  "function requestRandomWordsSimple(uint32 numWords) payable returns (uint256 requestId)",
  "function requestRandomWords(uint32 numWords, uint32 callbackGasLimit) payable returns (uint256 requestId)",
  
  // View functions
  "function getLatestRandomness() view returns (uint256[] memory)",
  "function getRequestStatus(uint256 requestId) view returns (bool fulfilled, uint256[] memory randomWords)",
  
  // Events
  "event RandomnessRequested(uint256 indexed requestId, uint32 numWords)",
  "event RandomnessFulfilled(uint256 indexed requestId, uint256[] randomWords)"
];
```

## Minimal Integration

### Basic Token Read/Write

```javascript
import { ethers } from 'ethers';

class DragonTokenService {
  constructor(provider) {
    this.provider = provider;
    // Import DRAGON (address) from Frontend Config
    this.contract = new ethers.Contract(DRAGON, DRAGON_ABI, provider);
  }

  // Get token information
  async getTokenInfo() {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(), 
      this.contract.decimals(),
      this.contract.totalSupply()
    ]);

    return {
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: ethers.formatUnits(totalSupply, decimals),
      address: DRAGON
    };
  }

  // Check if user has enough balance
  async hasEnoughBalance(userAddress, requiredAmount) {
    const balance = await this.contract.balanceOf(userAddress);
    const decimals = await this.contract.decimals();
    const requiredWei = ethers.parseUnits(requiredAmount.toString(), decimals);
    
    return balance >= requiredWei;
  }

  // Get formatted balance
  async getFormattedBalance(userAddress) {
    const [balance, decimals] = await Promise.all([
      this.contract.balanceOf(userAddress),
      this.contract.decimals()
    ]);

    return {
      raw: balance.toString(),
      formatted: ethers.formatUnits(balance, decimals),
      decimals: Number(decimals)
    };
  }
}

// Usage
const provider = new ethers.JsonRpcProvider(RPC.sonic);
const dragonService = new DragonTokenService(provider);

const tokenInfo = await dragonService.getTokenInfo();
console.log('Token Info:', tokenInfo);
```

### Transaction Handling

```javascript
// Complete transaction flow with proper error handling
async function executeTokenTransfer(recipientAddress, amount, chainId = 'sonic') {
  try {
    // 1. Connect to user wallet
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // 2. Create contract instance
    const contract = new ethers.Contract(DRAGON_CONTRACTS[chainId], DRAGON_ABI, signer);

    // 3. Validate inputs
    if (!ethers.isAddress(recipientAddress)) {
      throw new Error('Invalid recipient address');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // 4. Check balance
    const balance = await contract.balanceOf(userAddress);
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount.toString(), decimals);

    if (balance < amountWei) {
      throw new Error('Insufficient DRAGON balance');
    }

    // 5. Estimate gas
    const gasEstimate = await contract.transfer.estimateGas(recipientAddress, amountWei);
    const gasLimit = gasEstimate * 120n / 100n; // Add 20% buffer

    // 6. Execute transaction
    const tx = await contract.transfer(recipientAddress, amountWei, {
      gasLimit: gasLimit
    });

    // 7. Return transaction details
    return {
      success: true,
      txHash: tx.hash,
      amount: amount.toString(),
      recipient: recipientAddress,
      gasEstimate: gasEstimate.toString(),
      status: 'pending'
    };

  } catch (error) {
    return {
      success: false,
      error: handleWeb3Error(error),
      details: error.message
    };
  }
}
```

### Event Listening

```javascript
// Listen for DRAGON token transfers
function watchDragonTransfers(userAddress, chainId = 'sonic') {
  const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId));
  const contract = new ethers.Contract(DRAGON_CONTRACTS[chainId], DRAGON_ABI, provider);

  // Filter for transfers involving user
  const filterFrom = contract.filters.Transfer(userAddress, null);
  const filterTo = contract.filters.Transfer(null, userAddress);

  // Listen for outgoing transfers
  contract.on(filterFrom, (from, to, value, event) => {
    console.log('Outgoing transfer:', {
      from,
      to,
      amount: ethers.formatUnits(value, 18),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });

  // Listen for incoming transfers  
  contract.on(filterTo, (from, to, value, event) => {
    console.log('Incoming transfer:', {
      from,
      to, 
      amount: ethers.formatUnits(value, 18),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });

  // Cleanup function
  return () => {
    contract.removeAllListeners();
  };
}
```

### VRF Integration (Lottery)

```javascript
// Request randomness for lottery/gaming features
async function requestRandomness(numWords = 1) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const vrfContract = new ethers.Contract(
      VRF_CONTRACTS.arbitrum, // VRF only on Arbitrum currently
      VRF_ABI,
      signer
    );

    // Cost: ~0.21 ETH for VRF request
    const value = ethers.parseEther('0.21');
    
    const tx = await vrfContract.requestRandomWordsSimple(numWords, {
      value: value
    });

    console.log('VRF request sent:', tx.hash);
    
    const receipt = await tx.wait();
    
    // Extract request ID from logs
    const event = receipt.logs.find(log => 
      log.topics[0] === vrfContract.interface.getEventTopic('RandomnessRequested')
    );
    
    const requestId = ethers.toBigInt(event.topics[1]);

    return {
      success: true,
      requestId: requestId.toString(),
      txHash: receipt.transactionHash
    };

  } catch (error) {
    return {
      success: false,
      error: handleWeb3Error(error)
    };
  }
}

// Check if randomness is ready
async function checkRandomnessStatus(requestId) {
  const provider = new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
  const vrfContract = new ethers.Contract(VRF_CONTRACTS.arbitrum, VRF_ABI, provider);

  try {
    const [fulfilled, randomWords] = await vrfContract.getRequestStatus(requestId);
    
    return {
      fulfilled,
      randomWords: randomWords.map(word => word.toString()),
      requestId
    };
  } catch (error) {
    console.error('Error checking VRF status:', error);
    return null;
  }
}
```

## Network Information

### Supported Chains

| Chain | Chain ID | Block Explorer |
|-------|----------|----------------|
| **Sonic** | 61 | [sonicscan.org](https://sonicscan.org) |
| **Arbitrum** | 42161 | [arbiscan.io](https://arbiscan.io) |
| **Ethereum** | 1 | [etherscan.io](https://etherscan.io) |
| **Base** | 8453 | [basescan.org](https://basescan.org) |
| **Avalanche** | 43114 | [snowscan.xyz](https://snowscan.xyz) |

### Gas Optimization Tips

```javascript
// Optimize gas usage for better UX
const gasOptimizationTips = {
  // Use multicall for multiple operations
  batchOperations: true,
  
  // Set reasonable gas limits
  gasLimitMultiplier: 1.2,
  
  // Use gasless transactions where possible
  enableMetaTx: false, // Coming soon
  
  // Cache contract instances
  reuseContracts: true
};
```

## Common Patterns

### React Integration Pattern

```jsx
// Complete React component example
import { useState, useEffect, useCallback } from 'react';

function DragonTokenManager({ userAddress, chainId = 'sonic' }) {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  const refreshData = useCallback(async () => {
    if (!userAddress) return;
    
    setLoading(true);
    try {
      const service = new DragonTokenService(
        new ethers.JsonRpcProvider(getRpcUrl(chainId)),
        chainId
      );

      const [info, balanceData] = await Promise.all([
        service.getTokenInfo(),
        service.getFormattedBalance(userAddress)
      ]);

      setTokenInfo(info);
      setBalance(balanceData.formatted);
    } catch (error) {
      console.error('Error loading token data:', error);
    } finally {
      setLoading(false);
    }
  }, [userAddress, chainId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dragon-token-manager">
      <h3>{tokenInfo?.name} ({tokenInfo?.symbol})</h3>
      <p>Balance: {balance} DRAGON</p>
      <button onClick={refreshData}>Refresh</button>
    </div>
  );
}
```

## Security Best Practices

1. **Always validate addresses** with `ethers.isAddress()`
2. **Check balances** before transactions
3. **Handle all error cases** gracefully
4. **Use gas estimation** to prevent failures
5. **Implement proper loading states** for better UX
6. **Cache contract instances** to avoid recreation
7. **Listen for events** to update UI reactively

## Troubleshooting

**Common Issues:**
- **"User rejected"** - User cancelled transaction in wallet
- **"Insufficient funds"** - Not enough ETH for gas or DRAGON for transfer
- **"Invalid address"** - Address format is incorrect
- **"Contract not deployed"** - Wrong network or contract address

**Debug Steps:**
1. Check network connection
2. Verify contract addresses
3. Confirm user has sufficient gas
4. Test with small amounts first
5. Check transaction in block explorer