---
title: Architecture Diagrams
sidebar_position: 18
---

# omniDRAGON Architecture Diagrams

Visual representations of the omniDRAGON protocol architecture, token flows, and system interactions using interactive Mermaid diagrams.

## System Overview

### High-Level Architecture

```mermaid
graph TB
    %% Define styles and themes
    classDef userLayer fill:#667eea,stroke:#4c63d2,stroke-width:4px,color:#ffffff,font-weight:bold,shadow:lg
    classDef protocolLayer fill:#764ba2,stroke:#5a3d7a,stroke-width:3px,color:#ffffff,font-weight:bold,shadow:lg
    classDef contractLayer fill:#f093fb,stroke:#c44569,stroke-width:3px,color:#2d3748,font-weight:bold,shadow:lg
    classDef blockchainLayer fill:#4facfe,stroke:#3a7bd5,stroke-width:2px,color:#ffffff,font-weight:bold,shadow:lg
    classDef primaryChain fill:#00d4aa,stroke:#00a67e,stroke-width:4px,color:#ffffff,font-weight:bold,shadow:xl
    classDef secondaryChain fill:#667eea,stroke:#4c63d2,stroke-width:3px,color:#ffffff,font-weight:bold,shadow:lg

    subgraph "User Interface Layer"
        FE[Frontend dApps<br/><b>Web3 Interfaces</b>]:::userLayer
        DEX[DEX Trading<br/><b>10% Fee Applied</b>]:::userLayer
        WALLET[User Wallets<br/><b>Direct Interactions</b>]:::userLayer
    end

    subgraph "Protocol Logic Layer"
        FEES[Smart Fee Detection<br/><b>Trading vs Liquidity</b>]:::protocolLayer
        LOTTERY[Lottery System<br/><b>Swap-to-Win Mechanics</b>]:::protocolLayer
        BRIDGE[Cross-Chain Transfers<br/><b>0% Fees - LayerZero OFT</b>]:::protocolLayer
    end

    subgraph "Core Smart Contracts"
        DRAGON[omniDRAGON<br/><b>OFT Token Contract</b>]:::contractLayer
        REGISTRY[OmniDragon Registry<br/><b>Contract Directory</b>]:::contractLayer
        ORACLE[OmniDragon Oracle<br/><b>Multi-Source Price Feeds</b>]:::contractLayer
        LOTTERY_MGR[Lottery Manager<br/><b>Jackpot Coordination</b>]:::contractLayer
        VRF[VRF System<br/><b>Chainlink Randomness</b>]:::contractLayer
        FEE_DIST[Fee Distribution<br/><b>Revenue Sharing</b>]:::contractLayer
    end

    subgraph "Blockchain Infrastructure"
        SONIC[Sonic Network<br/><b>Primary Chain</b><br/>EID: 30332]:::primaryChain
        ARBITRUM[Arbitrum One<br/><b>Secondary Chain</b><br/>EID: 30110]:::secondaryChain
        ETHEREUM[Ethereum Mainnet<br/><b>Secondary Chain</b><br/>EID: 30101]:::secondaryChain
        BASE[Base Network<br/><b>Secondary Chain</b><br/>EID: 30184]:::secondaryChain
        AVALANCHE[Avalanche C-Chain<br/><b>Secondary Chain</b><br/>EID: 30106]:::secondaryChain
    end

    %% Connection flows with enhanced styling
    FE --> FEES
    DEX --> FEES
    WALLET --> FEES

    FEES --> LOTTERY
    FEES --> BRIDGE

    FEES --> DRAGON
    LOTTERY --> LOTTERY_MGR
    BRIDGE --> DRAGON

    DRAGON --> REGISTRY
    DRAGON --> ORACLE
    LOTTERY_MGR --> VRF
    LOTTERY_MGR --> FEE_DIST

    SONIC <--> ARBITRUM
    ARBITRUM <--> ETHEREUM
    ETHEREUM <--> BASE
    BASE <--> AVALANCHE

    %% Enhanced link styling
    linkStyle 0,1,2 stroke:#667eea,stroke-width:3px,stroke-dasharray: none
    linkStyle 3,4 stroke:#764ba2,stroke-width:3px,stroke-dasharray: none
    linkStyle 5,6,7 stroke:#f093fb,stroke-width:2px,stroke-dasharray: none
    linkStyle 8,9,10,11 stroke:#4facfe,stroke-width:2px,stroke-dasharray: none
    linkStyle 12,13,14,15 stroke:#00d4aa,stroke-width:4px,stroke-dasharray: 2 5
```

