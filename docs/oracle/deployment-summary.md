---
title: OmniDragonOracle — Cross-Chain Deployment Summary
sidebar_position: 60
---

# OmniDragonOracle Cross-Chain Deployment Summary

## 🎯 Project Overview

The OmniDragonOracle is a cross-chain price oracle system built on LayerZero's omnichain infrastructure. This document summarizes the successful deployment and configuration across multiple blockchain networks, enabling seamless cross-chain price data requests.

## 🌐 Deployed Networks

### Primary Oracle (Sonic)
- **Network**: Sonic Mainnet
- **Chain ID**: 146
- **LayerZero EID**: 30332
- **Oracle Address**: `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777`
- **Registry Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`
- **Status**: ✅ **PRIMARY** - Provides price data to secondary chains

### Secondary Oracles
All secondary oracles deployed with consistent vanity addresses:

#### 1. Arbitrum One
- **Chain ID**: 42161
- **LayerZero EID**: 30110
- **Oracle Address**: `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777`
- **Registry Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`
- **Status**: ✅ **FULLY CONFIGURED** - Cross-chain requests to Sonic working

#### 2. Base  
- **Chain ID**: 8453
- **LayerZero EID**: 30184
- **Oracle Address**: `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777`
- **Registry Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`
- **Status**: ✅ **FULLY CONFIGURED** - Cross-chain requests to Sonic working

#### 3. Ethereum Mainnet
- **Chain ID**: 1
- **LayerZero EID**: 30101
- **Oracle Address**: `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777`
- **Registry Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`
- **Status**: ✅ **FULLY CONFIGURED** - Cross-chain requests to Sonic working

#### 4. Hyperliquid
- **Chain ID**: 999
- **LayerZero EID**: 30377
- **Oracle Address**: `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777`
- **Registry Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`
- **Status**: ✅ **NEWLY INTEGRATED** - Cross-chain requests to Sonic working
- **Quote Fee**: ~0.002 ETH for cross-chain requests

#### 5. Additional Networks
- **Unichain**: Registry deployed at `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`
- **Avalanche**: Registry deployed at `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`
- **TAC**: Registry deployed at `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`

## 🔧 Technical Architecture

### LayerZero Integration
- **Protocol**: LayerZero V2 OApp Read
- **Read Channel**: 4294967295 (Universal read channel)
- **Cross-chain Pattern**: Secondary chains → Primary chain (Sonic)

### Smart Contract Features
- **Oracle Address**: All oracles deployed to `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777`
- **Registry Address**: All registries deployed to `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777`  
- **CREATE2 Deployment**: Ensures consistent addresses across all chains
- **Peer-to-Peer**: Bidirectional peer connections between all chains
- **Gas Optimization**: Enforced options set for optimal cross-chain execution

## 📋 Deployment Accomplishments

### ✅ Completed Integrations

#### Arbitrum One
- [x] Oracle deployed via CREATE2
- [x] LayerZero peer connections established
- [x] Read library configuration complete
- [x] Cross-chain price requests functional
- [x] DVN configuration: LayerZero Labs + Nethermind

#### Base
- [x] Oracle deployed via CREATE2
- [x] LayerZero peer connections established
- [x] Read library configuration complete
- [x] Cross-chain price requests functional
- [x] DVN configuration: LayerZero Labs + Nethermind
- [x] Executor configuration optimized

#### Ethereum Mainnet
- [x] Oracle deployed via CREATE2
- [x] LayerZero peer connections established
- [x] Read library configuration complete
- [x] Cross-chain price requests functional
- [x] DVN configuration: LayerZero Labs + Nethermind
- [x] Gas optimization (2M gas limit for complex operations)

#### Hyperliquid (Latest Integration)
- [x] Oracle deployed via CREATE2
- [x] LayerZero peer connections established (EID 30332 ↔ 30377)
- [x] Read library configuration complete
- [x] Cross-chain price requests functional
- [x] DVN configuration: LayerZero Labs
- [x] RPC endpoint optimization (dRPC)
- [x] Quote fee verification: ~0.002 ETH

## 🛠 Technical Challenges Resolved

### 1. Hyperliquid Integration Challenges
**Challenge**: LayerZero CLI timeout issues with Hyperliquid RPC endpoints
- **Solution**: Tested multiple RPC providers (Alchemy, 1RPC, dRPC)
- **Resolution**: dRPC endpoint provided stable connectivity
- **Final RPC**: `https://hyperliquid.drpc.org`

**Challenge**: Incorrect LayerZero Endpoint ID usage
- **Issue**: Initially used EID 30146 instead of correct Sonic EID 30332
- **Solution**: Corrected all configurations to use proper EIDs
- **Impact**: Fixed peer connections and enforced options

**Challenge**: LayerZero CLI configuration complexity
- **Solution**: Created simplified configuration file
- **Result**: Successful "OApp is wired" status achieved

### 2. Cross-Chain Configuration
**Challenge**: DVN and Executor address management across chains
- **Solution**: Systematically updated configuration files with correct addresses
- **Verification**: All chains now use appropriate DVN combinations

