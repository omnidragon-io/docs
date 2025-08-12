---
sidebar_position: 1
---

# Smart Contracts Reference

Complete technical reference for Red Dragon smart contracts with ABIs and integration examples.

## OmniDRAGON Docs Handoff

### Purpose
Concise, copy-ready reference for updating public docs and frontend integration. Includes final vanity addresses, LayerZero settings, verified sources, and correct OFT V2 call patterns.

### Networks
- **Ethereum**: chainId 1, EID 30101, Explorer: `https://etherscan.io`
- **Arbitrum**: chainId 42161, EID 30110, Explorer: `https://arbiscan.io`
- **Avalanche**: chainId 43114, EID 30106, Explorer: `https://snowtrace.io`
- **Base**: chainId 8453, EID 30184, Explorer: `https://basescan.org`
- **Sonic**: chainId 146, EID 30332, Explorer: `https://sonicscan.org`

### Core Contracts (Vanity Addresses)
- **DRAGON (Sonic)**: `0x69dc1c36f8b26db3471acf0a6469d815e9a27777`
- **OmniDragonRegistry (Sonic)**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`
- **OmniDragonPriceOracle**: `0x69aaB98503216E16EC72ac3F4B8dfc900cC27777` (all chains)
- **OmniDragonPrimaryOracle (Sonic-only)**: `0x175c9571771894e151317e80d7b4434e1f583d59`
- **veDRAGON (Sonic)**: `0x69f9d14a337823fad783d21f3669e29088e45777`
- **DragonJackpotVault (Sonic)**: `0x69ec31a869c537749af7fd44dd1fd347d62c7777`
- **OmniDragonLotteryManager (Sonic-only)**: `0x69a6a2813c2224bbc34b3d0bf56c719de3c34777`
- **redDRAGON (ERC-4626 Vault, Sonic)**: `0x69320eb5b9161a34cb9cdd163419f826691a1777`
- **CREATE2 Factory**: `0xAA28020DDA6b954D16208eccF873D79AC6533833`

### LayerZero V2 Settings
- EIDs: Ethereum 30101, Arbitrum 30110, Avalanche 30106, Base 30184, Sonic 30332
- lzRead channels registered in `OmniDragonRegistry` for all chains
- Enforced LZ receive gas removed (extraOptions can be `0x`), rely on dynamic quotes

### Wrapped Native Tokens (set on DragonJackpotVault)
- Sonic: WS set (tx: `0x2b656f...b2b673`)
- Arbitrum: WETH set (tx: `0x9b8224...a31b1`)
- Ethereum: WETH set (tx: `0x6f4845...2e027`)
- Base: WETH set (tx: `0x902c29...c564c`)
- Avalanche: WAVAX set (tx: `0x6b3f38...72880`)

### Verification Status (Main Contracts)
- Sonic: PrimaryOracle, veDRAGON, DragonJackpotVault verified; PriceOracle already verified
- Arbitrum: PriceOracle & Vault already verified; veDRAGON verified (Sourcify)
- Base: PriceOracle & Vault already verified; veDRAGON verified (Sourcify)
- Avalanche: PriceOracle & Vault already verified; veDRAGON verified (Sourcify)

Useful explorer links:
- Sonic PrimaryOracle: `https://sonicscan.org/address/0x175c9571771894e151317e80d7b4434e1f583d59`
- Sonic veDRAGON: `https://sonicscan.org/address/0x69f9d14a337823fad783d21f3669e29088e45777`
- Sonic Vault: `https://sonicscan.org/address/0x69ec31a869c537749af7fd44dd1fd347d62c7777`
- PriceOracle (common):
  - Ethereum: `https://etherscan.io/address/0x69aaB98503216E16EC72ac3F4B8dfc900cC27777`
  - Arbitrum: `https://arbiscan.io/address/0x69aaB98503216E16EC72ac3F4B8dfc900cC27777`
  - Base: `https://basescan.org/address/0x69aaB98503216E16EC72ac3F4B8dfc900cC27777`
  - Avalanche: `https://snowtrace.io/address/0x69aaB98503216E16EC72ac3F4B8dfc900cC27777`

