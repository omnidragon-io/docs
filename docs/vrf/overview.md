---
title: OmniDragon VRF — Overview
sidebar_position: 10
---

# OmniDragon Cross-Chain VRF System

> **Multi-chain verifiable random function powered by Chainlink VRF v2.5 and LayerZero V2**


## Overview

The OmniDragon VRF System provides **verifiable random number generation** across multiple blockchains using Chainlink VRF v2.5 and LayerZero V2 for cross-chain communication. The system supports both cross-chain and local randomness requests.

### Key Features
- **Cross-Chain VRF**: Request randomness from any supported chain, fulfilled via Arbitrum
- **Local VRF**: Direct randomness requests on Arbitrum for local dApps
- **Chainlink VRF v2.5**: Latest version with enhanced security and efficiency
- **LayerZero V2**: Seamless cross-chain messaging and fee management
- **Multi-Chain Support**: Sonic, Arbitrum, Ethereum, Base, Avalanche, and more
- **Vanity Addresses**: Consistent deployment pattern across all chains

**Deployment Status**: ✅ **FULLY OPERATIONAL** (Deployed December 19, 2024)

<details>
<summary><h2>System Architecture</h2></summary>

```
┌─────────────────┐    LayerZero V2     ┌─────────────────┐
│     SONIC       │────────────────────►│    ARBITRUM     │
│                 │                     │                 │
│ VRFIntegrator   │  VRF Request        │ VRFConsumer     │
│ 0x2BD6...23d5   │                     │ 0x697a...23d5   │
│                 │                     │                 │
│ - Quote fees    │                     │ ┌─────────────┐ │
│ - Send requests │                     │ │ Chainlink   │ │
│ - Receive       │ Random Response     │ │ VRF v2.5    │ │
│   responses     │◄────────────────────│ │             │ │
└─────────────────┘                     │ │ Coordinator │ │
                                        │ │ Subscription│ │
┌─────────────────┐    Direct Request   │ └─────────────┘ │
│ ARBITRUM LOCAL  │────────────────────►│                 │
│                 │                     │ - Cross-chain   │
│ - Local dApps   │  Local Callback     │   handling      │
│ - Direct VRF    │◄────────────────────│ - Local VRF     │
│ - Callbacks     │                     │ - Response      │
└─────────────────┘                     │   routing       │
                                        └─────────────────┘
```

</details>

<details>
<summary><h2>Deployment Details</h2></summary>

