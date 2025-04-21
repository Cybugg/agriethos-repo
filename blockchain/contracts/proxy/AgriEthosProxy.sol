// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "../storage/AgriEthosStorage.sol";

/**
 * @title AgriEthosProxy
 * @dev Proxy contract that delegates calls to the implementation contract
 * Enables upgradeability while preserving storage state
 */
contract AgriEthosProxy {
    // Storage for the implementation address
    bytes32 private constant IMPLEMENTATION_SLOT = keccak256("agriethos.proxy.implementation");
    
    // Storage for the admin address
    bytes32 private constant ADMIN_SLOT = keccak256("agriethos.proxy.admin");
    
    // Storage for the storage contract address
    bytes32 private constant STORAGE_SLOT = keccak256("agriethos.proxy.storage");
    
    // Events
    event Upgraded(address indexed implementation);
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    
    // Constructor sets the admin, implementation and storage
    constructor(address initialImplementation, address initialAdmin, address initialStorage) {
        require(initialImplementation != address(0), "Implementation cannot be zero address");
        require(initialAdmin != address(0), "Admin cannot be zero address");
        require(initialStorage != address(0), "Storage cannot be zero address");
        
        _setAdmin(initialAdmin);
        _setImplementation(initialImplementation);
        _setStorage(initialStorage);
    }
    
    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == _admin(), "AgriEthosProxy: Not authorized");
        _;
    }
    
    // Fallback function delegates all calls to the implementation
    fallback() external payable {
        address implementationAddr = _implementation();
        require(implementationAddr != address(0), "Implementation not set");
        
        // Execute call against implementation via delegatecall
        assembly {
            // Copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
            
            // Execute the function call using delegate call
            let result := delegatecall(gas(), implementationAddr, 0, calldatasize(), 0, 0)
            
            // Get any return value
            returndatacopy(0, 0, returndatasize())
            
            // Forward the return value or revert if call failed
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
    
    // Receive function to accept ETH
    receive() external payable {}
    
    /**
     * @dev Upgrades the implementation address
     * @param _newImplementation Address of the new implementation
     */
    function upgradeTo(address _newImplementation) external onlyAdmin {
        require(_newImplementation != address(0), "Implementation cannot be zero address");
        require(_newImplementation != _implementation(), "Cannot upgrade to same implementation");
        _setImplementation(_newImplementation);
        emit Upgraded(_newImplementation);
    }
    
    /**
     * @dev Changes the admin of the proxy
     * @param _newAdmin Address of the new admin
     */
    function changeAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Admin cannot be zero address");
        address previousAdmin = _admin();
        _setAdmin(_newAdmin);
        emit AdminChanged(previousAdmin, _newAdmin);
    }
    
    /**
     * @dev Returns the current implementation address
     */
    function implementation() external view onlyAdmin returns (address) {
        return _implementation();
    }
    
    /**
     * @dev Returns the admin address
     */
    function admin() external view onlyAdmin returns (address) {
        return _admin();
    }
    
    /**
     * @dev Returns the storage contract address
     */
    function storageContract() external view onlyAdmin returns (address) {
        return _storage();
    }
    
    /**
     * @dev Sets the storage contract address
     * @param _newStorage Address of the new storage contract
     */
    function setStorage(address _newStorage) external onlyAdmin {
        require(_newStorage != address(0), "Storage cannot be zero address");
        _setStorage(_newStorage);
    }
    
    // Internal functions to access storage slots
    function _implementation() internal view returns (address impl) {
        bytes32 slot = IMPLEMENTATION_SLOT;
        assembly {
            impl := sload(slot)
        }
    }
    
    function _admin() internal view returns (address adm) {
        bytes32 slot = ADMIN_SLOT;
        assembly {
            adm := sload(slot)
        }
    }
    
    function _storage() internal view returns (address stor) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            stor := sload(slot)
        }
    }
    
    function _setImplementation(address _newImplementation) internal {
        bytes32 slot = IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, _newImplementation)
        }
    }
    
    function _setAdmin(address _newAdmin) internal {
        bytes32 slot = ADMIN_SLOT;
        assembly {
            sstore(slot, _newAdmin)
        }
    }
    
    function _setStorage(address _newStorage) internal {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            sstore(slot, _newStorage)
        }
    }
}