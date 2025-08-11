---
sidebar_position: 1
---

# Protocol Overview

Red Dragon is a next-generation cross-chain ERC-20 token designed for developers building the future of DeFi and gaming applications.

## What is Red Dragon?

Red Dragon combines three powerful technologies to create a unified cross-chain experience:

### 1. LayerZero V2 Cross-Chain Token (OFT)
**What it means for developers:**
- **Same contract addresses** across all chains (Sonic, Arbitrum, Ethereum, Base, Avalanche)
- **Native cross-chain transfers** - no bridges or wrapped tokens
- **Unified liquidity** - tokens can move seamlessly between networks

```javascript
// Same address on all chains
const DRAGON_ADDRESS = "0x69dc1c36f8b26db3471acf0a6469d815e9a27777";

// Transfer from Sonic to Arbitrum (example)
await dragonContract.send(
  arbitrumChainId,           // Destination chain
  recipientAddress,          // Recipient on destination
  amount,                    // Amount to send
  { value: crossChainFee }   // LayerZero fee
);
```

### 2. Chainlink VRF Integration
**What it enables:**
- **Provably fair randomness** for lottery and gaming features
- **Transparent outcomes** - anyone can verify the randomness
- **Secure implementation** - no possibility of manipulation

```javascript
// Request randomness for your dApp
const vrfTx = await vrfContract.requestRandomWordsSimple(1, {
  value: ethers.parseEther("0.21") // VRF fee
});

// Get results when ready
const [fulfilled, randomWords] = await vrfContract.getRequestStatus(requestId);
if (fulfilled) {
  const randomNumber = randomWords[0];
  // Use for lottery, gaming, etc.
}
```

### 3. Unified Developer Experience
**Development benefits:**
- **Single codebase** works across all supported chains
- **Consistent APIs** - same functions, same behavior everywhere
- **Real-time events** - listen for transfers, randomness, etc.

## Core Architecture

### Token Properties
```javascript
{
  name: "Red Dragon",
  symbol: "DRAGON", 
  decimals: 18,
  type: "LayerZero V2 OFT",
  networks: ["Sonic", "Arbitrum", "Ethereum", "Base", "Avalanche"],
  totalSupply: "Dynamic (varies per chain)"
}
```

### Smart Contract Stack

```
┌─────────────────────────────────────┐
│           Frontend dApp             │
│        (React, Vue, etc.)          │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           ethers.js                 │
│       (Web3 interaction)           │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         DRAGON Token                │
│       (ERC-20 + OFT)               │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        LayerZero V2                 │
│     (Cross-chain messaging)        │
└─────────────────────────────────────┘
```

## Integration Patterns

### 1. Basic Token Operations
Most common use case - checking balances and sending tokens:

```javascript
class DragonIntegration {
  constructor(chainId = 'sonic') {
    this.chainId = chainId;
    this.provider = new ethers.JsonRpcProvider(getRpcUrl(chainId));
    this.contract = new ethers.Contract(DRAGON_ADDRESS, DRAGON_ABI, this.provider);
  }

  // Check if user can afford something
  async canAfford(userAddress, requiredAmount) {
    const balance = await this.contract.balanceOf(userAddress);
    const required = ethers.parseUnits(requiredAmount.toString(), 18);
    return balance >= required;
  }

  // Get user's balance in human-readable format
  async getBalance(userAddress) {
    const balance = await this.contract.balanceOf(userAddress);
    return ethers.formatUnits(balance, 18);
  }
}
```

### 2. Cross-Chain Transfers
Enable users to move tokens between networks:

```javascript
// Estimate cross-chain fee first
const fee = await dragonContract.quoteSend(
  destinationChainId,
  recipientAddress,
  amount,
  false // payInLzToken
);

// Execute cross-chain transfer
const tx = await dragonContract.send(
  destinationChainId,
  recipientAddress, 
  amount,
  {
    value: fee.nativeFee, // Pay LayerZero fee
    gasLimit: 500000     // Sufficient gas for cross-chain
  }
);
```

