---
title: OmniDragon Registry — Technical Reference
sidebar_position: 30
---

# Registry Technical Reference

## Contract Specifications

### OmniDragonRegistry.sol

**Contract Address**: `0x6940aDc0A505108bC11CA28EefB7E3BAc7AF0777` (All chains)  
**Solidity Version**: `^0.8.20`  
**License**: MIT

### Inheritance Chain
```solidity
contract OmniDragonRegistry is 
    Initializable,
    AccessControlUpgradeable, 
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
```

### State Variables
```solidity
// Core configuration
mapping(uint256 => ChainConfig) public chainConfigs;
mapping(bytes32 => address) public contractAddresses;
mapping(uint32 => bytes32) public layerZeroPeers;

// Access control roles
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
bytes32 public constant READER_ROLE = keccak256("READER_ROLE");

// Gas configuration
struct GasConfig {
    uint256 baseLimit;
    uint256 priorityMultiplier;
    uint256 maxGasPrice;
}

mapping(bytes32 => GasConfig) public gasConfigs;
```

## Core Data Structures

### ChainConfig
```solidity
struct ChainConfig {
    uint32 layerZeroEid;        // LayerZero endpoint ID
    bool isSupported;           // Whether chain is supported
    bool isPrimary;             // Whether this is primary chain
    string rpcUrl;              // RPC endpoint URL
    address oracleAddress;      // Oracle contract address
    uint256 gasLimit;           // Default gas limit
    uint256 baseFee;            // Base fee in wei
    uint256 lastUpdated;        // Last update timestamp
}
```

### AddressRegistry
```solidity
struct AddressRegistry {
    address oracle;             // OmniDragonOracle address
    address registry;           // OmniDragonRegistry address (self)
    address omnidragon;         // OmniDragon token address
    address factory;            // CREATE2 factory address
    address multisig;           // Multi-signature wallet
    uint256 version;            // Configuration version
}
```

### RouteConfig
```solidity
struct RouteConfig {
    uint32[] intermediateEids;  // Intermediate LayerZero EIDs
    uint256 estimatedGas;       // Estimated gas consumption
    uint256 estimatedFee;       // Estimated fee in wei
    uint256 maxHops;            // Maximum hops allowed
    bool isOptimized;           // Whether route is optimized
}
```

## Function Reference

### Public/External Functions

#### Contract Discovery
```solidity
function getOracleAddress() external view returns (address oracle)
function getOracleAddress(uint256 chainId) external view returns (address oracle)
function getAllAddresses() external view returns (AddressRegistry memory)
function getContractAddress(bytes32 key) external view returns (address)
```

#### Network Information
```solidity
function getChainConfig(uint256 chainId) external view returns (ChainConfig memory)
function isChainSupported(uint256 chainId) external view returns (bool)
function getPrimaryChain() external view returns (uint256)
function getSupportedChains() external view returns (uint256[] memory)
function getLayerZeroEid(uint256 chainId) external view returns (uint32)
function getChainIdFromEid(uint32 eid) external view returns (uint256)
```

#### Cross-Chain Routing
```solidity
function getOptimalRoute(uint256 fromChain, uint256 toChain) 
    external view returns (RouteConfig memory)
function getPeerAddress(uint32 eid) external view returns (bytes32)
function getAllPeers() external view returns (uint32[] memory eids, bytes32[] memory peers)
function calculateRoutingFee(uint256 fromChain, uint256 toChain) 
    external view returns (uint256 fee)
```

#### Gas Management
```solidity
function getGasConfig(bytes32 operation) external view returns (GasConfig memory)
function estimateGas(bytes32 operation, bytes calldata data) 
    external view returns (uint256 gasEstimate)
function getGasPrice(uint256 chainId) external view returns (uint256 gasPrice)
```

### Administrative Functions

#### Chain Management
```solidity
function addChain(
    uint256 chainId,
    uint32 layerZeroEid,
    string calldata rpcUrl,
    bool isSupported,
    bool isPrimary
) external onlyRole(ADMIN_ROLE)

function updateChainConfig(
    uint256 chainId, 
    ChainConfig calldata config
) external onlyRole(ADMIN_ROLE)

function removeChain(uint256 chainId) external onlyRole(ADMIN_ROLE)
function setSupportStatus(uint256 chainId, bool isSupported) external onlyRole(ADMIN_ROLE)
```

#### Address Management
```solidity
function setOracleAddress(address newOracle) external onlyRole(ADMIN_ROLE)
function setContractAddress(bytes32 key, address newAddress) external onlyRole(ADMIN_ROLE)
function updateAddressRegistry(AddressRegistry calldata newRegistry) external onlyRole(ADMIN_ROLE)
```

#### LayerZero Configuration
```solidity
function setPeer(uint32 eid, bytes32 peer) external onlyRole(ADMIN_ROLE)
function setMultiplePeers(uint32[] calldata eids, bytes32[] calldata peers) external onlyRole(ADMIN_ROLE)
function removePeer(uint32 eid) external onlyRole(ADMIN_ROLE)
```