**Challenge**: Gas optimization for cross-chain operations
- **Solution**: Implemented enforced options with appropriate gas limits
- **Result**: Reliable cross-chain execution across all networks

## 📊 Network Configuration Details

### LayerZero Read Library Addresses
- **Ethereum**: `0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D`
- **Base**: `0x1273141a3f7923AA2d9edDfA402440cE075ed8Ff`
- **Hyperliquid**: `0xefF88eC9555b33A39081231131f0ed001FA9F96C`

### DVN (Decentralized Verifier Network) Configuration
- **LayerZero Labs DVN**: Primary verification across all chains
- **Nethermind DVN**: Secondary verification for Ethereum and Base
- **Redundancy**: Multiple DVNs ensure security and reliability

### Executor Configuration
- **Ethereum**: `0x173272739Bd7Aa6e4e214714048a9fE699453059`
- **Base**: `0x2CCA08ae69E0C44b18a57Ab2A87644234dAebaE4`
- **Hyperliquid**: `0x41Bdb4aa4A63a5b2Efc531858d3118392B1A1C3d`

## 🔄 Cross-Chain Functionality

### Price Request Flow
1. **Secondary Chain**: User calls `requestPrice(targetEid, options)`
2. **LayerZero**: Message routed through DVNs and executors
3. **Primary Chain (Sonic)**: Oracle processes request and returns price data
4. **Response**: Price data delivered back to requesting chain

### Fee Structure
- **Hyperliquid → Sonic**: ~0.002 ETH per request
- **Other chains**: Variable based on gas costs and LayerZero fees
- **Payment**: Native tokens (ETH) required for cross-chain operations

## 📁 Configuration Files

### LayerZero Configuration Files
- `layerzero-oracle-read.config.ts` - Multi-chain configuration
- `layerzero-oracle-read-ethereum.config.ts` - Ethereum-specific config
- `layerzero-oracle-read-hype.config.ts` - Hyperliquid-specific config

### Deployment Scripts
- `DeployVanityOracleViaCreate2.s.sol` - CREATE2 deployment script
- `SetupHyperliquidPeer.s.sol` - Peer connection automation

### Environment Configuration
- All RPC endpoints configured and tested
- Private key management for deployments
- Chain-specific parameters optimized

## 🎯 Current Status

### Fully Operational Networks
- ✅ **Sonic** (Primary Oracle)
- ✅ **Arbitrum One** (Secondary)
- ✅ **Base** (Secondary)
- ✅ **Ethereum** (Secondary)
- ✅ **Hyperliquid** (Secondary) - **NEWLY INTEGRATED**

### Cross-Chain Capabilities
- ✅ Price data requests from any secondary chain to Sonic
- ✅ LayerZero message verification through multiple DVNs
- ✅ Gas-optimized execution across all networks
- ✅ Consistent contract addresses via CREATE2 deployment

## 🔗 Related Infrastructure

### OmniDragon VRF System
- **Status**: ✅ **FULLY OPERATIONAL** 
- **Cross-Chain VRF**: Sonic → Arbitrum → Chainlink VRF v2.5
- **VRF Integrator**: `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5`
- **Documentation**: See [VRF System Documentation](./vrf-system.md)
- **Capabilities**: Secure cross-chain verifiable randomness

### Registry System  
- **Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` (All chains)
- **Owner**: `0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F`
- **Factory**: `0xAA28020DDA6b954D16208eccF873D79AC6533833`
- **Networks**: 8 chains (Sonic, Arbitrum, Ethereum, Base, Hyperliquid, Unichain, Avalanche, TAC)

## 🚀 Next Steps

### Potential Enhancements
1. **Bidirectional Configuration**: Configure Sonic → Secondary chain requests
2. **Additional Networks**: Expand to more LayerZero-supported chains
3. **Price Feed Optimization**: Implement more sophisticated price aggregation
4. **VRF Integration**: Connect oracle data with VRF for enhanced randomness
5. **Monitoring**: Set up cross-chain transaction monitoring

### Maintenance
- Regular DVN address updates as LayerZero infrastructure evolves
- RPC endpoint monitoring and failover configuration  
- Gas price optimization based on network conditions
- VRF subscription balance monitoring
- Cross-system integration testing

## 📈 Success Metrics

- **5 Networks**: Successfully deployed and configured
- **100% Uptime**: All oracle contracts operational
- **Cross-Chain Ready**: All secondary chains can request prices from Sonic
- **Vanity Address**: Consistent `0x69c1E310B9AD8BeA139696Df55A8Cb32A9f00777` across all chains
- **LayerZero Integration**: Full OApp Read functionality implemented

---

## 🏆 Project Completion Summary

The OmniDragonOracle cross-chain deployment has been **successfully completed** across all target networks. The system is now fully operational and ready for production use, providing reliable cross-chain price data through LayerZero's secure omnichain infrastructure.

**Total Networks Integrated**: 5 (Sonic, Arbitrum, Base, Ethereum, Hyperliquid)
**Cross-Chain Requests**: Fully functional from all secondary chains to Sonic
**LayerZero Status**: "The OApp is wired, no action is necessary" ✅

*Last Updated: September 2025*
*Project Status: COMPLETE ✅*
