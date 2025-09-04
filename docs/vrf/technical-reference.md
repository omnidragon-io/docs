---
title: OmniDragon VRF — Technical Reference
sidebar_position: 30
---

# VRF Technical Reference

## Contract Specifications

### ChainlinkVRFIntegratorV2_5.sol (Sonic)

**Contract Address**: `0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5`  
**Network**: Sonic (Chain ID: 146)  
**Solidity Version**: `^0.8.20`  
**License**: MIT

#### Inheritance Chain
```solidity
contract ChainlinkVRFIntegratorV2_5 is 
    OApp,
    OAppOptionsType3,
    Ownable
```

#### Core State Variables
```solidity
IOmniDragonRegistry public immutable registry;
uint32 constant ARBITRUM_EID = 30110;
uint64 public requestCounter;
uint32 public defaultGasLimit = 690420;

mapping(uint64 => RequestStatus) public s_requests;
mapping(uint64 => address) public randomWordsProviders;

uint256 public requestTimeout = 1 hours;
```

#### Data Structures
```solidity
struct RequestStatus {
    bool fulfilled;
    bool exists;
    address provider;
    uint256 randomWord;
    uint256 timestamp;
    bool isContract;
}
```

### OmniDragonVRFConsumerV2_5.sol (Arbitrum)

**Contract Address**: `0x697a9d438a5b61ea75aa823f98a85efb70fd23d5`  
**Network**: Arbitrum (Chain ID: 42161)  
**Solidity Version**: `^0.8.20`  
**License**: MIT

#### Inheritance Chain
```solidity
contract OmniDragonVRFConsumerV2_5 is 
    OApp,
    OAppOptionsType3,
    Ownable
```

#### Core State Variables
```solidity
IVRFCoordinatorV2Plus public vrfCoordinator;
IOmniDragonRegistry public immutable registry;

uint256 public subscriptionId;
bytes32 public keyHash;
uint32 public callbackGasLimit = 2500000;
uint16 public requestConfirmations = 3;
uint32 public numWords = 1;

mapping(uint256 => VRFRequest) public vrfRequests;
mapping(uint64 => uint256) public sequenceToRequestId;
mapping(address => uint256[]) public userLocalRequests;
mapping(address => bool) public authorizedLocalCallers;
```

#### Data Structures
```solidity
struct VRFRequest {
    uint64 sequence;
    uint32 sourceChainEid;
    bytes32 sourcePeer;
    address localRequester;
    bool isLocalRequest;
    uint256 randomWord;
    bool fulfilled;
    bool responseSent;
    bool callbackSent;
    uint256 timestamp;
}
```

## Function Reference

### ChainlinkVRFIntegratorV2_5 Functions

#### Public/External Functions

##### Fee Quoting
```solidity
function quoteFee() public view returns (MessagingFee memory fee)
function quoteFeeWithGas(uint32 _gasLimit) public view returns (MessagingFee memory fee)
```

##### Request Functions
```solidity
function requestRandomWords(uint32 dstEid) 
    public returns (MessagingReceipt memory receipt, uint64 requestId)

function requestRandomWordsPayable(uint32 dstEid) 
    external payable returns (MessagingReceipt memory receipt, uint64 requestId)
```

##### Status Functions
```solidity
function checkRequestStatus(uint64 requestId) 
    external view returns (bool fulfilled, bool exists, address provider, uint256 randomWord, uint256 timestamp, bool expired)

function getRandomWord(uint64 requestId) 
    external view returns (uint256 randomWord, bool fulfilled)
```

##### Administrative Functions
```solidity
function setDefaultGasLimit(uint32 _gasLimit) external onlyOwner
function setRequestTimeout(uint256 _timeout) external onlyOwner
function cleanupExpiredRequests(uint64[] calldata requestIds) external
function withdraw() external onlyOwner
function registerMe() external // Sonic FeeM registration
```

#### Internal Functions
```solidity
function _lzReceive(Origin calldata _origin, bytes32, bytes calldata _payload, address, bytes calldata) internal override
function _payNative(uint256 _nativeFee) internal override returns (uint256 nativeFee)
```

### OmniDragonVRFConsumerV2_5 Functions

#### Public/External Functions

##### Cross-Chain VRF Functions
```solidity
function _lzReceive(Origin calldata _origin, bytes32, bytes calldata _message, address, bytes calldata) internal override
function retryPendingResponse(uint64 sequence) external payable
function quoteSendToChain(uint32 targetChainEid) external view returns (MessagingFee memory fee)
```

