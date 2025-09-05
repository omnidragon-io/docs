---
title: omniDRAGON Token — Technical Reference
sidebar_position: 30
---

# Token Technical Reference

## Contract Specifications

### omniDRAGON.sol

**Contract Address**: `0x69dc1c36f8b26db3471acf0a6469d815e9a27777` (All chains)  
**Solidity Version**: `^0.8.20`  
**License**: MIT

#### Inheritance Chain
```solidity
contract omniDRAGON is 
    OFT,              // LayerZero V2 OFT
    ReentrancyGuard   // OpenZeppelin reentrancy protection
```

#### Core Constants
```solidity
uint256 public constant MAX_SUPPLY = 69_420_000 * 10 ** 18;
uint256 public constant INITIAL_SUPPLY = 69_420_000 * 10 ** 18;
uint256 public constant BASIS_POINTS = 10000;
uint256 public constant SONIC_CHAIN_ID = 146;
uint256 public constant MAX_FEE_BPS = 2500;
address public constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD;
```

## Data Structures

### Fee Structure
```solidity
struct Fees {
    uint16 jackpot;   // Basis points for jackpot vault
    uint16 veDRAGON;  // Basis points for veDRAGON holders
    uint16 burn;      // Basis points to burn
    uint16 total;     // Total basis points
}
```

### Control Flags
```solidity
struct ControlFlags {
    bool feesEnabled;           // Whether fees are currently enabled
    bool initialMintCompleted;  // Whether initial mint is done
    bool emergencyMode;         // Emergency mode flag (unused)
}
```

### Transaction Context
```solidity
struct TransactionContext {
    address initiator;    // Original transaction sender
    bool isSwap;         // Whether this is a swap operation
    bool isLiquidity;    // Whether this is a liquidity operation
    uint256 blockNumber; // Block number
    uint256 timestamp;   // Timestamp
}
```

### Operation Type Enumeration
```solidity
enum OperationType {
    Unknown,        // Apply fees (default for safety)
    SwapOnly,       // Apply fees for swaps only
    NoFees,         // Never apply fees (exempt addresses)
    LiquidityOnly   // Only liquidity operations (no fees)
}
```

### Event Category Enumeration
```solidity
enum EventCategory {
    BUY_JACKPOT,
    BUY_REVENUE,
    BUY_BURN,
    SELL_JACKPOT,
    SELL_REVENUE,
    SELL_BURN
}
```

## State Variables

### Core Addresses
```solidity
IOmniDragonRegistry public immutable REGISTRY;
address public immutable DELEGATE;

address public jackpotVault;
address public revenueDistributor; 
address public lotteryManager;
address public fusionIntegrator;
```

### Fee Configuration
```solidity
Fees public buyFees = Fees(690, 241, 69, 1000);   // 6.90%, 2.41%, 0.69%, 10% total
Fees public sellFees = Fees(690, 241, 69, 1000);  // 6.90%, 2.41%, 0.69%, 10% total
ControlFlags public controlFlags = ControlFlags(true, false, false);
```

### Smart Detection Mappings
```solidity
// Operation type detection
mapping(address => OperationType) public addressOperationType;

// Legacy pair detection
mapping(address => bool) public isPair;

// DEX contract classifications
mapping(address => bool) public isBalancerVault;
mapping(address => bool) public isBalancerPool;
mapping(address => bool) public isUniswapV3Pool;
mapping(address => bool) public isPositionManager;
mapping(address => bool) public isSwapRouter;

// Transaction context tracking
mapping(bytes32 => TransactionContext) private txContexts;
mapping(address => uint256) private lastTxBlock;
```

## Function Reference

### Core Transfer Functions

#### Enhanced Transfer Functions
```solidity
function transfer(address to, uint256 amount) public virtual override returns (bool)
function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool)
```

#### Internal Smart Transfer Logic
```solidity
function _transferWithSmartDetection(address from, address to, uint256 amount) internal returns (bool)
function _shouldApplyTradingFees(address from, address to, uint256 amount) internal view returns (bool)
function _detectTradingOperation(address from, address to) internal view returns (bool)
```

### Smart Fee Detection Functions

