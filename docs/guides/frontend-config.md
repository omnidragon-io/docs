---
title: Frontend Config (Cheat Sheet)
sidebar_position: 2
---

A concise configuration reference for integrating the OmniDRAGON OFT token and VRF.

## Constants (copy/paste)
```ts
// Token & Registry (same on all chains)
export const DRAGON = '0x69821FFA2312253209FdabB3D84f034B697E7777';
export const REGISTRY = '0x6949936442425f4137807Ac5d269e6Ef66d50777';

// LayerZero EIDs
export const EIDS = {
  ethereum: 30101,
  arbitrum: 30110,
  avalanche: 30106,
  base: 30184,
  sonic: 30332,
} as const;

// RPCs (production)
export const RPC = {
  ethereum: 'https://eth.llamarpc.com',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  avalanche: 'https://api.avax.network/ext/bc/C/rpc',
  base: 'https://mainnet.base.org',
  sonic: 'https://sonic.blockpi.network/v1/rpc/public',
} as const;

// VRF Integrator (same address across chains)
export const VRF_INTEGRATOR = '0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5';

// Dependencies (used for fee distribution dashboards/UI)
export const DEPENDENCIES = {
  sonic: {
    jackpotVault: '0x09a5d89539fdd07f779a3ddc3a985d0a757b4d7b',
    revenueDistributor: '0x4b0b4a25844744bbb23424533ca5a7f6dfaaba57',
  },
  arbitrum: {
    jackpotVault: '0x21f2c71190330d8e6ececb411f05195874274dc9',
    revenueDistributor: '0x8b89562e46502fc31addcace5b99367083c5c0c1',
  },
} as const;
```

## Minimal OFT send (ethers v6)
```ts
import { ethers } from 'ethers';
import { DRAGON, EIDS, RPC } from './frontend-config';

const abi = [
  'function balanceOf(address) view returns (uint256)',
  'function quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool) view returns (uint256 nativeFee,uint256 lzTokenFee)',
  'function send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address) payable returns (bytes32,(uint256,uint256))',
];

export async function bridgeDragon({
  from = 'sonic',
  to = 'arbitrum',
  toAddress,
  amount, // string or number in DRAGON (18 decimals)
  pk,
}: { from?: keyof typeof RPC; to?: keyof typeof EIDS; toAddress: string; amount: string | number; pk: string; }) {
  const provider = new ethers.JsonRpcProvider(RPC[from]);
  const wallet = new ethers.Wallet(pk, provider);
  const token = new ethers.Contract(DRAGON, abi, wallet);

  const amountLD = ethers.parseUnits(String(amount), 18);
  const toB32 = ethers.zeroPadValue(toAddress, 32);
  const sendParam = [EIDS[to], toB32, amountLD, amountLD, '0x', '0x', '0x'];

  const [nativeFee] = await token.quoteSend(sendParam, false);
  const tx = await token.send(sendParam, [nativeFee, 0n], wallet.address, { value: nativeFee });
  return tx.wait();
}
```

## Minimal OFT send (Foundry cast)
```bash
TOKEN=0x69821FFA2312253209FdabB3D84f034B697E7777
TO=0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F
TO_B32=0x000000000000000000000000ddd0050d1e084dfc72d5d06447cc10bcd3fef60f
DST=30110 # Arbitrum
AMOUNT=$(cast --to-wei 69420 ether)
QUOTE=$(cast call $TOKEN "quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool)" "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" false --rpc-url $RPC_URL_SONIC)
NATIVE_FEE_HEX=0x$(echo $QUOTE | sed 's/^0x//' | cut -c1-64)
NATIVE_FEE=$(cast to-dec $NATIVE_FEE_HEX)
cast send $TOKEN "send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address)" "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" "($NATIVE_FEE,0)" $TO --value $NATIVE_FEE --rpc-url $RPC_URL_SONIC --private-key $PRIVATE_KEY
```

## Confirm credit (destination)
```bash
cast call 0x69821FFA2312253209FdabB3D84f034B697E7777 "balanceOf(address)" $TO --rpc-url $RPC_URL_ARBITRUM
```

## References
- Deployments: /docs/deployments/overview
- Detailed integration: /docs/guides/frontend-integration