##### Local VRF Functions
```solidity
function requestRandomWordsLocal() external returns (uint256 requestId)
function getLocalRequest(uint256 requestId) 
    external view returns (address requester, bool fulfilled, bool callbackSent, uint256 randomWord, uint256 timestamp)
function getUserLocalRequests(address user) external view returns (uint256[] memory requestIds)
```

##### Network Management
```solidity
function setSupportedChain(uint32 chainEid, bool supported, uint32 gasLimit) external onlyOwner
function addNewChain(uint32 chainEid, string calldata chainName, uint32 gasLimit) external onlyOwner
function getSupportedChains() external view returns (uint32[] memory eids, bool[] memory supported, uint32[] memory gasLimits)
function getAllChainsWithNames() external view returns (uint32[] memory eids, string[] memory names, bool[] memory supported, uint32[] memory gasLimits)
```

##### VRF Configuration
```solidity
function setVRFCoordinator(address _vrfCoordinator) external onlyOwner
function setSubscriptionId(uint256 _subscriptionId) external onlyOwner
function setKeyHash(bytes32 _keyHash) external onlyOwner
function setVRFConfig(address _vrfCoordinator, uint256 _subscriptionId, bytes32 _keyHash) external onlyOwner
```

##### Authorization Functions
```solidity
function setLocalCallerAuthorization(address caller, bool authorized) external onlyOwner
```

##### Status Functions
```solidity
function getRequestBySequence(uint64 sequence) 
    external view returns (uint256 requestId, bool exists, bool fulfilled, bool responseSent, uint256 randomWord, uint32 sourceChainEid, uint256 timestamp)
function getRequestById(uint256 requestId) 
    external view returns (uint64 sequence, bool exists, bool fulfilled, bool responseSent, uint256 randomWord, uint32 sourceChainEid, uint256 timestamp)
function getContractStatus() 
    external view returns (uint256 balance, uint256 minBalance, bool canSendResponses, uint32 gasLimit, uint256 supportedChainsCount)
function getRequestStats() external view returns (uint256 totalLocalRequests, uint256 totalCrossChainRequests)
```

##### Maintenance Functions
```solidity
function fundContract() external payable
function withdraw() external onlyOwner
function setMinimumBalance(uint256 _minimumBalance) external onlyOwner
function setDefaultGasLimit(uint32 _gasLimit) external onlyOwner
```

#### Internal Functions
```solidity
function rawFulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) external // VRF callback
function _handleLocalCallback(uint256 requestId, VRFRequest storage request, uint256[] calldata randomWords) internal
function _handleCrossChainResponse(uint256 requestId, VRFRequest storage request, uint256[] calldata randomWords) internal
function _sendResponseToChain(VRFRequest storage _request, MessagingFee memory _fee) internal
function _setSupportedChain(uint32 chainEid, bool supported, uint32 gasLimit) internal
function _payNative(uint256 _nativeFee) internal override returns (uint256 nativeFee)
```

## Events Reference

### ChainlinkVRFIntegratorV2_5 Events
```solidity
event RandomWordsRequested(uint64 indexed requestId, address indexed requester, uint32 dstEid);
event MessageSent(uint64 indexed requestId, uint32 indexed dstEid, bytes message);
event RandomWordsReceived(uint256[] randomWords, uint64 indexed sequence, address indexed provider);
event CallbackFailed(uint64 indexed sequence, address indexed provider, string reason);
event CallbackSucceeded(uint64 indexed sequence, address indexed provider);
event RequestExpired(uint64 indexed sequence, address indexed provider);
event GasLimitUpdated(uint32 oldLimit, uint32 newLimit);
event FeeMRegistered(address indexed contractAddress, uint256 indexed feeId);
```