#### Gas Configuration
```solidity
function setGasConfig(bytes32 operation, GasConfig calldata config) external onlyRole(ADMIN_ROLE)
function setGasMultiplier(uint256 multiplier) external onlyRole(ADMIN_ROLE)
function updateGasPrices(uint256[] calldata chainIds, uint256[] calldata gasPrices) external onlyRole(UPDATER_ROLE)
```

#### Emergency Controls
```solidity
function pause() external onlyRole(ADMIN_ROLE)
function unpause() external onlyRole(ADMIN_ROLE)
function emergencyUpdateAddress(bytes32 key, address newAddress) external onlyRole(ADMIN_ROLE)
```

## Events

```solidity
// Chain management events
event ChainAdded(uint256 indexed chainId, uint32 indexed layerZeroEid, bool isPrimary);
event ChainRemoved(uint256 indexed chainId);
event ChainConfigUpdated(uint256 indexed chainId, ChainConfig config);
event SupportStatusChanged(uint256 indexed chainId, bool isSupported);

// Address management events  
event AddressUpdated(bytes32 indexed key, address indexed oldAddress, address indexed newAddress);
event OracleAddressUpdated(address indexed oldOracle, address indexed newOracle);
event AddressRegistryUpdated(uint256 indexed version, AddressRegistry registry);

// LayerZero events
event PeerSet(uint32 indexed eid, bytes32 indexed peer);
event PeerRemoved(uint32 indexed eid);
event RouteOptimized(uint256 indexed fromChain, uint256 indexed toChain, RouteConfig route);

// Gas configuration events
event GasConfigUpdated(bytes32 indexed operation, GasConfig config);
event GasMultiplierUpdated(uint256 oldMultiplier, uint256 newMultiplier);
event GasPriceUpdated(uint256 indexed chainId, uint256 oldPrice, uint256 newPrice);

// Administrative events
event AdminRoleGranted(address indexed account, address indexed sender);
event EmergencyUpdate(bytes32 indexed key, address indexed newAddress, string reason);
```

## Error Codes

```solidity
// Chain errors
error ChainNotSupported(uint256 chainId);
error ChainAlreadyExists(uint256 chainId);
error InvalidChainConfig(uint256 chainId);
error PrimaryChainCannotBeRemoved(uint256 chainId);

// Address errors
error InvalidAddress(address addr);
error AddressAlreadySet(bytes32 key);
error ContractNotFound(bytes32 key);

// LayerZero errors
error InvalidEid(uint32 eid);
error PeerNotSet(uint32 eid);
error InvalidPeerAddress(bytes32 peer);
error RouteNotFound(uint256 fromChain, uint256 toChain);

// Gas errors
error InvalidGasConfig(bytes32 operation);
error GasPriceTooHigh(uint256 gasPrice, uint256 maxGasPrice);
error InsufficientGas(uint256 provided, uint256 required);

// Access control errors
error UnauthorizedAccess(address caller, bytes32 role);
error InvalidRole(bytes32 role);
```

## Modifiers

```solidity
modifier onlySupported(uint256 chainId) {
    if (!chainConfigs[chainId].isSupported) {
        revert ChainNotSupported(chainId);
    }
    _;
}

modifier onlyValidAddress(address addr) {
    if (addr == address(0)) {
        revert InvalidAddress(addr);
    }
    _;
}

modifier onlyValidEid(uint32 eid) {
    if (eid == 0) {
        revert InvalidEid(eid);
    }
    _;
}

modifier whenNotPaused() override {
    if (paused()) {
        revert EnforcedPause();
    }
    _;
}
```

## Internal Functions

### Chain Management
```solidity
function _validateChainConfig(ChainConfig memory config) internal pure returns (bool)
function _updateChainTimestamp(uint256 chainId) internal
function _isPrimaryChain(uint256 chainId) internal view returns (bool)
function _getChainCount() internal view returns (uint256)
```

### Route Optimization
```solidity
function _calculateOptimalRoute(uint256 fromChain, uint256 toChain) 
    internal view returns (RouteConfig memory)
function _estimateRoutingCost(uint32[] memory eids) internal view returns (uint256)
function _validateRoute(RouteConfig memory route) internal pure returns (bool)
```

### Gas Calculations
```solidity
function _calculateGasEstimate(bytes32 operation, bytes calldata data) 
    internal view returns (uint256)
function _applyGasMultiplier(uint256 baseGas, uint256 multiplier) 
    internal pure returns (uint256)
function _getEffectiveGasPrice(uint256 chainId) internal view returns (uint256)
```

## Constants

