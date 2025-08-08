---
title: OmniDragon Deployments
sidebar_position: 10
---

This page contains deployment information for the OmniDragon OFT token and cross-chain VRF system.

## OmniDRAGON (OFT) – Token

DRAGON address (all chains): `0x6949936442425f4137807Ac5d269e6Ef66d50777`

### LayerZero V2 EIDs
- Sonic: 30272
- Arbitrum: 30110

### Core Dependencies (for fee distribution)

| Chain | DragonJackpotVault | veDRAGONRevenueDistributor |
|------|---------------------|----------------------------|
| Sonic | `0x09a5d89539fdd07f779a3ddc3a985d0a757b4d7b` | `0x4b0b4a25844744bbb23424533ca5a7f6dfaaba57` |
| Arbitrum | `0x21f2c71190330d8e6ececb411f05195874274dc9` | `0x8b89562e46502fc31addcace5b99367083c5c0c1` |

### Bridge DRAGON (Foundry cast, correct OFT ABI)

1) Quote fee (example Sonic → Arbitrum 69,420 DRAGON):

```bash
TOKEN=0x69821FFA2312253209FdabB3D84f034B697E7777
TO=0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F
TO_B32=0x000000000000000000000000ddd0050d1e084dfc72d5d06447cc10bcd3fef60f
DST=30110 # Arbitrum EID
AMOUNT=$(cast --to-wei 69420 ether)
QUOTE=$(cast call $TOKEN \
  "quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool)" \
  "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" false \
  --rpc-url $RPC_URL_SONIC)
# nativeFee is the first 32 bytes
NATIVE_FEE_HEX=0x$(echo $QUOTE | sed 's/^0x//' | cut -c1-64)
NATIVE_FEE=$(cast to-dec $NATIVE_FEE_HEX)
echo "nativeFee: $NATIVE_FEE"
```

2) Send with MessagingFee struct:

```bash
cast send $TOKEN \
  "send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address)" \
  "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" "($NATIVE_FEE,0)" $TO \
  --value $NATIVE_FEE \
  --rpc-url $RPC_URL_SONIC \
  --private-key $PRIVATE_KEY
```

Notes:
- Enforced LayerZero receive gas is removed; `extraOptions` can be empty (defaults apply).
- If slippage reverts, set `minAmountLD` slightly lower than `amountLD`.

## Quick Reference

### VRF Contract Addresses

| Contract | Network | Address |
|----------|---------|---------|
| ChainlinkVRFIntegratorV2_5 | Sonic | `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5` |
| ChainlinkVRFIntegratorV2_5 | Arbitrum | `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5` |
| ChainlinkVRFIntegratorV2_5 | Ethereum | `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5` |
| ChainlinkVRFIntegratorV2_5 | BSC | `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5` |
| ChainlinkVRFIntegratorV2_5 | Avalanche | `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5` |
| OmniDragonVRFConsumerV2_5 | Arbitrum | `0x697a9d438a5b61ea75aa823f98a85efb70fd23d5` |
| OmniDragonRegistry | All Chains | `0x6949936442425f4137807Ac5d269e6Ef66d50777` |

### System Status: ✅ FULLY OPERATIONAL

## Folder Structure

```
deployments/
├── arbitrum/                      # Arbitrum deployments
│   ├── OmniDragonVRFConsumerV2_5.json
│   ├── OmniDragonRegistry.json
│   └── .chainId
├── sonic/                         # Sonic deployments  
│   ├── ChainlinkVRFIntegratorV2_5.json
│   ├── OmniDragonRegistry.json
│   └── .chainId
├── VRF-DEPLOYMENT-SUMMARY.json    # Complete system overview
└── README.md                      # This file
```

## Quick Start

### Get Current Fees
```bash
npx hardhat run scripts/vrf-helper.ts --network sonic
```

### Test System Health
```bash
npx hardhat run scripts/test-vrf-system.ts --network sonic
```

### Make VRF Request
```bash
# Get quote first, then use the fee amount
cast send 0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5 \
  "requestRandomWordsSimple(uint32)" 30110 \
  --value 0.21ether \
  --rpc-url $RPC_URL_SONIC \
  --private-key $PRIVATE_KEY \
  --legacy
```

## Cross-Chain Flow

1. Sonic: Request submitted to VRF Integrator
2. LayerZero V2: Cross-chain message sent to Arbitrum  
3. Arbitrum: VRF Consumer requests from Chainlink VRF v2.5
4. Chainlink: Generates randomness and fulfills request
5. LayerZero V2: Response sent back to Sonic
6. Sonic: Callback executed with random numbers

## Fee Structure

- Standard Quote: ~0.195 ETH
- Custom Gas Quote: ~0.151 ETH (200k gas)
- Recommended: Add 10% safety margin

Fees vary based on:
- Gas prices on Arbitrum
- LayerZero network congestion  
- Message complexity

## Configuration

### Chainlink VRF v2.5
- Coordinator: `0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e`
- Subscription: Funded and active
- Key Hash: 30 gwei lane
- Network: Arbitrum

### LayerZero V2
- Sonic EID: 30272
- Arbitrum EID: 30110  
- Peers: Configured bidirectionally
- Enforced Options: 200k gas limit

## Verification

All contracts are verified on their respective block explorers:
- [Sonic VRF Integrator](https://sonicscan.org/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)
- [Arbitrum VRF Integrator](https://arbiscan.io/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)
- [Arbitrum VRF Consumer](https://arbiscan.io/address/0x697a9d438a5b61ea75aa823f98a85efb70fd23d5)
- [Ethereum VRF Integrator](https://etherscan.io/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)
- [BSC VRF Integrator](https://bscscan.com/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)
- [Avalanche VRF Integrator](https://snowscan.xyz/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)

## Integration

### Solidity Integration
```solidity
interface IChainlinkVRFIntegratorV2_5 {
    function quoteSimple() external view returns (MessagingFee memory);
    function requestRandomWordsSimple(uint32 dstEid) external payable returns (bytes32);
}

// Get quote and make request
uint256 fee = integrator.quoteSimple().nativeFee;
bytes32 requestId = integrator.requestRandomWordsSimple{value: fee}(30110);
```

### Frontend Integration
```typescript
// Same address on all chains
const VRF_INTEGRATOR = "0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5";

const quote = await vrfIntegrator.quoteSimple();
const fee = quote[0]; // Native fee in wei
const tx = await vrfIntegrator.requestRandomWordsSimple(30110, { value: fee });
```

---

System deployed and maintained by the OmniDragon team.


