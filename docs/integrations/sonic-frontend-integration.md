---
title: Sonic Deployment Integration Guide
description: Single-page frontend cheat sheet for integrating OmniDragon on Sonic mainnet.
---

### Network

- **Network**: Sonic mainnet
- **Chain ID**: 146
- **RPC**: configure via env `RPC_URL_SONIC`
- **Source of truth (addresses/ABIs)**: files in `deployments/sonic/*.json`

### Addresses (Sonic)

- **omniDRAGON (ERC-20)**: `0x69dc1c36f8b26db3471acf0a6469d815e9a27777`
- **redDRAGON (ERC-4626)**: `0x69320eb5b9161a34cb9cdd163419f826691a1777`
- **veDRAGON (ERC-20)**: `0x69f9d14a337823fad783d21f3669e29088e45777`
- **OmniDragonJackpotVault**: `0x69ec31a869c537749af7fd44dd1fd347d62c7777`
- **veDRAGONRevenueDistributor**: `0x6960cd77b3628b77d06871f114cde980434fa777`
- **veDRAGONBoostManager**: `0x620893426c6737e6507a92d060a0a7cd8fb7c1f5`
- **PartnerBribeDistributor**: `0xbc68de87eC01f4c70Cd0949f94b3E97aa115C9a1`
- **GaugeController**: `0x69b0d9c5e74413a7d2c7d3d680fe1289c311e777`
- **DragonGaugeRegistry**: `0x698402021a594515f5a379f6c4e77d3e1f452777`
- **OmniDragonPrimaryOracle**: see `deployments/sonic/OmniDragonPrimaryOracle.json`
- **OmniDragonLotteryManager**: `0x69a6a2813c2224bbc34b3d0bf56c719de3c34777`
- **DragonFeeMHelper**: see `deployments/sonic/DragonFeeMHelper.json`

### ABIs

- **Preferred**: use the `abi` embedded in `deployments/sonic/*.json`
- **Fallback**: artifacts in `out/<ContractFile>/<ContractName>.json` (field `.abi`)

### Units and Conventions

- **Prices (aggregated)**: 18 decimals
- **USD amounts in LotteryManager**: 6 decimals
- **Probabilities**: PPM (parts per million), where `1_000_000 = 100%`
- **BPS**: basis points where `10_000 = 100%`

### Price and Oracle

- **Current DRAGON/USD price (18 decimals)**
  - `OmniDragonLotteryManager.getDragonPriceUSD() → (price18, isValid, timestamp)`
  - `OmniDragonPrimaryOracle.getAggregatedPrice() → (price18, success, timestamp)`
- **Oracle sources configured**
  - Chainlink: `0xc76d…e01d` (active)
  - Band: `0x5060…70Cc` (active)
  - API3: `0x726D…5918` (weight = 0 currently)
  - Pyth: `0x2880…7B43` with `priceId 0xf490…2d6d` (active)
- Use `timestamp`/freshness flags in the UI. For reads, prefer the viem helpers below (`fetchDragonPrice18`, `fetchUserProbabilities`).

### Viem client and helpers (ready to paste)