### OmniDragonVRFConsumerV2_5 Events
```solidity
// Cross-chain events
event RandomWordsRequested(uint256 indexed requestId, uint32 indexed srcEid, bytes32 indexed requester, uint64 sequence, uint256 timestamp);
event VRFRequestSent(uint256 indexed originalRequestId, uint256 indexed vrfRequestId, uint32 sourceChain);
event RandomnessFulfilled(uint256 indexed requestId, uint256[] randomWords, uint32 targetChain);
event ResponseSentToChain(uint64 indexed sequence, uint256 randomWord, uint32 targetChain, uint256 fee);
event ResponsePending(uint64 indexed sequence, uint256 indexed requestId, uint32 targetChain, string reason);

// Local events
event LocalRandomWordsRequested(uint256 indexed requestId, address indexed requester, uint256 timestamp);
event LocalCallbackSent(uint256 indexed requestId, address indexed requester, uint256 randomWord);
event LocalCallbackFailed(uint256 indexed requestId, address indexed requester, string reason);

// Configuration events
event VRFConfigUpdated(uint256 subscriptionId, bytes32 keyHash, uint32 callbackGasLimit, uint16 requestConfirmations);
event MinimumBalanceUpdated(uint256 oldBalance, uint256 newBalance);
event ChainSupportUpdated(uint32 chainEid, bool supported, uint32 gasLimit);
event ContractFunded(address indexed funder, uint256 amount, uint256 newBalance);
event LocalCallerAuthorized(address indexed caller, bool authorized);
```

## Error Codes

### Common Errors
```solidity
// ChainlinkVRFIntegratorV2_5
error NotEnoughNative(uint256 provided); // Insufficient ETH for LayerZero fees
error InvalidDestinationEid(uint32 eid);  // Invalid destination endpoint ID
error RequestNotFound(uint64 requestId);  // Request ID doesn't exist
error RequestExpired(uint64 requestId);   // Request has timed out
error RequestAlreadyFulfilled(uint64 requestId); // Request already completed

// OmniDragonVRFConsumerV2_5  
error ChainNotSupported(uint32 chainEid); // Chain not configured
error InvalidSourcePeer(bytes32 peer);    // Unauthorized source peer
error DuplicateSequence(uint64 sequence); // Sequence already processed
error NotAuthorizedForLocalRequests(address caller); // Local caller not authorized
error InvalidVRFCoordinator(address coordinator); // Invalid VRF coordinator address
error InsufficientContractBalance(uint256 required, uint256 available); // Not enough ETH for LayerZero
error InvalidGasLimit(uint32 gasLimit);   // Gas limit out of range
error VRFRequestNotFound(uint256 requestId); // VRF request doesn't exist
```

## Constants and Configurations

### Network Constants
```solidity
// LayerZero Endpoint IDs
uint32 public constant ETHEREUM_EID = 30101;
uint32 public constant BSC_EID = 30102;
uint32 public constant AVALANCHE_EID = 30106;
uint32 public constant POLYGON_EID = 30109;
uint32 public constant ARBITRUM_EID = 30110;
uint32 public constant OPTIMISM_EID = 30111;
uint32 public constant BASE_EID = 30184;
uint32 public constant SONIC_EID = 30332;

// Local identification
uint32 public constant LOCAL_ARBITRUM_EID = 0;
```

### Default Values
```solidity
// Gas and timing
uint32 public constant DEFAULT_GAS_LIMIT = 690420;
uint32 public constant MAX_GAS_LIMIT = 10000000;
uint32 public constant MIN_GAS_LIMIT = 100000;
uint256 public constant DEFAULT_REQUEST_TIMEOUT = 1 hours;
uint256 public constant MAX_REQUEST_TIMEOUT = 24 hours;

// VRF parameters
uint32 public constant DEFAULT_CALLBACK_GAS = 2500000;
uint16 public constant DEFAULT_CONFIRMATIONS = 3;
uint16 public constant MAX_CONFIRMATIONS = 200;
uint16 public constant MIN_CONFIRMATIONS = 3;
uint32 public constant DEFAULT_NUM_WORDS = 1;
uint32 public constant MAX_NUM_WORDS = 500;

// Balance thresholds
uint256 public constant DEFAULT_MIN_BALANCE = 0.005 ether;
uint256 public constant MAX_MIN_BALANCE = 1 ether;
```

## Interface Definitions

### IRandomWordsCallbackV2_5
```solidity
interface IRandomWordsCallbackV2_5 {
    function receiveRandomWords(uint256[] calldata randomWords, uint256 requestId) external;
}
```

### IChainlinkVRFIntegratorV2_5
```solidity
interface IChainlinkVRFIntegratorV2_5 {
    struct MessagingFee {
        uint256 nativeFee;
        uint256 lzTokenFee;
    }
    
    function quoteFee() external view returns (MessagingFee memory fee);
    function quoteFeeWithGas(uint32 _gasLimit) external view returns (MessagingFee memory fee);
    function requestRandomWordsPayable(uint32 dstEid) external payable returns (MessagingReceipt memory receipt, uint64 requestId);
    function getRandomWord(uint64 requestId) external view returns (uint256 randomWord, bool fulfilled);
    function checkRequestStatus(uint64 requestId) external view returns (bool fulfilled, bool exists, address provider, uint256 randomWord, uint256 timestamp, bool expired);
}
```

