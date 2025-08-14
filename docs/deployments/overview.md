---
title: Deployments
sidebar_position: 10
---

## Networks & Chain IDs

**LayerZero V2 EIDs**: Ethereum 30101 • Arbitrum 30110 • Avalanche 30106 • Base 30184 • Sonic 30332

## Key Addresses

**DRAGON Token**: `0x69dc1c36f8b26db3471acf0a6469d815e9a27777` (same on all chains)  
**VRF Integrator**: `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5` (same on all chains)

## Cross-Chain Bridge Example

```bash
# Quote fee
cast call $DRAGON_TOKEN "quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool)" \
  "(30110,$TO_B32,$AMOUNT,$AMOUNT,0x,0x,0x)" false --rpc-url $RPC_URL_SONIC

# Send tokens
cast send $DRAGON_TOKEN "send(...)" --value $NATIVE_FEE --rpc-url $RPC_URL_SONIC
```

See [Frontend Integrations](/docs/integrations/frontend-integrations) for complete examples and addresses.


