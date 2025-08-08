---
title: Frontend Integration Guide (TL;DR)
sidebar_position: 20
---

This is the minimal glue code your frontend needs. Constants are in Quick Start.

## TL;DR
1) Define constants (see Quick Start)
2) Quote LayerZero fee with `quoteSend`
3) Call `send` with `value = nativeFee`
4) Optionally confirm on destination with `balanceOf`

Links: see Quick Start

> Constants (token/registry, EIDs and RPCs) are listed in Quick Start.

## ABI Notes (OFT)
- OFT `SendParam` (struct): `(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd)`
- `quoteSend((...), bool payInLzToken)` returns `(MessagingFee)`; in cast, first 32 bytes are `nativeFee`
- `send((...), (uint256 nativeFee, uint256 lzTokenFee), address refund)` must be called with `value = nativeFee`
- Receive gas is not enforced in config; `extraOptions` can be `0x`

## Minimal Example (ethers v6)
```ts
import { ethers } from 'ethers'

const TOKEN = '0x69821FFA2312253209FdabB3D84f034B697E7777'
const user = '0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F'
const dstEid = 30110 // Arbitrum
const amount = ethers.parseUnits('69420', 18)

const abi = [
  'function balanceOf(address) view returns (uint256)',
  'function quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool) view returns (uint256 nativeFee, uint256 lzTokenFee)',
  'function send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address) payable returns (bytes32, (uint256,uint256))'
]

const provider = new ethers.JsonRpcProvider('https://eu.endpoints.matrixed.link/rpc/sonic?auth=...')
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
const token = new ethers.Contract(TOKEN, abi, signer)

const toBytes32 = (addr: string) => ethers.zeroPadValue(addr, 32)
const sendParam = [dstEid, toBytes32(user), amount, amount, '0x', '0x', '0x']

const [nativeFee] = await token.quoteSend(sendParam, false)

const tx = await token.send(sendParam, [nativeFee, 0n], user, { value: nativeFee })
await tx.wait()
```

## Minimal Example (Foundry cast)
```bash
TOKEN=0x69821FFA2312253209FdabB3D84f034B697E7777
TO=0xDDd0050d1E084dFc72d5d06447Cc10bcD3fEF60F
TO_B32=0x000000000000000000000000ddd0050d1e084dfc72d5d06447cc10bcd3fef60f
DST=30110
AMOUNT=$(cast --to-wei 69420 ether)
QUOTE=$(cast call $TOKEN "quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool)" "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" false --rpc-url $RPC_URL_SONIC)
NATIVE_FEE_HEX=0x$(echo $QUOTE | sed 's/^0x//' | cut -c1-64)
NATIVE_FEE=$(cast to-dec $NATIVE_FEE_HEX)
cast send $TOKEN "send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address)" "($DST,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" "($NATIVE_FEE,0)" $TO --value $NATIVE_FEE --rpc-url $RPC_URL_SONIC --private-key $PRIVATE_KEY
```

## Confirming Credit (destination)
```bash
cast call 0x69821FFA2312253209FdabB3D84f034B697E7777 "balanceOf(address)" $TO --rpc-url $RPC_URL_ARBITRUM
```

## Addresses
DRAGON_ADDRESS and RPCs: see Quick Start

## UX Notes
- Bridge flow: select destination chain → quote fee → send → show pending status → poll destination balance
- Gas optimization: no enforced receive gas; rely on defaults. For high complexity payloads, pass extraOptions later if needed.

---

## LayerZero OFT API (optional)
For auto-populated txs and discovery, use the OFT API: https://docs.layerzero.network/v2/tools/api/oft
This is optional; most apps can just use `quoteSend` + `send` above.