#### Detection Logic Functions
```solidity
function _isBalancerSwap(address from, address to) internal view returns (bool)
function _isUniswapV3Swap(address from, address to) internal view returns (bool)
function _isKnownTradingVenue(address addr) internal view returns (bool)
```

#### Fee Processing Functions
```solidity
function _processTradeWithFees(address from, address to, uint256 amount) internal returns (bool)
function _processBuy(address from, address to, uint256 amount) internal returns (bool)
function _processSell(address from, address to, uint256 amount) internal returns (bool)
```

### Fee Distribution Functions

#### Distribution Logic
```solidity
function _distributeBuyFeesFromContract(uint256 feeAmount) internal
function _distributeSellFeesFromContract(uint256 feeAmount) internal
```

### Lottery Integration Functions

#### Lottery Trigger
```solidity
function _safeTriggerLottery(address buyer, uint256 amount) internal
```

### Administrative Functions

#### Address Classification
```solidity
function setAddressOperationType(address addr, OperationType opType) external onlyOwner validAddress(addr)
function configureDEXAddresses() external onlyOwner
```

#### DEX Configuration
```solidity
function setPair(address pair, bool _isPair) external onlyOwner
function setUniswapV3Pool(address pool, bool isPool) external onlyOwner
function setBalancerPool(address pool, bool isPool) external onlyOwner
```

#### Ecosystem Configuration
```solidity
function setLotteryManager(address _lotteryManager) external onlyOwner validAddress(_lotteryManager)
function setJackpotVault(address _jackpotVault) external onlyOwner validAddress(_jackpotVault)
function setRevenueDistributor(address _revenueDistributor) external onlyOwner validAddress(_revenueDistributor)
function setFusionIntegrator(address _fusionIntegrator) external onlyOwner validAddress(_fusionIntegrator)
```

### View Functions

#### Fee Preview
```solidity
function previewFeesForTransfer(address from, address to, uint256 amount) 
    external view returns (
        bool feesApply,
        uint256 feeAmount,
        uint256 transferAmount, 
        string memory reason
    )
```

#### Classification Queries
```solidity
function getOperationType(address addr) external view returns (OperationType)
function isTradingVenue(address addr) external view returns (bool)
```

### LayerZero V2 OFT Functions

#### Cross-Chain Transfer
```solidity
function send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)
    external payable returns (MessagingReceipt memory msgReceipt, OFTReceipt memory oftReceipt)

function quoteSend(SendParam calldata _sendParam, bool _payInLzToken)
    external view returns (MessagingFee memory msgFee)
```

### Utility Functions

#### Sonic FeeM Integration
```solidity
function registerMe() external onlyOwner
```

#### Internal Utilities
```solidity
function _getLayerZeroEndpoint(address _registry) internal view returns (address)
```

## Events Reference

### Core Token Events
```solidity
event FeesDistributed(
    address indexed vault,
    uint256 amount,
    EventCategory indexed category
);

event LotteryTriggered(
    address indexed buyer,
    uint256 amount,
    uint256 estimatedUSDValue
);

event InitialMintCompleted(
    address indexed recipient,
    uint256 amount,
    uint256 chainId
);

event SmartFeeApplied(
    address indexed from,
    address indexed to,
    uint256 amount,
    uint256 feeAmount,
    string detectionReason
);

event OperationTypeDetected(
    bytes32 indexed contextId,
    address initiator,
    bool isSwap,
    bool isLiquidity
);
```

### LayerZero V2 OFT Events
```solidity
// Inherited from LayerZero V2 OFT
event OFTSent(
    bytes32 indexed guid,
    uint32 dstEid,
    address indexed fromAddress,
    uint256 amountSentLD,
    uint256 amountReceivedLD
);

event OFTReceived(
    bytes32 indexed guid,
    uint32 srcEid,
    address indexed toAddress,
    uint256 amountReceivedLD
);
```

## Error Definitions

### Custom Errors
```solidity
// From DragonErrors library
error ZeroAddress();
error InvalidAmount();
error ExceedsMaxSupply();
error InsufficientBalance();
error TransferFailed();
error UnauthorizedAccess();
error InvalidConfiguration();
error FeesDisabled();
error InvalidFeeRecipient();
```