### Sonic Network (Primary Integrator)
- **ChainlinkVRFIntegratorV2_5**: `0x694f00e7CAB26F9D05261c3d62F52a81DE18A777`
- **Chain ID**: 146
- **LayerZero EID**: 30332
- **Explorer**: [View on Sonicscan](https://sonicscan.org/address/0x694f00e7CAB26F9D05261c3d62F52a81DE18A777)
- **Status**: ✅ Verified and Operational

### Arbitrum Network (VRF Hub)
- **OmniDragonVRFConsumerV2_5**: `0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5`
- **ChainlinkVRFIntegratorV2_5**: `0x694f00e7CAB26F9D05261c3d62F52a81DE18A777`
- **Chain ID**: 42161
- **LayerZero EID**: 30110
- **Explorer**: [View on Arbiscan](https://arbiscan.io/address/0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5)
- **Status**: ✅ Verified and Operational

### Registry Addresses
- **OmniDragonRegistry**: `0x6949936442425f4137807Ac5d269e6Ef66d50777`
- **Pattern**: Consistent vanity addresses following `0x69...` pattern

</details>

<details>
<summary><h2>Chainlink VRF Configuration</h2></summary>

### VRF v2.5 Settings
```typescript
{
  version: "v2.5",
  coordinator: "0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e",
  subscriptionId: "49130512167777098004519592693541429977179420141459329604059253338290818062746",
  keyHash: "0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409",
  gasLane: "30 gwei",
  network: "arbitrum",
  funded: true,
  authorizedConsumers: ["0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5"]
}
```

### Request Configuration
- **Request Confirmations**: 3 blocks
- **Callback Gas Limit**: 2,500,000 gas
- **Number of Words**: 1 (configurable)
- **Native Payment**: Supported

</details>

<details>
<summary><h2>Supported Operations</h2></summary>

### 1. Cross-Chain VRF Request Flow
```
Sonic dApp → VRFIntegrator → LayerZero V2 → Arbitrum VRFConsumer → Chainlink VRF → Response → LayerZero V2 → Sonic dApp
```

### 2. Local VRF Request Flow (Arbitrum only)
```
Arbitrum dApp → VRFConsumer → Chainlink VRF → Direct Callback
```

</details>

<details>
<summary><h2>Core Functions</h2></summary>

### Cross-Chain VRF (Sonic → Arbitrum)
```solidity
// Quote cross-chain VRF fee
function quoteFee() public view returns (MessagingFee memory fee)

// Request random words with caller-provided ETH
function requestRandomWordsPayable(uint32 dstEid) 
    external payable returns (MessagingReceipt memory receipt, uint64 requestId)

// Check request status
function checkRequestStatus(uint64 requestId) 
    external view returns (bool fulfilled, bool exists, address provider, uint256 randomWord, uint256 timestamp, bool expired)

// Get fulfilled random word
function getRandomWord(uint64 requestId) 
    external view returns (uint256 randomWord, bool fulfilled)
```

### Local VRF (Arbitrum direct)
```solidity
// Request random words locally on Arbitrum
function requestRandomWordsLocal() external returns (uint256 requestId)

// Get local request details
function getLocalRequest(uint256 requestId) 
    external view returns (address requester, bool fulfilled, bool callbackSent, uint256 randomWord, uint256 timestamp)

// Get all local requests for a user
function getUserLocalRequests(address user) external view returns (uint256[] memory requestIds)
```

### Network Management
```solidity
// Add support for new chains
function addNewChain(uint32 chainEid, string calldata chainName, uint32 gasLimit) external onlyOwner

// Get all supported chains with details
function getAllChainsWithNames() 
    external view returns (uint32[] memory eids, string[] memory names, bool[] memory supported, uint32[] memory gasLimits)

// Quote LayerZero fee for responses
function quoteSendToChain(uint32 targetChainEid) external view returns (MessagingFee memory fee)
```

</details>

<details>
<summary><h2>Supported Networks</h2></summary>

| Network | Chain ID | LayerZero EID | Status | Gas Limit |
|---------|----------|---------------|--------|-----------|
| **Sonic** | 146 | 30332 | ✅ Active | 2,500,000 |
| **Arbitrum** | 42161 | 30110 | ✅ Active | 2,500,000 |
| **Ethereum** | 1 | 30101 | ✅ Active | 2,500,000 |
| **Base** | 8453 | 30184 | ✅ Active | 2,500,000 |
| **Avalanche** | 43114 | 30106 | ✅ Ready | 2,500,000 |
| **Polygon** | 137 | 30109 | 🔄 Configurable | - |
| **BSC** | 56 | 30102 | 🔄 Configurable | - |
| **Optimism** | 10 | 30111 | 🔄 Configurable | - |

</details>

<details>
<summary><h2>LayerZero V2 Configuration</h2></summary>

### Cross-Chain Pathways
```typescript
{
  sonic_to_arbitrum: {
    sourceEid: 30332,
    destinationEid: 30110,
    configured: true,
    enforced_options: {
      gas: 200000,
      value: 0
    }
  },
  arbitrum_to_sonic: {
    sourceEid: 30110,
    destinationEid: 30332,
    configured: true,
    enforced_options: {
      gas: 200000,
      value: 0
    }
  }
}
```

### Fee Structure
- **Standard Quote**: ~0.195 ETH
- **Custom Gas Quote**: ~0.151 ETH (200k gas)
- **Recommended Safety Margin**: 10%
- **Note**: Fees vary based on gas prices and network congestion

</details>

<details>
<summary><h2>Integration Examples</h2></summary>

### Web3.js Example (Cross-Chain from Sonic)
```javascript
const Web3 = require('web3');
const web3 = new Web3('https://rpc.soniclabs.com/');

const VRF_INTEGRATOR_ADDRESS = '0x694f00e7CAB26F9D05261c3d62F52a81DE18A777';
const ARBITRUM_EID = 30110;

const VRF_ABI = [
  {
    "inputs": [],
    "name": "quoteFee",
    "outputs": [
      {
        "components": [
          {"name": "nativeFee", "type": "uint256"},
          {"name": "lzTokenFee", "type": "uint256"}
        ],
        "name": "fee",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "dstEid", "type": "uint32"}],
    "name": "requestRandomWordsPayable",
    "outputs": [
      {"name": "receipt", "type": "tuple"},
      {"name": "requestId", "type": "uint64"}
    ],
    "stateMutability": "payable",
    "type": "function"
  }
];

async function requestRandomness() {
  const vrfContract = new web3.eth.Contract(VRF_ABI, VRF_INTEGRATOR_ADDRESS);
  
  // Get fee quote
  const fee = await vrfContract.methods.quoteFee().call();
  console.log(`VRF Fee: ${web3.utils.fromWei(fee.nativeFee, 'ether')} ETH`);
  
  // Request randomness
  const accounts = await web3.eth.getAccounts();
  const result = await vrfContract.methods
    .requestRandomWordsPayable(ARBITRUM_EID)
    .send({
      from: accounts[0],
      value: fee.nativeFee,
      gas: 500000
    });
    
  console.log(`Random words requested! Request ID: ${result.events.RandomWordsRequested.returnValues.requestId}`);
  
  return result.events.RandomWordsRequested.returnValues.requestId;
}

async function checkRandomness(requestId) {
  const vrfContract = new web3.eth.Contract(VRF_ABI, VRF_INTEGRATOR_ADDRESS);
  
  const [randomWord, fulfilled] = await vrfContract.methods
    .getRandomWord(requestId)
    .call();
    
  if (fulfilled) {
    console.log(`Random word: ${randomWord}`);
    return randomWord;
  } else {
    console.log('Request not yet fulfilled');
    return null;
  }
}
```

### Ethers.js Example (Local VRF on Arbitrum)
```javascript
const { ethers } = require('ethers');

const VRF_CONSUMER_ADDRESS = '0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5';

const VRF_CONSUMER_ABI = [
  {
    "inputs": [],
    "name": "requestRandomWordsLocal",
    "outputs": [{"name": "requestId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "requestId", "type": "uint256"}],
    "name": "getLocalRequest",
    "outputs": [
      {"name": "requester", "type": "address"},
      {"name": "fulfilled", "type": "bool"},
      {"name": "callbackSent", "type": "bool"},
      {"name": "randomWord", "type": "uint256"},
      {"name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

class OmniDragonVRF {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.consumer = new ethers.Contract(VRF_CONSUMER_ADDRESS, VRF_CONSUMER_ABI, signer);
  }
  
  async requestLocalRandomness() {
    try {
      const tx = await this.consumer.requestRandomWordsLocal();
      const receipt = await tx.wait();
      
      const event = receipt.events.find(e => e.event === 'LocalRandomWordsRequested');
      const requestId = event.args.requestId;
      
      console.log(`Local VRF requested! Request ID: ${requestId}`);
      return requestId.toString();
    } catch (error) {
      console.error('Error requesting local randomness:', error);
      throw error;
    }
  }
  
  async getLocalRandomness(requestId) {
    const [requester, fulfilled, callbackSent, randomWord, timestamp] = 
      await this.consumer.getLocalRequest(requestId);
      
    return {
      requester,
      fulfilled,
      callbackSent,
      randomWord: randomWord.toString(),
      timestamp: new Date(timestamp.toNumber() * 1000)
    };
  }
  
  async getAllUserRequests(userAddress) {
    const requestIds = await this.consumer.getUserLocalRequests(userAddress);
    return requestIds.map(id => id.toString());
  }
}
```

### Solidity Integration Example
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../interfaces/vrf/IRandomWordsCallbackV2_5.sol";

interface IChainlinkVRFIntegratorV2_5 {
    function quoteFee() external view returns (MessagingFee memory fee);
    function requestRandomWordsPayable(uint32 dstEid) 
        external payable returns (MessagingReceipt memory receipt, uint64 requestId);
    function getRandomWord(uint64 requestId) 
        external view returns (uint256 randomWord, bool fulfilled);
}

interface IOmniDragonVRFConsumer {
    function requestRandomWordsLocal() external returns (uint256 requestId);
    function getLocalRequest(uint256 requestId) 
        external view returns (address requester, bool fulfilled, bool callbackSent, uint256 randomWord, uint256 timestamp);
}

contract GameContract is IRandomWordsCallbackV2_5 {
    IChainlinkVRFIntegratorV2_5 constant sonicVRF = IChainlinkVRFIntegratorV2_5(0x694f00e7CAB26F9D05261c3d62F52a81DE18A777);
    IOmniDragonVRFConsumer constant arbitrumVRF = IOmniDragonVRFConsumer(0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5);
    
    uint32 constant ARBITRUM_EID = 30110;
    
    mapping(uint256 => address) public requestToPlayer;
    mapping(address => uint256) public playerRandomness;
    
    event RandomnessRequested(address indexed player, uint256 indexed requestId);
    event RandomnessReceived(address indexed player, uint256 randomness);
    
    // Cross-chain VRF from Sonic
    function requestRandomnessFromSonic() external payable {
        MessagingFee memory fee = sonicVRF.quoteFee();
        require(msg.value >= fee.nativeFee, "Insufficient fee");
        
        (, uint64 requestId) = sonicVRF.requestRandomWordsPayable{value: msg.value}(ARBITRUM_EID);
        requestToPlayer[uint256(requestId)] = msg.sender;
        
        emit RandomnessRequested(msg.sender, uint256(requestId));
    }
    
    // Local VRF on Arbitrum
    function requestRandomnessLocal() external {
        uint256 requestId = arbitrumVRF.requestRandomWordsLocal();
        requestToPlayer[requestId] = msg.sender;
        
        emit RandomnessRequested(msg.sender, requestId);
    }
    
    // VRF callback implementation
    function receiveRandomWords(uint256[] calldata randomWords, uint256 requestId) external override {
        require(msg.sender == address(sonicVRF) || msg.sender == address(arbitrumVRF), "Unauthorized");
        
        address player = requestToPlayer[requestId];
        require(player != address(0), "Invalid request");
        
        playerRandomness[player] = randomWords[0];
        delete requestToPlayer[requestId];
        
        emit RandomnessReceived(player, randomWords[0]);
    }
    
    // Manual check for cross-chain requests
    function checkRandomness(uint64 requestId) external {
        (uint256 randomWord, bool fulfilled) = sonicVRF.getRandomWord(requestId);
        
        if (fulfilled) {
            address player = requestToPlayer[uint256(requestId)];
            if (player != address(0)) {
                playerRandomness[player] = randomWord;
                delete requestToPlayer[uint256(requestId)];
                
                emit RandomnessReceived(player, randomWord);
            }
        }
    }
}
```

</details>

<details>
<summary><h2>Testing & Maintenance</h2></summary>

### Quick Test Commands
```bash
# Get VRF fee quote (Sonic)
cast call 0x694f00e7CAB26F9D05261c3d62F52a81DE18A777 "quoteFee()" --rpc-url https://rpc.soniclabs.com/

# Request randomness with 0.2 ETH (Sonic → Arbitrum)
cast send 0x694f00e7CAB26F9D05261c3d62F52a81DE18A777 \
  "requestRandomWordsPayable(uint32)" 30110 \
  --value 0.2ether \
  --rpc-url https://rpc.soniclabs.com/ \
  --private-key $PRIVATE_KEY

# Check request status
cast call 0x694f00e7CAB26F9D05261c3d62F52a81DE18A777 \
  "getRandomWord(uint64)" $REQUEST_ID \
  --rpc-url https://rpc.soniclabs.com/

# Test local VRF (Arbitrum)
cast send 0x697a9d438A5B61ea75Aa823f98A85EFB70FD23d5 \
  "requestRandomWordsLocal()" \
  --rpc-url https://arbitrum-one.publicnode.com \
  --private-key $PRIVATE_KEY
```

### Monitoring Checklist
- ✅ LayerZero V2 fee fluctuations
- ✅ Chainlink VRF subscription balance
- ✅ Gas price impacts on cross-chain costs
- ✅ Contract ETH balances for LayerZero fees
- ✅ Request fulfillment times and success rates

</details>

<details>
<summary><h2>Security Features</h2></summary>

- **Verified Contracts**: All contracts verified on respective explorers
- **Ownership**: Controlled by `0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F`
- **Mainnet Ready**: Production deployment with proper configurations
- **Timeout Protection**: Expired requests cleanup mechanism
- **Access Control**: Authorization system for local VRF requests
- **Fee Safety**: Proper ETH balance management for LayerZero fees

</details>

<details>
<summary><h2>Performance Metrics</h2></summary>

### Success Rates
- **Cross-Chain Requests**: >95% success rate
- **Local Requests**: >99% success rate
- **Average Fulfillment Time**: 2-5 minutes (cross-chain), 30-60 seconds (local)

### Gas Costs
- **Cross-Chain Request**: ~500,000 gas + LayerZero fees
- **Local Request**: ~200,000 gas
- **Callback Processing**: ~100,000 gas

</details>

---

**Built for secure, verifiable randomness across the OmniDragon ecosystem**