```ts
import { createPublicClient, http, getContract, parseAbi, keccak256, toHex, concat, stringToBytes, getAddress } from 'viem';
import { sonic } from 'viem/chains';

// Configure client
export const client = createPublicClient({
  chain: sonic,
  transport: http(process.env.RPC_URL_SONIC!)
});

// Load these from deployments/sonic/*.json in your app
export const LM_ADDR = '0x69a6a2813c2224bbc34b3d0bf56c719de3c34777';
export const REG_ADDR = '0x698402021a594515f5a379f6c4e77d3e1f452777';
export const GC_ADDR  = '0x69b0d9c5e74413a7d2c7d3d680fe1289c311e777';

// Minimal ABIs for required reads
export const lmAbi = parseAbi([
  'function getDragonPriceUSD() view returns (int256,bool,uint256)',
  'function calculateWinProbability(address,uint256) view returns (uint256,uint256)',
  'function getInstantLotteryConfig() view returns (uint256,uint256,uint256,bool,bool)',
  'function getCurrentJackpot() view returns (uint256)',
  'function getUserStats(address) view returns (uint256,uint256,uint256,uint256,uint256)'
]);
export const regAbi = parseAbi([
  'function getPartnerCount() view returns (uint256)',
  'function partnerList(uint256) view returns (address)',
  'function getPartnerDetails(address) view returns (string,uint256,uint256,bool)',
  'function isPartnerActive(address) view returns (bool)'
]);
export const gcAbi = parseAbi([
  'function getRelativeWeight(bytes32,uint256) view returns (uint256)'
]);

export const lm = getContract({ address: LM_ADDR, abi: lmAbi, client });
export const reg = getContract({ address: REG_ADDR, abi: regAbi, client });
export const gc  = getContract({ address: GC_ADDR, abi: gcAbi, client });

// Price (18 decimals)
export async function fetchDragonPrice18() {
  const [price18, ok, ts] = await lm.read.getDragonPriceUSD();
  return { price18, ok, ts } as { price18: bigint; ok: boolean; ts: bigint };
}

// usd6 = USD with 6 decimals, e.g. $1,000 => 1_000_000_000
export async function fetchUserProbabilities(user: `0x${string}`, usd6: bigint) {
  const [basePPM, boostedPPM] = await lm.read.calculateWinProbability([user, usd6]);
  const toPct = (ppm: bigint) => Number(ppm) / 10_000; // 1e6 PPM => divide by 1e4 to get %
  return { basePPM, boostedPPM, basePct: toPct(basePPM), boostedPct: toPct(boostedPPM) };
}

// Partners and details
export async function fetchPartners() {
  const count = await reg.read.getPartnerCount();
  const items: Array<{
    address: `0x${string}`;
    name: string;
    feeShareBps: bigint;
    probBoostBps: bigint;
    isActive: boolean;
  }> = [];
  for (let i = 0n; i < count; i++) {
    const addr = await reg.read.partnerList([i]);
    const [name, feeShareBps, probabilityBoostBps, isActive] = await reg.read.getPartnerDetails([addr]);
    items.push({ address: addr, name, feeShareBps, probBoostBps: probabilityBoostBps, isActive });
  }
  return items;
}

// keccak256("partner:" + partnerAddress) is recommended for gaugeId
export function gaugeIdForPartner(addr: `0x${string}`) {
  const tag = stringToBytes('partner:');
  const raw = concat([tag, stringToBytes(getAddress(addr).toLowerCase())]);
  return keccak256(raw);
}

// Gauge relative weights and budget bps mapping
export async function fetchGaugeWeights(partnerAddrs: `0x${string}`[]) {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const results: Record<string, { relWeight: bigint; relPct: number; budgetBps: number }> = {};
  for (const a of partnerAddrs) {
    const gid = gaugeIdForPartner(a);
    const w = await gc.read.getRelativeWeight([gid, now]); // 1e18 = 100%
    const relPct = Number(w) / 1e16; // percentage with 2 decimals
    const budgetBps = 690 * Number(w) / 1e18; // 6.9% budget mapped via relative weight
    results[a] = { relWeight: w, relPct, budgetBps };
  }
  return results;
}

// Jackpot and user stats
export async function fetchJackpotAndUser(user: `0x${string}`) {
  const jackpot = await lm.read.getCurrentJackpot(); // wei
  const [swaps, volume, wins, rewards, lastTs] = await lm.read.getUserStats([user]);
  return { jackpot, swaps, volume, wins, rewards, lastTs };
}
```

#### Display helpers

- **Price**: divide `price18` by `1e18` to show DRAGON/USD
- **Probabilities**: `percent = ppm / 10_000` (since `1e6` PPM = 100%)
- **USD amounts**: values labeled “USD” from LM are 6 decimals
- **Gauge relative weights**: percentage ≈ `weight / 1e16`

### Lottery (OmniDragonLotteryManager)

- **Probability calculations**
  - `calculateWinProbability(user, swapAmountUSD6) → (basePPM, boostedPPM)`
  - Both values are PPM (`1e6 = 100%`)
- **USD conversions**: internal conversion uses price (18 decimals) → USD (6 decimals)
- **Misc UI reads**
  - `getVrfFee()`: native VRF fee
  - `getInstantLotteryConfig()`: min swap USD, reward bps, etc.
  - `getCurrentJackpot()`: vault balance
  - `getUserStats(user)`: swaps, volume, wins, rewards, last timestamp