## Token Flow Diagrams

### Fee Distribution Flow

```mermaid
flowchart TD
    %% Define beautiful styling classes
    classDef tradeStart fill:#4ade80,stroke:#22c55e,stroke-width:4px,color:#ffffff,font-weight:bold,font-size:14px,shadow:lg
    classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef lottery fill:#dc2626,stroke:#b91c1c,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef revenue fill:#3b82f6,stroke:#2563eb,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef burn fill:#7c3aed,stroke:#5b21b6,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef zeroFee fill:#10b981,stroke:#059669,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg

    A[<b>User DEX Trade</b><br/>10% Fee Collected<br/><i>$1,000 trade = $100 fee</i>]:::tradeStart
    B{<b>Smart Fee Detection</b><br/>Trading Operation?<br/><i>DEX vs Liquidity</i>}:::decision

    B -->|Yes - DEX Trade| C[<b>Lottery Pool</b><br/>6.9% of Fee<br/><i>$69 → Jackpots</i>]:::lottery
    B -->|No - Transfer/Liquidity| D[<b>Zero Fee Operation</b><br/>No Distribution<br/><i>Free transfers</i>]:::zeroFee

    C --> E[<b>Jackpot Vault</b><br/>Unified Cross-Chain Pool<br/><i>Accumulated prizes</i>]:::lottery
    C --> F[<b>Lottery Odds</b><br/>Dynamic Probability<br/><i>Trade size affects odds</i>]:::lottery

    B -->|Yes - DEX Trade| G[<b>Revenue Distribution</b><br/>2.41% of Fee<br/><i>$24.10 → Stakers</i>]:::revenue
    G --> H[<b>veDRAGON Stakers</b><br/>Time-Weighted Rewards<br/><i>Lock for boosted yields</i>]:::revenue

    B -->|Yes - DEX Trade| I[<b>Burn Mechanism</b><br/>0.69% of Fee<br/><i>$6.90 → Dead address</i>]:::burn
    I --> J[<b>Dead Address</b><br/>Permanent Removal<br/><i>Deflationary burn</i>]:::burn

    %% Enhanced link styling with gradients
    linkStyle 0 stroke:#4ade80,stroke-width:4px
    linkStyle 1 stroke:#dc2626,stroke-width:3px
    linkStyle 2 stroke:#10b981,stroke-width:3px
    linkStyle 3 stroke:#dc2626,stroke-width:2px
    linkStyle 4 stroke:#dc2626,stroke-width:2px
    linkStyle 5 stroke:#3b82f6,stroke-width:3px
    linkStyle 6 stroke:#3b82f6,stroke-width:2px
    linkStyle 7 stroke:#7c3aed,stroke-width:3px
    linkStyle 8 stroke:#7c3aed,stroke-width:2px
```

### Lottery Win Flow

