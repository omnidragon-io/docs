---
title: OmniDragon — Cross-Chain VRF System
sidebar_position: 70
---

# OmniDragon Cross-Chain VRF v2.5 System

## 🎯 System Overview

The OmniDragon Cross-Chain VRF System is a cutting-edge implementation combining **Chainlink VRF v2.5** with **LayerZero V2** omnichain infrastructure. This allows secure, verifiable randomness generation that can be requested from any supported blockchain and fulfilled via Arbitrum's robust VRF infrastructure.

- **Status**: ✅ **FULLY OPERATIONAL**
- **Version**: v1.0.0
- **Deployed**: December 19, 2024
- **Architecture**: Cross-chain VRF using LayerZero V2 + Chainlink VRF v2.5

## 🌐 Network Deployment

### Primary VRF Network (Arbitrum)
- **Network**: Arbitrum One
- **Chain ID**: 42161
- **LayerZero EID**: 30110
- **Role**: VRF Request Fulfillment
- **VRF Coordinator**: `0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e`
- **Gas Lane**: 30 gwei
- **Subscription ID**: `49130512167777098004519592693541429977179420141459329604059253338290818062746`

### Cross-Chain Integrator Networks

#### Sonic Mainnet
- **Chain ID**: 146
- **LayerZero EID**: 30272
- **Integrator Contract**: `0x694f00e7CAB26F9D05261c3d62F52a81DE18A777`
- **Status**: ✅ Verified and Operational
- **Explorer**: [SonicScan](https://sonicscan.org/address/0x694f00e7CAB26F9D05261c3d62F52a81DE18A777)

## 📋 Contract Architecture

### Core Contracts

#### ChainlinkVRFIntegratorV2_5
- **Address**: `0x694f00e7CAB26F9D05261c3d62F52a81DE18A777` (Multi-chain)
- **Purpose**: Cross-chain VRF request gateway
- **Deployment**: CREATE2 (consistent address across chains)
- **Owner**: `0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F`

#### OmniDragonVRFConsumerV2_5 (Arbitrum)
- **Address**: `0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5`
- **Purpose**: Chainlink VRF consumer and LayerZero responder
- **Transaction**: [`0xdcbb1d259680a0ef7b0c9bb606a24502bf600320c2a2e693ef5b9dbd62212f90`](https://arbiscan.io/tx/0xdcbb1d259680a0ef7b0c9bb606a24502bf600320c2a2e693ef5b9dbd62212f90)
- **Block**: 365,508,952

#### OmniDragonRegistry
- **Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` (Multi-chain)
- **Purpose**: Cross-chain configuration and routing
- **Deployment**: CREATE2 with vanity pattern `0x69...0777`

## 🔄 Cross-Chain VRF Flow

### Request Flow
```
1. User on Sonic → ChainlinkVRFIntegratorV2_5.requestRandomWordsSimple(30110)
2. LayerZero V2 → Cross-chain message to Arbitrum (EID 30110)
3. Arbitrum Consumer → Chainlink VRF v2.5 Coordinator
4. VRF Coordinator → Generate verifiable randomness
5. Response → LayerZero V2 back to Sonic
6. Sonic User → Receives random words via callback
```

### Supported Operations

#### Simple VRF Request
```solidity
function requestRandomWordsSimple(uint32 targetEid) external payable
```

#### Advanced VRF Request  
```solidity
function requestRandomWordsWithGas(uint32 targetEid, uint32 gasLimit) external payable
```

#### Fee Estimation
```solidity
function quoteSimple() external view returns (MessagingFee memory fee)
function quoteWithGas(uint32 gasLimit) external view returns (MessagingFee memory fee)
```

## 💰 Fee Structure

### Cross-Chain VRF Costs
- **Standard Quote**: ~0.195 ETH
- **Custom Gas Quote**: ~0.151 ETH (200k gas limit)
- **Recommended Safety Margin**: 10%
- **Note**: Fees fluctuate with gas prices and network congestion

### Cost Breakdown
1. **LayerZero V2 Message**: Variable based on gas and DVN costs
2. **Chainlink VRF v2.5**: LINK token cost for randomness generation
3. **Arbitrum Gas**: Execution costs on destination chain

## 🛠 Integration Guide

### Basic Usage (Solidity)

```solidity
// 1. Get quote for cross-chain VRF request
uint256 fee = IChainlinkVRFIntegratorV2_5(0x694f00e7CAB26F9D05261c3d62F52a81DE18A777)
    .quoteSimple().nativeFee;

// 2. Make cross-chain VRF request
IChainlinkVRFIntegratorV2_5(0x694f00e7CAB26F9D05261c3d62F52a81DE18A777)
    .requestRandomWordsSimple{value: fee}(30110); // Arbitrum EID

// 3. Implement callback to receive randomness
function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
    // Handle received randomness
    uint256 randomResult = randomWords[0];
    // Your random logic here
}
```

### Command Line Usage

```bash
# Get fee quote
npx hardhat run scripts/vrf-helper.ts --network sonic

# Test full system
npx hardhat run scripts/test-vrf-system.ts --network sonic

# Make VRF request
cast send 0x694f00e7CAB26F9D05261c3d62F52a81DE18A777 \
  'requestRandomWordsSimple(uint32)' 30110 \
  --value 0.21ether \
  --rpc-url $RPC_URL_SONIC \
  --private-key $PRIVATE_KEY \
  --legacy
```

### JavaScript Integration

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://rpc.soniclabs.com/');
const integrator = new ethers.Contract(
  '0x694f00e7CAB26F9D05261c3d62F52a81DE18A777',
  INTEGRATOR_ABI,
  wallet
);

// Get quote
const quote = await integrator.quoteSimple();
console.log(`VRF Request Fee: ${ethers.formatEther(quote.nativeFee)} ETH`);

// Make request
const tx = await integrator.requestRandomWordsSimple(30110, {
  value: quote.nativeFee
});

console.log(`VRF Request sent: ${tx.hash}`);
```

## 🔧 LayerZero V2 Configuration

### Pathway Configuration

#### Sonic → Arbitrum
- **Source EID**: 30272 (Sonic)
- **Destination EID**: 30110 (Arbitrum)
- **Status**: ✅ Configured
- **Enforced Options**: 200,000 gas limit

#### Arbitrum → Sonic  
- **Source EID**: 30110 (Arbitrum)
- **Destination EID**: 30272 (Sonic)
- **Status**: ✅ Configured
- **Enforced Options**: 200,000 gas limit

### Security Configuration
- **DVN**: LayerZero Labs verification
- **Executor**: LayerZero standard execution
- **Gas Limits**: Optimized for VRF operations

## 📊 Chainlink VRF v2.5 Details

### VRF Configuration
- **Coordinator**: `0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e` (Arbitrum)
- **Key Hash**: `0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409`
- **Gas Lane**: 30 gwei
- **Subscription**: Funded and operational
- **Consumer**: `0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5` (Authorized)

### VRF Benefits
- **True Randomness**: Cryptographically secure and verifiable
- **Tamper-Proof**: Cannot be manipulated by miners or validators  
- **On-Chain Verification**: Results verifiable on-chain
- **Cost Effective**: Optimized gas usage on Arbitrum

## 🔍 Monitoring & Maintenance

### System Health Checks
- **LayerZero V2 Fee Fluctuations**: Monitor cross-chain messaging costs
- **Chainlink VRF Subscription**: Ensure LINK balance for continued operation  
- **Gas Price Impacts**: Track Arbitrum gas costs for VRF execution
- **Cross-Chain Latency**: Monitor message delivery times

### Operational Status
- **Cross-Chain VRF**: ✅ Operational
- **Local VRF (Arbitrum)**: ✅ Operational  
- **Fee Quoting**: ✅ Operational
- **All Functions**: Fully tested and verified

## 🔐 Security & Verification

### Contract Verification
- **Sonic Integrator**: [Verified on SonicScan](https://sonicscan.org/address/0x694f00e7CAB26F9D05261c3d62F52a81DE18A777)
- **Arbitrum Integrator**: [Verified on Arbiscan](https://arbiscan.io/address/0x694f00e7CAB26F9D05261c3d62F52a81DE18A777)
- **Arbitrum Consumer**: [Verified on Arbiscan](https://arbiscan.io/address/0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5)

### Security Features
- **Owner Control**: `0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F`
- **CREATE2 Deployment**: Predictable addresses across chains
- **Mainnet Ready**: Production-grade deployment
- **LayerZero Security**: Battle-tested omnichain infrastructure
- **Chainlink Security**: Industry-standard VRF implementation

## 📈 Usage Examples

### Gaming Applications
```solidity
// Random loot generation
function generateLoot(uint256 playerId) external payable {
    uint256 fee = getVRFQuote();
    require(msg.value >= fee, "Insufficient fee");
    
    vrfIntegrator.requestRandomWordsSimple{value: fee}(30110);
    // Store player ID for callback
}

function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
    uint256 lootType = (randomWords[0] % 100) + 1; // 1-100
    // Award loot based on random number
}
```

### NFT Minting
```solidity
// Random trait generation
function mintRandomNFT() external payable {
    uint256 fee = getVRFQuote();
    require(msg.value >= fee, "Insufficient fee");
    
    vrfIntegrator.requestRandomWordsSimple{value: fee}(30110);
    // Queue mint for callback
}

function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
    uint256 traits = randomWords[0];
    // Generate NFT with random traits
    _mintNFT(msg.sender, traits);
}
```

## 🚀 Future Enhancements

### Planned Features
1. **Multi-Chain Expansion**: Add more integrator networks
2. **Batch Requests**: Support multiple random words in single request
3. **Custom Callbacks**: Allow custom fulfillment logic
4. **Gas Optimization**: Further reduce cross-chain costs

### Integration Opportunities
- **OmniDragon Lottery**: Enhanced randomness for lottery draws
- **Gaming Protocols**: Secure randomness for on-chain games
- **NFT Projects**: Random trait and metadata generation
- **DeFi Applications**: Random selection for yield farming rewards

---

## 🏆 System Status

**✅ FULLY OPERATIONAL**

The OmniDragon Cross-Chain VRF System is production-ready and provides secure, verifiable randomness across multiple blockchains. The integration of Chainlink VRF v2.5 with LayerZero V2 creates a robust, tamper-proof randomness solution for the entire OmniDragon ecosystem.

**Networks**: Sonic (Integrator) + Arbitrum (VRF Provider)  
**Status**: All systems operational and verified  
**Ready For**: Production gaming, NFT, and DeFi applications

*Last Updated: December 2024*  
*System Status: COMPLETE ✅*