### LayerZero V2 Errors
```solidity
// Inherited from LayerZero V2 OFT
error InvalidDelegate();
error InvalidEndpointCall();
error InvalidSender();
error LzTokenUnavailable();
error OnlyEndpoint(address addr);
error OnlyPeer(uint32 eid, bytes32 sender);
error NoPeer(uint32 eid);
error NotEnoughNative(uint256 msgValue);
error SlippageExceeded(uint256 amountLD, uint256 minAmountLD);
```

## Interface Definitions

### IomniDRAGON
```solidity
interface IomniDRAGON {
    // Core ERC-20 functions
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    // Smart fee detection
    function previewFeesForTransfer(address from, address to, uint256 amount) 
        external view returns (bool feesApply, uint256 feeAmount, uint256 transferAmount, string memory reason);
    
    // Configuration functions
    function setAddressOperationType(address addr, OperationType opType) external;
    function getOperationType(address addr) external view returns (OperationType);
    function isTradingVenue(address addr) external view returns (bool);
    
    // LayerZero V2 OFT functions
    function send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)
        external payable returns (MessagingReceipt memory msgReceipt, OFTReceipt memory oftReceipt);
    function quoteSend(SendParam calldata _sendParam, bool _payInLzToken)
        external view returns (MessagingFee memory msgFee);
}
```

### IOmniDragonLotteryManager
```solidity
interface IOmniDragonLotteryManager {
    function processSwapLottery(
        address buyer,
        address token,
        uint256 tokenAmount,
        uint256 usdValue
    ) external returns (uint256 lotteryEntryId);
}
```

### IOmniDragonRegistry
```solidity
interface IOmniDragonRegistry {
    function getLayerZeroEndpoint(uint16 chainId) external view returns (address);
    function getOracleAddress() external view returns (address);
    function isChainSupported(uint256 chainId) external view returns (bool);
}
```

## Integration Patterns

### Standard ERC-20 Integration
```solidity
contract BasicIntegration {
    IERC20 constant dragon = IERC20(0x69dc1c36f8b26db3471acf0a6469d815e9a27777);
    
    function deposit(uint256 amount) external {
        // Direct transfer - no fees applied
        dragon.transferFrom(msg.sender, address(this), amount);
    }
    
    function withdraw(uint256 amount) external {
        // Direct transfer - no fees applied
        dragon.transfer(msg.sender, amount);
    }
}
```

### Smart Fee Preview Integration
```solidity
contract SmartFeeIntegration {
    IomniDRAGON constant dragon = IomniDRAGON(0x69dc1c36f8b26db3471acf0a6469d815e9a27777);
    
    function previewTradeToRouter(address router, uint256 amount) 
        external view returns (TradePreview memory) 
    {
        (bool feesApply, uint256 feeAmount, uint256 transferAmount, string memory reason) = 
            dragon.previewFeesForTransfer(msg.sender, router, amount);
            
        return TradePreview({
            originalAmount: amount,
            feesApply: feesApply,
            feeAmount: feeAmount,
            netAmount: transferAmount,
            detectionReason: reason,
            effectiveFeeRate: feesApply ? (feeAmount * 10000) / amount : 0
        });
    }
    
    struct TradePreview {
        uint256 originalAmount;
        bool feesApply;
        uint256 feeAmount;
        uint256 netAmount;
        string detectionReason;
        uint256 effectiveFeeRate; // In basis points
    }
}
```