```mermaid
sequenceDiagram
    %% Define participant styles with enhanced formatting
    participant U as <b>User</b><br/>Trader
    participant DEX as <b>DEX Platform</b><br/>Exchange
    participant LM as <b>Lottery Manager</b><br/>Coordinator
    participant VRF_I as <b>VRF Integrator</b><br/>Sonic
    participant LZ as <b>LayerZero</b><br/>Bridge
    participant VRF_C as <b>VRF Consumer</b><br/>Arbitrum
    participant CL as <b>Chainlink VRF</b><br/>Oracle
    participant W as <b>Winner</b><br/>Recipient

    %% Enhanced styling with colored rectangles
    Note over U,W: <b>Lottery Draw Sequence</b><br/>Cross-Chain VRF → Winner Selection → Prize Distribution

    rect rgb(240, 253, 244)
        U->>+DEX: <b>1. Execute DEX Trade</b><br/>$1,000 swap
        DEX->>+LM: <b>2. Collect 10% Fee</b><br/>$100 total ($69 to lottery)
        LM->>+VRF_I: <b>3. Request Randomness</b><br/>Cross-chain VRF call
    end

    rect rgb(254, 249, 195)
        VRF_I->>+LZ: <b>4. Send Cross-Chain Message</b><br/>Sonic → Arbitrum
        LZ->>+VRF_C: <b>5. Deliver Request</b><br/>LayerZero endpoint
        VRF_C->>+CL: <b>6. Chainlink VRF Request</b><br/>Provably fair randomness
        CL-->>-VRF_C: <b>7. Return Random Number</b><br/>Secure random value
    end

    rect rgb(220, 252, 231)
        VRF_C->>+LZ: <b>8. Send Result Back</b><br/>Arbitrum → Sonic
        LZ->>+VRF_I: <b>9. Callback with Randomness</b><br/>Cross-chain response
        VRF_I->>+LM: <b>10. Return Randomness</b><br/>Complete VRF cycle
        LM->>LM: <b>11. Select Winner</b><br/>Algorithm-based selection
    end

    rect rgb(186, 230, 253)
        LM->>+W: <b>12. Automatic Prize Distribution</b><br/>Instant transfer
        Note right of W: <b>Winner receives jackpot instantly</b><br/>No claiming required<br/>Instant payout
    end
```

### Cross-Chain Transfer Flow

```mermaid
flowchart TD
    %% Define beautiful styling classes for cross-chain flow
    classDef startPoint fill:#4ade80,stroke:#22c55e,stroke-width:4px,color:#ffffff,font-weight:bold,font-size:14px,shadow:lg
    classDef quoteStep fill:#f59e0b,stroke:#d97706,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef decision fill:#dc2626,stroke:#b91c1c,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef network fill:#3b82f6,stroke:#2563eb,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef endpoint fill:#7c3aed,stroke:#5b21b6,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef contract fill:#059669,stroke:#047857,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef success fill:#10b981,stroke:#059669,stroke-width:4px,color:#ffffff,font-weight:bold,font-size:14px,shadow:xl

    A[<b>User Initiates Transfer</b><br/>DRAGON Tokens<br/><i>1000 DRAGON → Arbitrum</i>]:::startPoint
    B[<b>Quote LayerZero Fee</b><br/>Calculate Cross-Chain Cost<br/><i>~0.000034 ETH</i>]:::quoteStep

    B --> C{<b>Pay LZ Fee + Send Message</b><br/>Confirm transaction<br/><i>Gas + Bridge fee</i>}:::decision

    C --> D[<b>LayerZero Network</b><br/>Message Routing<br/><i>Secure cross-chain delivery</i>]:::network

    D --> E[<b>LZ Endpoint</b><br/>Destination Chain<br/><i>Arbitrum network</i>]:::endpoint

    E --> F[<b>omniDRAGON Contract</b><br/>Destination Chain<br/><i>Same address on all chains</i>]:::contract

    F --> G[<b>Tokens Minted</b><br/>Recipient Receives DRAGON<br/><i>Instant cross-chain transfer</i>]:::success

    %% Enhanced gradient link styling
    linkStyle 0 stroke:#4ade80,stroke-width:4px,stroke-dasharray: none
    linkStyle 1 stroke:#f59e0b,stroke-width:3px,stroke-dasharray: none
    linkStyle 2 stroke:#dc2626,stroke-width:3px,stroke-dasharray: none
    linkStyle 3 stroke:#3b82f6,stroke-width:3px,stroke-dasharray: none
    linkStyle 4 stroke:#7c3aed,stroke-width:3px,stroke-dasharray: none
    linkStyle 5 stroke:#059669,stroke-width:4px,stroke-dasharray: none
```

## Component Architecture

### Contract Dependencies