### 3. Event-Driven Updates
Keep your UI synchronized with blockchain events:

```javascript
// Listen for all DRAGON transfers
dragonContract.on('Transfer', (from, to, value, event) => {
  console.log(`Transfer: ${ethers.formatUnits(value, 18)} DRAGON`);
  console.log(`From: ${from}`);
  console.log(`To: ${to}`);
  console.log(`Tx: ${event.transactionHash}`);
  
  // Update your UI here
  updateBalanceDisplay();
});

// Listen for cross-chain sends
dragonContract.on('SendToChain', (dstChainId, from, to, amount) => {
  console.log(`Cross-chain send to chain ${dstChainId}`);
  // Show "transfer pending" in UI
});
```

## Use Cases for Developers

### 1. DeFi Applications
- **Liquidity pools** across multiple chains
- **Yield farming** with unified rewards
- **Cross-chain arbitrage** opportunities

### 2. Gaming & NFTs
- **In-game currency** that works across game servers (chains)
- **Tournament prizes** with verifiable randomness
- **Cross-platform item trading**

### 3. dApps & Services
- **Subscription payments** in DRAGON tokens
- **Governance voting** across all networks
- **Reward systems** with fair distribution

## Development Workflow

### 1. Setup & Testing
```bash
# Install dependencies
npm install ethers

# Test on testnet first
const provider = new ethers.JsonRpcProvider('https://testnet-rpc-url');
```

### 2. Integration Steps
1. **Connect wallet** (MetaMask, WalletConnect)
2. **Check network** (switch if needed)
3. **Read token data** (balance, allowance)
4. **Execute transactions** (transfer, approve)
5. **Monitor events** (success, failure)

### 3. Production Deployment
- **Use mainnet RPCs** for production
- **Implement error handling** for all edge cases
- **Add loading states** for better UX
- **Cache data** to reduce RPC calls

## Security Considerations

### For Frontend Developers
1. **Validate all addresses** before transactions
2. **Check balances** before attempting transfers  
3. **Handle wallet rejections** gracefully
4. **Never store private keys** in frontend code
5. **Use HTTPS** for all RPC connections

### For Smart Contract Integration
1. **Verify contract addresses** match documentation
2. **Use latest ABIs** from official sources
3. **Test on testnets** before mainnet
4. **Implement circuit breakers** for large amounts
5. **Monitor for unusual activity**

## Performance Tips

### Optimize RPC Calls
```javascript
// Bad: Multiple separate calls
const balance = await contract.balanceOf(user);
const symbol = await contract.symbol();
const decimals = await contract.decimals();

// Good: Batch calls together  
const [balance, symbol, decimals] = await Promise.all([
  contract.balanceOf(user),
  contract.symbol(),
  contract.decimals()
]);
```

### Cache Contract Instances
```javascript
// Create once, reuse everywhere
const dragonContract = new ethers.Contract(DRAGON_ADDRESS, DRAGON_ABI, provider);

// Don't recreate contracts unnecessarily
```

### Use Event Filters
```javascript
// Efficient: Filter events for specific user
const filter = contract.filters.Transfer(userAddress, null);
contract.on(filter, handleTransfer);

// Inefficient: Listen to all events
contract.on('Transfer', handleAllTransfers);
```

## Next Steps

1. **Start with Quick Start** - Get basic integration working
2. **Review Contract Docs** - Understand all available functions
3. **Join Community** - Get help from other developers
4. **Build Something** - Create your first DRAGON-powered dApp

## Common Questions

**Q: Can I use the same code on all chains?**  
A: Yes! The contract addresses and ABIs are identical across all supported networks.

**Q: How much does a cross-chain transfer cost?**  
A: LayerZero fees vary by destination, typically $0.50-$5.00 USD equivalent.

**Q: Are there rate limits on transactions?**  
A: No protocol-level limits, but respect RPC provider rate limits.

**Q: Can I build on testnets first?**  
A: Yes, we recommend testing on testnets before mainnet deployment.