### Cross-Chain OFT Integration
```solidity
contract CrossChainIntegration {
    IomniDRAGON constant dragon = IomniDRAGON(0x69dc1c36f8b26db3471acf0a6469d815e9a27777);
    
    uint32 constant ARBITRUM_EID = 30110;
    uint32 constant BASE_EID = 30184;
    
    function bridgeToArbitrum(uint256 amount, address recipient) external payable {
        SendParam memory sendParam = SendParam({
            dstEid: ARBITRUM_EID,
            to: bytes32(uint256(uint160(recipient))),
            amountLD: amount,
            minAmountLD: amount,
            extraOptions: "",
            composeMsg: "",
            oftCmd: ""
        });
        
        // Quote the cross-chain fee
        MessagingFee memory fee = dragon.quoteSend(sendParam, false);
        require(msg.value >= fee.nativeFee, "Insufficient fee");
        
        // Execute cross-chain transfer (NO trading fees)
        dragon.send(sendParam, fee, msg.sender);
    }
    
    function quoteBridge(uint256 amount, uint32 dstEid) external view returns (uint256 nativeFee) {
        SendParam memory sendParam = SendParam({
            dstEid: dstEid,
            to: bytes32(uint256(uint160(msg.sender))),
            amountLD: amount,
            minAmountLD: amount,
            extraOptions: "",
            composeMsg: "",
            oftCmd: ""
        });
        
        MessagingFee memory fee = dragon.quoteSend(sendParam, false);
        return fee.nativeFee;
    }
}
```

### DEX Router Integration
```solidity
contract DEXIntegration {
    IomniDRAGON constant dragon = IomniDRAGON(0x69dc1c36f8b26db3471acf0a6469d815e9a27777);
    IUniswapV2Router02 constant uniswapRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    
    function swapDragonForETH(uint256 dragonAmount, uint256 minETHOut) external {
        // Preview fees (will show 10% fee for router interaction)
        (bool feesApply, uint256 feeAmount, uint256 netAmount,) = 
            dragon.previewFeesForTransfer(msg.sender, address(uniswapRouter), dragonAmount);
            
        require(feesApply, "Expected fees for DEX trade");
        
        // Approve router for full amount (fees deducted automatically)
        dragon.approve(address(uniswapRouter), dragonAmount);
        
        // Execute swap - fees automatically applied
        address[] memory path = new address[](2);
        path[0] = address(dragon);
        path[1] = uniswapRouter.WETH();
        
        uniswapRouter.swapExactTokensForETH(
            dragonAmount,
            minETHOut,
            path,
            msg.sender,
            block.timestamp + 300
        );
        
        // Note: dragonAmount includes fees, netAmount actually swapped
    }
}
```

## Testing Utilities

### Mock Contracts for Testing
```solidity
contract MockLotteryManager {
    uint256 public lastProcessedAmount;
    address public lastBuyer;
    uint256 public entryCounter;
    
    function processSwapLottery(
        address buyer,
        address token,
        uint256 tokenAmount,
        uint256 usdValue
    ) external returns (uint256 lotteryEntryId) {
        lastBuyer = buyer;
        lastProcessedAmount = tokenAmount;
        entryCounter++;
        return entryCounter;
    }
}

contract MockDEXRouter {
    bool public isSwapRouter = true;
    mapping(address => uint256) public balances;
    
    function simulateSwap(address token, uint256 amount) external {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }
}
```

### Test Helper Functions
```javascript
const testHelpers = {
  async deployDragonToken(signer) {
    const DragonToken = await ethers.getContractFactory("omniDRAGON");
    const registry = await this.deployMockRegistry();
    
    return await DragonToken.deploy(
      "omniDRAGON",
      "DRAGON", 
      signer.address, // delegate
      registry.address,
      signer.address  // owner
    );
  },
  
  async setupTestDEX(dragon, mockRouter) {
    // Configure mock router as swap-only
    await dragon.setAddressOperationType(mockRouter.address, 1); // SwapOnly
    return mockRouter;
  },
  
  async testFeeCalculation(dragon, from, to, amount) {
    const [feesApply, feeAmount, transferAmount, reason] = 
      await dragon.previewFeesForTransfer(from, to, amount);
      
    return {
      feesApply,
      feeAmount: ethers.formatEther(feeAmount),
      transferAmount: ethers.formatEther(transferAmount),
      reason,
      effectiveFeeRate: feesApply ? (Number(feeAmount) / Number(amount)) * 100 : 0
    };
  },
  
  async simulateCrossChainTransfer(dragon, amount, destEid, recipient) {
    const sendParam = {
      dstEid: destEid,
      to: ethers.zeroPadValue(recipient, 32),
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: '0x',
      composeMsg: '0x',
      oftCmd: '0x'
    };
    
    const fee = await dragon.quoteSend(sendParam, false);
    
    // Simulate the send (in real test, would need LayerZero testnet)
    return {
      sendParam,
      fee: ethers.formatEther(fee.nativeFee),
      wouldSucceed: true
    };
  }
};
```