```mermaid
graph TD
    %% Define beautiful styling classes for contract dependencies
    classDef userApps fill:#667eea,stroke:#4c63d2,stroke-width:4px,color:#ffffff,font-weight:bold,font-size:14px,shadow:lg
    classDef coreContracts fill:#f093fb,stroke:#c44569,stroke-width:3px,color:#2d3748,font-weight:bold,font-size:13px,shadow:lg
    classDef externalDeps fill:#4facfe,stroke:#3a7bd5,stroke-width:3px,color:#ffffff,font-weight:bold,font-size:13px,shadow:lg
    classDef mainEntry fill:#dc2626,stroke:#b91c1c,stroke-width:4px,color:#ffffff,font-weight:bold,font-size:15px,shadow:xl

    subgraph "User Applications"
        DAPP[<b>Frontend dApp</b><br/>Web3 Interface<br/><i>React/Vue/Angular</i>]:::userApps
        SCRIPT[<b>Automation Script</b><br/>Bot/Strategy<br/><i>Node.js/Python</i>]:::userApps
    end

    subgraph "Core Protocol Contracts"
        DRAGON([<b>omniDRAGON</b><br/>OFT Token<br/><i>Main Entry Point</i><br/>Cross-chain token]):::mainEntry
        FEESYS([<b>Fee Detection</b><br/>Smart Logic<br/><i>Trading vs Liquidity</i><br/>AI-powered analysis]):::coreContracts
        LOTTERY([<b>Lottery Manager</b><br/>Jackpot Coordination<br/><i>Winner selection</i><br/>Prize distribution]):::coreContracts
        REGISTRY([<b>OmniDragon Registry</b><br/>Contract Directory<br/><i>Address management</i><br/>Contract registry]):::coreContracts
        ORACLE([<b>OmniDragon Oracle</b><br/>Price Feeds<br/><i>Multi-source data</i><br/>Cross-chain oracles]):::coreContracts
        VRF([<b>VRF System</b><br/>Randomness<br/><i>Provably fair</i><br/>Chainlink VRF]):::coreContracts
    end

    subgraph "External Dependencies"
        LZ([<b>LayerZero V2</b><br/>Cross-Chain Messaging<br/><i>Secure bridging</i><br/>LZ OFT protocol]):::externalDeps
        CHAINLINK([<b>Chainlink VRF</b><br/>Provable Randomness<br/><i>Cryptographic security</i><br/>Decentralized oracle]):::externalDeps
        PYTH([<b>Pyth Network</b><br/>Price Oracles<br/><i>High-frequency data</i><br/>Real-time feeds]):::externalDeps
        API3([<b>API3</b><br/>Decentralized Oracles<br/><i>First-party data</i><br/>Direct API access]):::externalDeps
    end

    %% Connection flows with enhanced styling
    DAPP --> DRAGON
    SCRIPT --> DRAGON

    DRAGON --> FEESYS
    DRAGON --> REGISTRY

    FEESYS --> LOTTERY
    LOTTERY --> VRF
    LOTTERY --> ORACLE

    VRF --> CHAINLINK
    ORACLE --> PYTH
    ORACLE --> API3

    DRAGON --> LZ
    VRF --> LZ

    %% Enhanced link styling with different colors for different flows
    linkStyle 0,1 stroke:#667eea,stroke-width:3px,stroke-dasharray: 2 5
    linkStyle 2,3 stroke:#f093fb,stroke-width:2px,stroke-dasharray: none
    linkStyle 4,5,6 stroke:#f093fb,stroke-width:2px,stroke-dasharray: none
    linkStyle 7,8,9 stroke:#4facfe,stroke-width:2px,stroke-dasharray: none
    linkStyle 10,11 stroke:#4facfe,stroke-width:3px,stroke-dasharray: none
```

### Network Architecture