### IOmniDragonVRFConsumer
```solidity
interface IOmniDragonVRFConsumer {
    function requestRandomWordsLocal() external returns (uint256 requestId);
    function getLocalRequest(uint256 requestId) external view returns (address requester, bool fulfilled, bool callbackSent, uint256 randomWord, uint256 timestamp);
    function getUserLocalRequests(address user) external view returns (uint256[] memory requestIds);
    function quoteSendToChain(uint32 targetChainEid) external view returns (MessagingFee memory fee);
    function setLocalCallerAuthorization(address caller, bool authorized) external;
}
```

### IVRFCallbackReceiver (Local Arbitrum)
```solidity
interface IVRFCallbackReceiver {
    function receiveRandomWords(uint256 requestId, uint256[] memory randomWords) external;
}
```

## Integration Patterns

### Cross-Chain VRF Pattern
```solidity
contract CrossChainGameContract {
    IChainlinkVRFIntegratorV2_5 immutable vrfIntegrator;
    uint32 constant ARBITRUM_EID = 30110;
    
    mapping(uint64 => GameState) public games;
    mapping(uint64 => address) public requestToPlayer;
    
    struct GameState {
        address player;
        uint256 betAmount;
        bool resolved;
        uint256 randomness;
    }
    
    constructor() {
        vrfIntegrator = IChainlinkVRFIntegratorV2_5(0x2BD68f5E956ca9789A7Ab7674670499e65140Bd5);
    }
    
    function startGame() external payable {
        require(msg.value >= 0.1 ether, "Minimum bet required");
        
        // Get VRF fee quote
        MessagingFee memory fee = vrfIntegrator.quoteFee();
        require(address(this).balance >= fee.nativeFee, "Insufficient contract balance");
        
        // Request randomness
        (, uint64 requestId) = vrfIntegrator.requestRandomWords(ARBITRUM_EID);
        
        games[requestId] = GameState({
            player: msg.sender,
            betAmount: msg.value,
            resolved: false,
            randomness: 0
        });
        
        requestToPlayer[requestId] = msg.sender;
        
        emit GameStarted(msg.sender, requestId, msg.value);
    }
    
    function resolveGame(uint64 requestId) external {
        GameState storage game = games[requestId];
        require(game.player != address(0), "Game not found");
        require(!game.resolved, "Game already resolved");
        
        (uint256 randomWord, bool fulfilled) = vrfIntegrator.getRandomWord(requestId);
        require(fulfilled, "Randomness not ready");
        
        game.randomness = randomWord;
        game.resolved = true;
        
        // Game logic using randomWord
        bool playerWins = (randomWord % 2) == 0; // Simple coin flip
        
        if (playerWins) {
            payable(game.player).transfer(game.betAmount * 2);
            emit GameWon(game.player, requestId, randomWord);
        } else {
            emit GameLost(game.player, requestId, randomWord);
        }
    }
    
    event GameStarted(address indexed player, uint64 indexed requestId, uint256 betAmount);
    event GameWon(address indexed player, uint64 indexed requestId, uint256 randomness);
    event GameLost(address indexed player, uint64 indexed requestId, uint256 randomness);
}
```