```solidity
// Contract identification
string public constant NAME = "OmniDragonRegistry";
string public constant VERSION = "1.0.0";
uint256 public constant CONTRACT_VERSION = 1;

// Default configurations
uint256 public constant DEFAULT_GAS_LIMIT = 200000;
uint256 public constant DEFAULT_GAS_MULTIPLIER = 120; // 1.2x
uint256 public constant MAX_GAS_MULTIPLIER = 300; // 3.0x
uint256 public constant MIN_GAS_LIMIT = 21000;
uint256 public constant MAX_GAS_LIMIT = 5000000;

// LayerZero constants
uint32 public constant INVALID_EID = 0;
bytes32 public constant ZERO_BYTES32 = bytes32(0);
uint256 public constant MAX_HOPS = 3;

// Time constants
uint256 public constant CONFIG_UPDATE_DELAY = 1 hours;
uint256 public constant EMERGENCY_UPDATE_DELAY = 15 minutes;
uint256 public constant MAX_CONFIG_AGE = 7 days;

// Address keys
bytes32 public constant ORACLE_KEY = keccak256("ORACLE");
bytes32 public constant REGISTRY_KEY = keccak256("REGISTRY");
bytes32 public constant OMNIDRAGON_KEY = keccak256("OMNIDRAGON");
bytes32 public constant FACTORY_KEY = keccak256("FACTORY");
bytes32 public constant MULTISIG_KEY = keccak256("MULTISIG");
```

## Interface Definitions

### IOmniDragonRegistry
```solidity
interface IOmniDragonRegistry {
    // Core functions
    function getOracleAddress() external view returns (address);
    function getChainConfig(uint256 chainId) external view returns (ChainConfig memory);
    function isChainSupported(uint256 chainId) external view returns (bool);
    function getOptimalRoute(uint256 fromChain, uint256 toChain) external view returns (RouteConfig memory);
    
    // Administrative functions
    function addChain(uint256 chainId, uint32 layerZeroEid, string calldata rpcUrl, bool isSupported, bool isPrimary) external;
    function setOracleAddress(address newOracle) external;
    function setPeer(uint32 eid, bytes32 peer) external;
}
```

### IRegistryReader
```solidity
interface IRegistryReader {
    function getAllAddresses() external view returns (AddressRegistry memory);
    function getSupportedChains() external view returns (uint256[] memory);
    function getPrimaryChain() external view returns (uint256);
    function getGasConfig(bytes32 operation) external view returns (GasConfig memory);
}
```

## Integration Patterns

### Proxy Pattern Implementation
```solidity
// Using OpenZeppelin's transparent proxy pattern
contract OmniDragonRegistryProxy is TransparentUpgradeableProxy {
    constructor(
        address logic,
        address admin,
        bytes memory data
    ) TransparentUpgradeableProxy(logic, admin, data) {}
}
```

### Factory Integration
```solidity
contract RegistryFactory {
    address public immutable CREATE2_FACTORY;
    bytes32 public immutable REGISTRY_SALT;
    
    function deployRegistry(
        uint256[] calldata chainIds,
        address admin
    ) external returns (address registry) {
        bytes memory bytecode = abi.encodePacked(
            type(OmniDragonRegistry).creationCode,
            abi.encode(admin)
        );
        
        registry = Clones.cloneDeterministic(
            implementation,
            REGISTRY_SALT
        );
        
        IOmniDragonRegistry(registry).initialize(
            admin,
            chainIds
        );
        
        return registry;
    }
}
```

## Testing Utilities

### Mock Registry for Testing
```solidity
contract MockOmniDragonRegistry is IOmniDragonRegistry {
    mapping(uint256 => bool) public supportedChains;
    mapping(uint256 => address) public oracles;
    
    function setMockChain(uint256 chainId, bool isSupported) external {
        supportedChains[chainId] = isSupported;
    }
    
    function setMockOracle(uint256 chainId, address oracle) external {
        oracles[chainId] = oracle;
    }
    
    function isChainSupported(uint256 chainId) external view returns (bool) {
        return supportedChains[chainId];
    }
    
    function getOracleAddress() external view returns (address) {
        return oracles[block.chainid];
    }
}
```

### Test Helpers
```javascript
const testHelpers = {
  async deployTestRegistry(admin, chains) {
    const RegistryFactory = await ethers.getContractFactory("OmniDragonRegistry");
    const registry = await RegistryFactory.deploy();
    await registry.initialize(admin, chains);
    return registry;
  },
  
  async addTestChain(registry, chainId, eid, isPrimary = false) {
    await registry.addChain(
      chainId,
      eid,
      `https://rpc.testnet${chainId}.com/`,
      true,
      isPrimary
    );
  },
  
  async verifyChainConfig(registry, chainId, expectedConfig) {
    const config = await registry.getChainConfig(chainId);
    expect(config.layerZeroEid).to.equal(expectedConfig.layerZeroEid);
    expect(config.isSupported).to.equal(expectedConfig.isSupported);
    expect(config.isPrimary).to.equal(expectedConfig.isPrimary);
  }
};
```

---

**Complete technical reference for OmniDragon Registry implementation**