```mermaid
graph TD
    subgraph "Primary Chain"
        SONIC[Sonic Network<br/>Chain ID: 146<br/>LZ EID: 30332<br/>Status: Active]
    end

    subgraph "Secondary Chains"
        ARBITRUM[Arbitrum One<br/>Chain ID: 42161<br/>LZ EID: 30110<br/>Status: Active]
        ETHEREUM[Ethereum<br/>Chain ID: 1<br/>LZ EID: 30101<br/>Status: Active]
        BASE[Base<br/>Chain ID: 8453<br/>LZ EID: 30184<br/>Status: Active]
        AVALANCHE[Avalanche<br/>Chain ID: 43114<br/>LZ EID: 30106<br/>Status: Active]
    end

    subgraph "Planned Chains"
        POLYGON[Polygon<br/>Chain ID: 137<br/>LZ EID: 30109<br/>Status: Planned]
        BSC[BSC<br/>Chain ID: 56<br/>LZ EID: 30102<br/>Status: Planned]
        OPTIMISM[Optimism<br/>Chain ID: 10<br/>LZ EID: 30111<br/>Status: Planned]
    end

    SONIC --- ARBITRUM
    SONIC --- ETHEREUM
    SONIC --- BASE
    SONIC --- AVALANCHE
    SONIC -.-> POLYGON
    SONIC -.-> BSC
    SONIC -.-> OPTIMISM

    ARBITRUM --- ETHEREUM
    ARBITRUM --- BASE
    ARBITRUM --- AVALANCHE
    BASE --- AVALANCHE
    ETHEREUM --- BASE

    style SONIC fill:#e8f5e8,stroke:#4caf50,stroke-width:4px
    style ARBITRUM fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style ETHEREUM fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style BASE fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style AVALANCHE fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style POLYGON fill:#fff3e0,stroke:#ff9800,stroke-dasharray: 5 5
    style BSC fill:#fff3e0,stroke:#ff9800,stroke-dasharray: 5 5
    style OPTIMISM fill:#fff3e0,stroke:#ff9800,stroke-dasharray: 5 5

    linkStyle 0,1,2,3 stroke:#4caf50,stroke-width:3px
    linkStyle 4,5,6 stroke:#ff9800,stroke-width:2px,stroke-dasharray: 5 5
    linkStyle 7,8,9,10,11 stroke:#2196f3,stroke-width:2px,stroke-dasharray: 2 2
```

## Data Flow Diagrams

### Price Oracle Flow

```mermaid
flowchart TD
    CL[Chainlink<br/>Price Feed<br/>Real-time Data] --> AGG
    PYTH[Pyth Network<br/>Price Feed<br/>High Frequency] --> AGG
    API3[API3<br/>Price Feed<br/>Decentralized] --> AGG

    AGG[Price Aggregation<br/>Engine<br/>Weighted Average] --> VAL

    VAL[Price Validation<br/>Engine<br/>Outlier Detection] --> FINAL

    FINAL[Final DRAGON Price<br/>USD Value<br/>18 decimals]

    CL -.-> LZ1[LayerZero Sync]
    PYTH -.-> LZ2[LayerZero Sync]
    API3 -.-> LZ3[LayerZero Sync]

    LZ1 --> AGG
    LZ2 --> AGG
    LZ3 --> AGG

    style CL fill:#e3f2fd,stroke:#2196f3
    style PYTH fill:#f3e5f5,stroke:#9c27b0
    style API3 fill:#fff3e0,stroke:#ff9800
    style AGG fill:#e8f5e8,stroke:#4caf50,stroke-width:2px
    style VAL fill:#ffebee,stroke:#f44336
    style FINAL fill:#c8e6c9,stroke:#4caf50,stroke-width:3px
```

### Governance Flow (Future)

```mermaid
flowchart TD
    STAKERS[veDRAGON Stakers<br/>Locked DRAGON Tokens<br/>Time-Weighted Voting] --> VOTING

    VOTING[Voting Power<br/>Calculation<br/>veDRAGON Balance × Lock Time] --> DECISIONS

    PROPOSALS[Proposal System<br/>Governance Proposals<br/>Parameter Changes] --> DECISIONS

    DECISIONS{Governance Decisions<br/>Community Voting<br/>Snapshot Voting} --> PARAMETERS

    PARAMETERS[Protocol Parameters<br/>Dynamic Configuration]

    PARAMETERS --> FEES[Fee Rates<br/>Trading Fees<br/>Distribution Ratios]

    PARAMETERS --> LOTTERY[Lottery Settings<br/>Jackpot Sizes<br/>Win Probabilities]

    PARAMETERS --> ORACLE[Oracle Configuration<br/>Price Feed Sources<br/>Update Frequencies]

    style STAKERS fill:#e8f5e8,stroke:#4caf50,stroke-width:2px
    style VOTING fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style PROPOSALS fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style DECISIONS fill:#ffebee,stroke:#f44336,stroke-width:3px
    style PARAMETERS fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style FEES fill:#e8f5e8,stroke:#4caf50
    style LOTTERY fill:#fff3e0,stroke:#ff9800
    style ORACLE fill:#e3f2fd,stroke:#2196f3
```

## Sequence Diagrams