### Local VRF Pattern (Arbitrum)
```solidity
contract LocalVRFGameContract is IVRFCallbackReceiver {
    IOmniDragonVRFConsumer immutable vrfConsumer;
    
    mapping(uint256 => GameSession) public sessions;
    mapping(address => uint256[]) public playerSessions;
    
    struct GameSession {
        address player;
        uint256 betAmount;
        uint256 timestamp;
        bool resolved;
        uint256 randomness;
        bool won;
    }
    
    constructor() {
        vrfConsumer = IOmniDragonVRFConsumer(0x697a9d438a5b61ea75aa823f98a85efb70fd23d5);
    }
    
    function startLocalGame() external payable {
        require(msg.value >= 0.01 ether, "Minimum bet required");
        
        // Request local randomness (no LayerZero fees)
        uint256 requestId = vrfConsumer.requestRandomWordsLocal();
        
        sessions[requestId] = GameSession({
            player: msg.sender,
            betAmount: msg.value,
            timestamp: block.timestamp,
            resolved: false,
            randomness: 0,
            won: false
        });
        
        playerSessions[msg.sender].push(requestId);
        
        emit LocalGameStarted(msg.sender, requestId, msg.value);
    }
    
    // Callback from VRF Consumer
    function receiveRandomWords(uint256 requestId, uint256[] memory randomWords) external override {
        require(msg.sender == address(vrfConsumer), "Only VRF Consumer");
        
        GameSession storage session = sessions[requestId];
        require(session.player != address(0), "Session not found");
        require(!session.resolved, "Session already resolved");
        
        session.randomness = randomWords[0];
        session.resolved = true;
        
        // Determine winner (30% win rate example)
        session.won = (randomWords[0] % 100) < 30;
        
        if (session.won) {
            uint256 payout = session.betAmount * 3; // 3x payout
            payable(session.player).transfer(payout);
            emit LocalGameWon(session.player, requestId, randomWords[0], payout);
        } else {
            emit LocalGameLost(session.player, requestId, randomWords[0]);
        }
    }
    
    function getPlayerSessions(address player) external view returns (uint256[] memory) {
        return playerSessions[player];
    }
    
    event LocalGameStarted(address indexed player, uint256 indexed requestId, uint256 betAmount);
    event LocalGameWon(address indexed player, uint256 indexed requestId, uint256 randomness, uint256 payout);
    event LocalGameLost(address indexed player, uint256 indexed requestId, uint256 randomness);
}
```

## Testing Utilities

### Mock VRF for Testing
```solidity
contract MockVRFIntegrator {
    uint64 public requestCounter;
    mapping(uint64 => uint256) public mockRandomWords;
    mapping(uint64 => bool) public fulfilled;
    
    function quoteFee() external pure returns (MessagingFee memory fee) {
        return MessagingFee(0.001 ether, 0);
    }
    
    function requestRandomWordsPayable(uint32) external payable returns (MessagingReceipt memory receipt, uint64 requestId) {
        requestCounter++;
        requestId = requestCounter;
        
        // Mock immediate fulfillment with pseudo-random number
        mockRandomWords[requestId] = uint256(keccak256(abi.encodePacked(block.timestamp, requestId)));
        fulfilled[requestId] = true;
        
        return (receipt, requestId);
    }
    
    function getRandomWord(uint64 requestId) external view returns (uint256 randomWord, bool _fulfilled) {
        return (mockRandomWords[requestId], fulfilled[requestId]);
    }
}
```

### Test Helper Functions
```javascript
const testHelpers = {
  async deployMockVRF() {
    const MockVRF = await ethers.getContractFactory("MockVRFIntegrator");
    return await MockVRF.deploy();
  },
  
  async waitForVRFFulfillment(vrfContract, requestId, maxWait = 300000) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWait) {
      const [randomWord, fulfilled] = await vrfContract.getRandomWord(requestId);
      if (fulfilled) {
        return randomWord;
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
    throw new Error(`VRF request ${requestId} not fulfilled within ${maxWait}ms`);
  },
  
  async estimateVRFCosts(vrfContract) {
    const fee = await vrfContract.quoteFee();
    return {
      layerZeroFee: ethers.utils.formatEther(fee.nativeFee),
      gasEstimate: await vrfContract.estimateGas.requestRandomWordsPayable(30110, {value: fee.nativeFee})
    };
  }
};
```

## Performance Metrics

### Gas Consumption
| Operation | Sonic Gas | Arbitrum Gas | LayerZero Fee |
|-----------|-----------|--------------|---------------|
| Request Cross-Chain VRF | ~500,000 | ~300,000 | ~0.151 ETH |
| Request Local VRF | N/A | ~200,000 | 0 ETH |
| VRF Fulfillment Callback | ~150,000 | ~100,000 | 0 ETH |
| Response Processing | ~100,000 | ~250,000 | ~0.151 ETH |

### Timing Benchmarks
- **Cross-Chain Request**: 2-5 minutes average fulfillment
- **Local Request**: 30-60 seconds average fulfillment  
- **LayerZero Messaging**: 1-3 minutes each direction
- **Chainlink VRF**: 30-120 seconds on Arbitrum

### Success Rates
- **Cross-Chain Completion**: >95%
- **Local VRF Completion**: >99%
- **Callback Success**: >90% (dependent on gas limits)

---

**Complete technical reference for implementing OmniDragon VRF integration**