### Correct OFT V2 ABI (Frontend/CLI)
- SendParam: `(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd)`
- MessagingFee: `(uint256 nativeFee, uint256 lzTokenFee)`

#### Quote + Send (example Sonic → Arbitrum 69,420 DRAGON)
```bash
TOKEN=0x69dc1c36f8b26db3471acf0a6469d815e9a27777
TO=0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F
TO_B32=0x000000000000000000000000ddd0050d1e084dfc72d5d06447cc10bcd3fef60f
DST=30110
AMOUNT=$(cast --to-wei 69420 ether)

# quoteSend
QUOTE=$(cast call $TOKEN \
  "quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool)" \
  "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" false \
  --rpc-url $RPC_URL_SONIC)
NATIVE_FEE_HEX=0x$(echo $QUOTE | sed 's/^0x//' | cut -c1-64)
NATIVE_FEE=$(cast to-dec $NATIVE_FEE_HEX)

# send
cast send $TOKEN \
  "send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address)" \
  "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" "($NATIVE_FEE,0)" $TO \
  --value $NATIVE_FEE \
  --rpc-url $RPC_URL_SONIC \
  --private-key $PRIVATE_KEY
```

Notes:
- Remove enforced extraOptions unless explicitly needed; use quotes to get actual cost.
- If slippage causes revert, set `minAmountLD` slightly lower than `amountLD`.

### LayerZero OFT API (for Frontend)
Reference: [Frontend Integration](/docs/guides/frontend-integration). Key points to surface:
- Use `/list` to discover token deployments by symbol
- Use `/transfer` to obtain `populatedTransaction` and optional `approvalTransaction`
- Chain names via `@layerzerolabs/lz-definitions` `Chain` constants
- Provide LayerZero Scan link for tracking: `https://layerzeroscan.com/tx/<hash>`

### Post-Deploy Configuration (already applied)
- Registry `setLayerZeroEndpoint(uint16,address)` for all chains
- Registry `setPriceOracle(uint16,address)` for non-Sonic chains to common `OmniDragonPriceOracle`
- Registry `configurePrimaryOracle(address,uint32)` on Sonic to `OmniDragonPrimaryOracle`
- Registry `setLzReadChannel(uint16,uint32)` across chains
- OmniDRAGON token wiring: LP pair, fee roles, jackpot vault, revenue distributor, delegate set

### TODO (Docs Team)
- Cross-check and add final explorer verification badges/links for each contract per chain
- Ensure frontend bridging uses the correct OFT V2 ABI fields above
- Surface LayerZero OFT API flow prominently with code samples (TS/ethers)
- Link this handoff from the main deployments README

### Source Files
- Quick reference: `docs/deployments/overview.md`
- Frontend guide: `docs/guides/frontend-integration.md`

## Core Contracts

### DRAGON Token (ERC-20)

DRAGON (Sonic) address: `0x69dc1c36f8b26db3471acf0a6469d815e9a27777`

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
    // Set DRAGON_ADDRESS in your app
    this.contract = new ethers.Contract(DRAGON_ADDRESS, DRAGON_ABI, provider);
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
      address: DRAGON_ADDRESS
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

| Chain | Chain ID | EID | Block Explorer |
|-------|----------|-----|----------------|
| **Sonic** | 146 | 30332 | [sonicscan.org](https://sonicscan.org) |
| **Arbitrum** | 42161 | 30110 | [arbiscan.io](https://arbiscan.io) |
| **Ethereum** | 1 | 30101 | [etherscan.io](https://etherscan.io) |
| **Base** | 8453 | 30184 | [basescan.org](https://basescan.org) |
| **Avalanche** | 43114 | 30106 | [snowtrace.io](https://snowtrace.io) |

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