### DEX Trade Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant DEX as DEX Platform
    participant DRAGON as omniDRAGON Contract
    participant LOTTERY as Lottery Manager

    Note over U,LOTTERY: DEX Trade → Fee Collection → Lottery Entry Flow

    U->>DEX: 1. Execute Token Swap
    DEX->>DRAGON: 2. Transfer Tokens (10% Fee Applied)

    DRAGON->>DRAGON: 3. Detect Trading Operation
    DRAGON->>DRAGON: 4. Calculate Fees (10% total)
    DRAGON->>DRAGON: 5. Distribute Fees Automatically

    DRAGON->>LOTTERY: 6. Notify Lottery System
    LOTTERY->>LOTTERY: 7. Process Lottery Entry
    LOTTERY->>DRAGON: 8. Confirm Entry

    DRAGON->>DEX: 9. Complete Token Transfer
    DEX->>U: 10. Trade Execution Complete

    Note right of U: User receives tokens minus 10% fee<br/>6.9% funds lottery jackpot
```

### Lottery Win Sequence

```mermaid
sequenceDiagram
    participant LM as Lottery Manager
    participant VRF_I as VRF Integrator<br/>(Sonic)
    participant LZ as LayerZero V2
    participant VRF_C as VRF Consumer<br/>(Arbitrum)
    participant CL as Chainlink VRF
    participant WINNER as Winner

    Note over LM,WINNER: Lottery Draw → Cross-Chain VRF → Winner Selection Flow

    LM->>VRF_I: 1. Trigger Lottery Draw
    VRF_I->>LZ: 2. Request Cross-Chain Randomness
    LZ->>VRF_C: 3. Deliver VRF Request (Arbitrum)
    VRF_C->>CL: 4. Chainlink VRF Request
    CL-->>VRF_C: 5. Generate Provably Fair Randomness
    VRF_C->>LZ: 6. Send Result Back via LayerZero
    LZ->>VRF_I: 7. Callback with Random Number
    VRF_I->>LM: 8. Return Randomness to Lottery
    LM->>LM: 9. Select Winner Based on Randomness
    LM->>WINNER: 10. Automatic Prize Distribution

    Note right of WINNER: Winner receives jackpot instantly<br/>No claiming required
```

## State Diagrams

### Token Transfer States

```mermaid
stateDiagram-v2
    [*] --> TransferInitiated: User initiates transfer

    TransferInitiated --> CrossChainTransfer: Cross-chain transfer requested
    TransferInitiated --> DexTransfer: DEX trading detected
    TransferInitiated --> WalletTransfer: Direct wallet transfer

    CrossChainTransfer --> LZMessageSent: LayerZero message sent
    LZMessageSent --> LZMessageReceived: Message received on destination
    LZMessageReceived --> LZMessageProcessed: Message processed by contract
    LZMessageProcessed --> TransferComplete: Tokens minted on destination

    DexTransfer --> FeeDetection: Smart fee detection activated
    FeeDetection --> TradingOperation: DEX trading confirmed
    FeeDetection --> LiquidityOperation: Liquidity operation detected

    TradingOperation --> FeeCalculation: Calculate 10% fee
    FeeCalculation --> FeeDistribution: Distribute fees
    FeeDistribution --> LotteryEntryCreated: 6.9% to lottery
    LotteryEntryCreated --> TransferCompleteWithLottery: Transfer complete + lottery entry

    LiquidityOperation --> NoFeesApplied: Zero fees for liquidity
    NoFeesApplied --> TransferCompleteNoFees: Transfer complete (no fees)

    WalletTransfer --> DirectTransfer: Direct wallet-to-wallet
    DirectTransfer --> TransferCompleteNoFees: Transfer complete (no fees)

    TransferComplete --> [*]
    TransferCompleteWithLottery --> [*]
    TransferCompleteNoFees --> [*]

    note right of FeeDistribution : 6.9% → Lottery Jackpot\n2.41% → veDRAGON Stakers\n0.69% → Dead Address Burn
    note right of LotteryEntryCreated : Automatic lottery entry on every DEX trade

    style TransferInitiated fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style FeeDistribution fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style LotteryEntryCreated fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style TransferComplete fill:#e8f5e8,stroke:#4caf50,stroke-width:2px
```

---

*These diagrams provide a comprehensive visual overview of the omniDRAGON ecosystem architecture and data flows.*
