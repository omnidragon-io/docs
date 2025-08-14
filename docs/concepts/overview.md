---
sidebar_position: 1
---

# Red Dragon Overview

Cross-chain ERC-20 token with LayerZero V2 • Same addresses on all chains • Chainlink VRF for randomness

## Quick Start

```bash
npm install ethers viem
```

```ts
import { ethers } from 'ethers';
const DRAGON = '0x69dc1c36f8b26db3471acf0a6469d815e9a27777';
// Transfer example
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const token = new ethers.Contract(DRAGON, ['function transfer(address,uint256) returns (bool)'], signer);
await token.transfer('0xRecipient', ethers.parseUnits('1', 18));
```

See Frontend Integrations for Sonic setup, addresses JSON import, and viem examples: `/docs/integrations/frontend-integrations`