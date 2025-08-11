---
title: OmniDragon Deployments
sidebar_position: 10
---

This page contains deployment information for the OmniDragon OFT token and cross-chain VRF system.

## OmniDRAGON (OFT) – Token

DRAGON (Sonic): `0x69dc1c36f8b26db3471acf0a6469d815e9a27777`

### LayerZero V2 EIDs
- Ethereum: 30101
- Arbitrum: 30110
- Avalanche: 30106
- Base: 30184
- Sonic: 30332

### Core Dependencies (for fee distribution)

| Chain | DragonJackpotVault | veDRAGONRevenueDistributor |
|------|---------------------|----------------------------|
| Sonic | `0x69ec31a869c537749af7fd44dd1fd347d62c7777` | `0x6960cd77b3628b77d06871f114cde980434fa777` |
| Arbitrum | `0x21f2c71190330d8e6ececb411f05195874274dc9` | `0x8b89562e46502fc31addcace5b99367083c5c0c1` |

### Bridge DRAGON (Foundry cast, correct OFT ABI)

1) Quote fee (example Sonic → Arbitrum 69,420 DRAGON):

```bash
TOKEN=0x69dc1c36f8b26db3471acf0a6469d815e9a27777
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

---

## OmniDRAGON Core Deployment — Sonic (ChainId 146)

### Overview
- Deployed veDRAGON and OmniDragonLotteryManager at vanity addresses (0x69…777)
- Confirmed/used existing redDRAGON (ERC‑4626 LP vault) and JackpotVault
- Refactored LotteryManager to remove JackpotDistributor; now uses JackpotVault directly
- Wired VRF, set token dependencies, and authorized swap callers

### Network and constants
- Chain: Sonic (chainId 146)
- Factory (CREATE2): `0xAA28020DDA6b954D16208eccF873D79AC6533833`
- Registry: `0x6949936442425f4137807Ac5d269e6Ef66d50777`

### Deployed contracts and addresses
- veDRAGON (vanity): `0x69f9d14a337823fad783d21f3669e29088e45777`
  - Salt: `0x000000000000000000000000000000000000000000000000000000017488bef4`
  - Init: `initialize(REDDRAGON_SONIC, TokenType.LP_TOKEN)`
- redDRAGON vault (Sonic): `0x69320eb5b9161a34cb9cdd163419f826691a1777`
- OmniDragonLotteryManager (vanity): `0x69a6a2813c2224bbc34b3d0bf56c719de3c34777`
  - Salt: `0x00000000000000000000000000000000000000000000000000000005d21f0ff9`
  - Constructor (updated): `(jackpotVault, veDRAGON, priceOracle, chainId)`
- DragonJackpotVault: `0x69ec31a869c537749af7fd44dd1fd347d62c7777`
- OmniDragonPrimaryOracle: see `deployments/sonic/OmniDragonPrimaryOracle.json`
- DRAGON (omniDRAGON): `0x69dc1c36f8b26db3471acf0a6469d815e9a27777`

### redDRAGON (ERC‑4626) vault details
- Vault: `0x69320eb5b9161a34cb9cdd163419f826691a1777` (name: “redDRAGON”, symbol: “rDRAGON”, 18 decimals)
- Asset (LP token): `0xdD796689a646413d04ebCBCa3786900E57a49B6a`
- token0: `0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38` (“wS”)
- token1: `0x69dc1c36f8b26db3471acf0a6469d815e9a27777` (“DRAGON”)

### LotteryManager refactor (important)
- Removed jackpotDistributor. Now:
  - Constructor: `(address jackpotVault, address veDRAGON, address priceOracle, uint256 chainId)`
  - Reward source: `jackpotVault.getJackpotBalance()`
  - Payout: `jackpotVault.payJackpot(winner, amount)`
  - Event: `LotteryManagerInitialized(address jackpotVault, address veDRAGONToken)`

### Updated scripts
- `script/DeployLotteryManager.s.sol` now reads `JACKPOT_VAULT` env and passes vault to constructor
- Added `script/GetLotteryManagerBytecodeHash.s.sol` to compute vanity bytecode hash
- Added `script/DeployVanityLotteryManager.s.sol` to deploy via factory with `SALT_LOTTERY`

### Post-deploy configuration (on-chain)
- `setRedDRAGONToken(0x69320eb5b9161a34cb9cdd163419f826691a1777)`
- `setVRFIntegrator(0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)`
- `setDragonToken(0x69dc1c36f8b26db3471acf0a6469d815e9a27777)`
- Authorized swap callers:
  - `setAuthorizedSwapContract(DRAGON, true)`
  - `setAuthorizedSwapContract(redDRAGON, true)`
- Deauthorized LP pair: `setAuthorizedSwapContract(0xdD7966…B6a, false)`

### Environment updates (.env)
- `VEDRAGON=0x69f9d14a337823fad783d21f3669e29088e45777`
- `LOTTERY_MANAGER_ADDRESS=0x69a6a2813c2224bbc34b3d0bf56c719de3c34777`
- `JACKPOT_VAULT_ADDRESS=0x69ec31a869c537749af7fd44dd1fd347d62c7777`
- `VANITY_SALT=0x00000000000000000000000000000000000000000000000000000005d21f0ff9`
- `CREATE2_FACTORY_ADDRESS=0xAA28020DDA6b954D16208eccF873D79AC6533833`
- `REGISTRY_ADDRESS=0x6949936442425f4137807Ac5d269e6Ef66d50777`
- `OMNIDRAGON_ADDRESS=0x69dc1c36f8b26db3471acf0a6469d815e9a27777`
- `RPC_URL_SONIC=…` (already set)

### Deployment records
- `deployments/sonic/OmniDragonLotteryManager.json` contains: address, chainId, constructorArgs (vault, veDRAGON, priceOracle), salt

### Front-end integration checklist
- Use these addresses: veDRAGON, redDRAGON, omniDRAGON (DRAGON), OmniDragonLotteryManager, DragonJackpotVault
- Read-only calls for UI:
  - `OmniDragonLotteryManager.getCurrentJackpot()`
  - `OmniDragonLotteryManager.getInstantLotteryConfig()`
  - `OmniDragonLotteryManager.calculateWinProbability(user, usdAmount)`
  - `OmniDragonLotteryManager.getUserStats(user)`
- Token symbols/decimals: DRAGON (18), redDRAGON (18)
- Display jackpot and win probability on swap flows (DRAGON/redDRAGON routes initiate lottery)
- The LP pair is NOT a caller; only DRAGON/redDRAGON (and any integrator router if configured) will call the manager

### Notes
- Vanity addresses depend on constructor args. Keep `JACKPOT_VAULT`, `VEDRAGON`, `PRICE_ORACLE` unchanged to preserve the derived vanity addresses across chains
- Sonic RPC does not support EIP‑3855; contracts compiled with 0.8.20 work but tools warn—no action required
- Deployed vanity contracts, refactored LotteryManager to use vault-only payouts, configured VRF/tokens/authorizations, and recorded everything in `.env` and `deployments/`

### OmniDRAGON Sonic deployment and configuration — end-to-end record

#### Network and core constants
- Chain: Sonic (chainId 146)
- CREATE2 Factory: `0xAA28020DDA6b954D16208eccF873D79AC6533833`
- Registry: `0x6949936442425f4137807Ac5d269e6Ef66d50777`

#### Vanity deployments
- veDRAGON
  - Address: `0x69f9d14a337823fad783d21f3669e29088e45777`
  - Salt: `0x000000000000000000000000000000000000000000000000000000017488bef4`
  - Script updated: `script/DeployVanityCore.s.sol` (SALT_VEDRAGON)
  - Initialized on Sonic with redDRAGON (TokenType.LP_TOKEN)
- OmniDragonLotteryManager
  - Address: `0x69a6a2813c2224bbc34b3d0bf56c719de3c34777`
  - Salt: `0x00000000000000000000000000000000000000000000000000000005d21f0ff9`
  - Bytecode hash (vanity search): `0x17b17fc7a355d397d4499ca969d6a42f2a42f5043236ce4942d8c5579d909d0b`
  - Deployment script: `script/DeployVanityLotteryManager.s.sol`
  - Vanity salt derived via Rust generator and deployed

- DRAGON (omniDRAGON): `0x69dc1c36f8b26db3471acf0a6469d815e9a27777`
- redDRAGON (ERC‑4626 LP vault): `0x69320eb5b9161a34cb9cdd163419f826691a1777`
- Asset (LP): `0xdD796689a646413d04ebCBCa3786900E57a49B6a`
- token0: `0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38` (“wS”)
- token1: `0x69dc1c36f8b26db3471acf0a6469d815e9a27777` (“DRAGON”)
- DragonJackpotVault: `0x69ec31a869c537749af7fd44dd1fd347d62c7777`

#### LotteryManager refactor and configuration
- Code changes in `contracts/core/lottery/OmniDragonLotteryManager.sol`:
  - Removed JackpotDistributor dependency entirely
  - Constructor is now `(jackpotVault, veDRAGON, priceOracle, chainId)`
  - Rewards sourced from vault; payouts via `jackpotVault.payJackpot`
  - Events and getters updated accordingly
- Post-deploy (Manager: `0x6990…9777`):
  - `setRedDRAGONToken(0x1576…0BD1)`
  - `setVRFIntegrator(0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)`
  - `setDragonToken(0x6982…7777)`
  - Authorized callers: DRAGON (authorized), redDRAGON (authorized)
  - LP pair `0xdD7966…B6a`: NOT authorized (explicitly deauthorized)

#### Price oracle setup (OmniDragonPrimaryOracle)
- Oracle address: see `deployments/sonic/OmniDragonPrimaryOracle.json`
- Feeds configured:
  - Chainlink (S/USD): `0xc76dFb89fF298145b417d221B2c747d84952e01d`
  - Band (DRAGON/USD): `0x506085050Ea5494Fe4b89Dd5BEa659F506F470Cc` (may return not-available; aggregator excludes invalid)
  - API3 (DRAGON/USD): `0x726D2E87d73567ecA1b75C063Bd09c1493655918`
  - Pyth (DRAGON/USD): `0x2880ab155794e7179c9ee2e38200202908c17b43` with priceId `0xf490b178d0c85683b7a0f2388b40af2e6f7c90cbe0f96b31f315f08d0e5a2d6d`
- Native feed (S/USD) set via `setNativeTokenPriceFeed(146, <chainlink S/USD>)`
- Oracle weights (sum 10000): Chainlink 4000, Band 3000, API3 2000, Pyth 1000
- Aggregated price snapshot:
  - Price (18 decimals): `296608280000000000` (≈ 0.29660828)
  - Success: true; Status: initialized; emergency=false; activeOracles=4
- Implementation note: TWAP fallback draft removed; relying on fee disincentives + capped probabilities. Final oracle uses only configured feeds and native price for LP valuation.

#### Scripts and helpers
- Updated: `script/DeployVanityCore.s.sol` (veDRAGON salt and deploy)
- Added: `script/GetLotteryManagerBytecodeHash.s.sol` (compute vanity bytecode hash)
- Added: `script/DeployVanityLotteryManager.s.sol` (CREATE2 vanity deploy)
- Updated: `script/DeployLotteryManager.s.sol` to pass `JACKPOT_VAULT` (not distributor)

- #### Environment and records
- `.env` updated:
  - `VEDRAGON=0x69f9d14a337823fad783d21f3669e29088e45777`
  - `LOTTERY_MANAGER_ADDRESS=0x69a6a2813c2224bbc34b3d0bf56c719de3c34777`
  - `JACKPOT_VAULT_ADDRESS=0x69ec31a869c537749af7fd44dd1fd347d62c7777`
  - `VANITY_SALT=0x00000000000000000000000000000000000000000000000000000005d21f0ff9`
  - `CREATE2_FACTORY_ADDRESS=0xAA28020DDA6b954D16208eccF873D79AC6533833`
  - `REGISTRY_ADDRESS=0x6949936442425f4137807Ac5d269e6Ef66d50777`
  - `OMNIDRAGON_ADDRESS=0x69dc1c36f8b26db3471acf0a6469d815e9a27777`
- Deployment record: `deployments/sonic/OmniDragonLotteryManager.json` with constructor args and salt

#### Front-end integration notes
- Use these addresses: veDRAGON, redDRAGON, DRAGON, OmniDragonLotteryManager, DragonJackpotVault
- Read-only methods:
  - `OmniDragonLotteryManager.getCurrentJackpot()`
  - `OmniDragonLotteryManager.getInstantLotteryConfig()`
  - `OmniDragonLotteryManager.calculateWinProbability(user, usdAmount)`
  - `OmniDragonLotteryManager.getUserStats(user)`
- Price display:
  - For DRAGON/USD, read `OmniDragonLotteryManager.getDragonPriceUSD()` (proxies the price oracle)
  - LP valuation uses native S/USD via the native feed
- Lottery safeguards live:
  - `MIN_SWAP_USD` threshold
  - `MAX_WIN_PROBABILITY_PPM = 100000` (10%)
  - `MIN_SWAP_INTERVAL` (7s)
  - veDRAGON boost capped at 2.5x
  - Only authorized callers (DRAGON/redDRAGON)

#### Outcome
- Vanity deployments completed and initialized
- LotteryManager refactored to vault-only payouts and configured
- Oracle wired with Chainlink/Band/API3/Pyth; aggregated price confirmed
- Env and deployment records updated for team handoff
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
- Sonic EID: 30332
- Arbitrum EID: 30110  
- Peers: Configured bidirectionally
- Enforced receive gas removed; use dynamic quotes (extraOptions can be `0x`)

## Verification

All contracts are verified on their respective block explorers:
- [Sonic VRF Integrator](https://sonicscan.org/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)
- [Arbitrum VRF Integrator](https://arbiscan.io/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)
- [Arbitrum VRF Consumer](https://arbiscan.io/address/0x697a9d438a5b61ea75aa823f98a85efb70fd23d5)
- [Ethereum VRF Integrator](https://etherscan.io/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)
- [BSC VRF Integrator](https://bscscan.com/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)
- [Avalanche VRF Integrator](https://snowtrace.io/address/0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5)

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