### Test Scenarios
```javascript
describe("omniDRAGON Token Tests", function() {
  let dragon, owner, user1, user2, mockRouter, mockLottery;
  
  beforeEach(async function() {
    [owner, user1, user2] = await ethers.getSigners();
    dragon = await testHelpers.deployDragonToken(owner);
    mockRouter = await deployMockRouter();
    mockLottery = await deployMockLottery();
    
    await dragon.setLotteryManager(mockLottery.address);
    await testHelpers.setupTestDEX(dragon, mockRouter);
  });
  
  it("should apply 10% fees on DEX trades", async function() {
    const tradeAmount = ethers.parseEther('1000');
    
    // Transfer to mock DEX router should trigger fees
    const preview = await testHelpers.testFeeCalculation(
      dragon, user1.address, mockRouter.address, tradeAmount
    );
    
    expect(preview.feesApply).to.be.true;
    expect(preview.effectiveFeeRate).to.be.closeTo(10, 0.1);
    expect(preview.reason).to.include("swap");
  });
  
  it("should not apply fees on direct transfers", async function() {
    const transferAmount = ethers.parseEther('1000');
    
    const preview = await testHelpers.testFeeCalculation(
      dragon, user1.address, user2.address, transferAmount
    );
    
    expect(preview.feesApply).to.be.false;
    expect(preview.effectiveFeeRate).to.equal(0);
  });
  
  it("should trigger lottery on buy transactions", async function() {
    const buyAmount = ethers.parseEther('500');
    
    // Transfer from DEX to user (simulates buy)
    await dragon.connect(owner).transfer(mockRouter.address, buyAmount * 2n);
    
    const tx = await dragon.connect(mockRouter).transfer(user1.address, buyAmount);
    const receipt = await tx.wait();
    
    // Check for lottery trigger event
    const lotteryEvent = receipt.logs.find(log => 
      log.topics[0] === ethers.keccak256(ethers.toUtf8Bytes('LotteryTriggered(address,uint256,uint256)'))
    );
    
    expect(lotteryEvent).to.exist;
  });
  
  it("should quote cross-chain transfers without fees", async function() {
    const bridgeAmount = ethers.parseEther('5000');
    const destEid = 30110; // Arbitrum
    
    const result = await testHelpers.simulateCrossChainTransfer(
      dragon, bridgeAmount, destEid, user1.address
    );
    
    expect(result.wouldSucceed).to.be.true;
    expect(parseFloat(result.fee)).to.be.greaterThan(0); // LayerZero fee
    
    // Verify no trading fees on cross-chain
    const preview = await dragon.previewFeesForTransfer(
      user1.address, dragon.address, bridgeAmount
    );
    expect(preview.feesApply).to.be.false;
  });
});
```

## Performance Metrics

### Gas Consumption Analysis
| Operation | Base Gas | Fee Processing | Total Gas | Notes |
|-----------|----------|----------------|-----------|-------|
| Standard Transfer | ~65,000 | 0 | ~65,000 | No fees applied |
| DEX Trade (Buy) | ~80,000 | ~70,000 | ~150,000 | Includes fee distribution + lottery |
| DEX Trade (Sell) | ~80,000 | ~40,000 | ~120,000 | Fee distribution only |
| Cross-Chain Send | ~180,000 | 0 | ~180,000 | Plus LayerZero fees |
| Fee Preview | ~15,000 | 0 | ~15,000 | View function |
| Address Classification | ~25,000 | 0 | ~25,000 | Admin function |

### Memory Usage
- **State Variables**: ~20 storage slots for core functionality
- **Mappings**: Variable based on DEX configurations
- **Temporary Variables**: Minimal stack usage in transfers

### Cross-Chain Performance
- **LayerZero V2 Latency**: 2-5 minutes typical
- **Gas Efficiency**: ~50% less gas than V1 
- **Native Bridging**: No wrapping/unwrapping overhead

---

**Complete technical specification for omniDRAGON cross-chain token integration**