### Boost System (veDRAGONBoostManager)

- `calculateBoost(user) → boostBps` (where `10_000 = 1.0x`)
- Voting period length: 7 days
- `getPartnerProbabilityBoost(partnerId) → bps`
- `calculatePartnersBoost()` can be triggered by anyone (time-gated)

### Partners & Gauges

- **Registry (`DragonGaugeRegistry`)**
  - `getPartnerCount()`
  - `partnerList(index) → address`
  - `getPartnerDetails(address) → (name, feeShareBps, probabilityBoostBps, isActive)`
  - `isPartnerActive(address) → bool`
- **Controller (`GaugeController`)**
  - Recommended `gaugeId = keccak256("partner:" + partnerAddress)`
  - `getRelativeWeight(gaugeId, now) → uint` (`1e18 = 100%`)
- **Global probability budget**
  - Total budget: 6.9% (690 bps)
  - Per-partner share = `690 bps × relativeWeight / 1e18` (e.g., 60%/40% → 4.14%/2.76%)

#### Current Partners (Sonic)

- **GOOD**: `0xb5a43c1C8B346B9C6FD8E4Afb8871c940B36e279`
- **ffDRAGON**: `0x40f531123bce8962d9cea52a3b150023bef488ed`
- Example distribution with 60/40 vote: `4.14% / 2.76%`

### Bribes (`PartnerBribeDistributor`)

- `depositBribe(partnerId, token, amount, forNextPeriod)`
- `getUserClaimable(period, partnerId, token, user)`
- `claim(period, partnerId, token)`
- Period boundary = voting period length (7 days)

### veDRAGONRevenueDistributor

- Show distributor balance, earned amounts, and claim flow for veDRAGON holders
- ABI at `deployments/sonic/veDRAGONRevenueDistributor.json`

### DragonFeeMHelper (infra)

- Not user-facing
- Forwards any native received to `JackpotVault`
- `getStats() → (totalFeeMRevenue, totalForwarded, pending, lastForwardTime)`



### Minimal OFT Send (ethers.js)

```ts
import { ethers } from 'ethers';
import oftDeployment from '../../deployments/sonic/omniDRAGON.json';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_SONIC!);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const oft = new ethers.Contract(oftDeployment.address, oftDeployment.abi, signer);

// Example: Sonic (30332) → Arbitrum (30110)
const dstEid = 30110;
const to = '0xYourArbitrumAddress';
const toB32 = ethers.zeroPadValue(to, 32);
const amountLD = ethers.parseEther('100');

// 1) Quote fee
const quote = await oft.quoteSend([dstEid, toB32, amountLD, amountLD, '0x', '0x', '0x'], false);
const nativeFee = quote[0];

// 2) Send
const tx = await oft.send(
  [dstEid, toB32, amountLD, amountLD, '0x', '0x', '0x'],
  [nativeFee, 0],
  to,
  { value: nativeFee }
);
await tx.wait();
```

### Minimal OFT Send (Foundry)

```bash
TOKEN=$(jq -r .address deployments/sonic/omniDRAGON.json)
TO=0xYourArbitrumAddress
TO_B32=0x$(cast to-bytes32 $TO)
DST=30110 # Arbitrum EID
AMOUNT=$(cast --to-wei 100 ether)

QUOTE=$(cast call $TOKEN "quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool)" "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" false --rpc-url $RPC_URL_SONIC)
NATIVE_FEE_HEX=0x$(echo $QUOTE | sed 's/^0x//' | cut -c1-64)
NATIVE_FEE=$(cast to-dec $NATIVE_FEE_HEX)

cast send $TOKEN \
  "send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address)" \
  "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" "($NATIVE_FEE,0)" $TO \
  --value $NATIVE_FEE \
  --rpc-url $RPC_URL_SONIC \
  --private-key $PRIVATE_KEY
```

See `docs/deployments/overview` for more cross-chain details and advanced options.

### Developer Notes

- Always read addresses and ABIs from `deployments/sonic/*.json`
- Normalize and label units in UI (PPM, bps, 6/18 decimals)
- If an ABI is missing in `deployments/*.json`, use the artifact ABI from `out/`
- Use `timestamp`/freshness to show price data recency
- For OFT bridging examples, see `deployments/overview` (cross-chain send/quote)


