// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title AgriEthosStorage
 * @dev Persistent storage contract for AgriEthos system
 * This contract provides a global storage that can be used by the proxy
 * to maintain state across contract upgrades.
 */
contract AgriEthosStorage {
    // Contract owner and admin addresses
    address public contractOwner;
    
    // Storage mappings
    mapping(bytes32 => uint256) private uintStorage;
    mapping(bytes32 => string) private stringStorage;
    mapping(bytes32 => address) private addressStorage;
    mapping(bytes32 => bytes) private bytesStorage;
    mapping(bytes32 => bool) private boolStorage;
    mapping(bytes32 => int256) private intStorage;

    // Constructor sets the contract owner
    constructor() {
        contractOwner = msg.sender;
    }
    
    // Modifier to restrict access to owner
    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "AgriEthosStorage: Not authorized");
        _;
    }
    
    // Ownership management
    function setContractOwner(address _newOwner) public onlyContractOwner {
        require(_newOwner != address(0), "AgriEthosStorage: Invalid address");
        contractOwner = _newOwner;
    }
    
    // ========== SETTERS ==========
    
    function setUint(bytes32 _key, uint256 _value) public onlyContractOwner {
        uintStorage[_key] = _value;
    }
    
    function setString(bytes32 _key, string memory _value) public onlyContractOwner {
        stringStorage[_key] = _value;
    }
    
    function setAddress(bytes32 _key, address _value) public onlyContractOwner {
        addressStorage[_key] = _value;
    }
    
    function setBytes(bytes32 _key, bytes memory _value) public onlyContractOwner {
        bytesStorage[_key] = _value;
    }
    
    function setBool(bytes32 _key, bool _value) public onlyContractOwner {
        boolStorage[_key] = _value;
    }
    
    function setInt(bytes32 _key, int256 _value) public onlyContractOwner {
        intStorage[_key] = _value;
    }
    
    // ========== GETTERS ==========
    
    function getUint(bytes32 _key) public view returns (uint256) {
        return uintStorage[_key];
    }
    
    function getString(bytes32 _key) public view returns (string memory) {
        return stringStorage[_key];
    }
    
    function getAddress(bytes32 _key) public view returns (address) {
        return addressStorage[_key];
    }
    
    function getBytes(bytes32 _key) public view returns (bytes memory) {
        return bytesStorage[_key];
    }
    
    function getBool(bytes32 _key) public view returns (bool) {
        return boolStorage[_key];
    }
    
    function getInt(bytes32 _key) public view returns (int256) {
        return intStorage[_key];
    }
    
    // ========== DELETERS ==========
    
    function deleteUint(bytes32 _key) public onlyContractOwner {
        delete uintStorage[_key];
    }
    
    function deleteString(bytes32 _key) public onlyContractOwner {
        delete stringStorage[_key];
    }
    
    function deleteAddress(bytes32 _key) public onlyContractOwner {
        delete addressStorage[_key];
    }
    
    function deleteBytes(bytes32 _key) public onlyContractOwner {
        delete bytesStorage[_key];
    }
    
    function deleteBool(bytes32 _key) public onlyContractOwner {
        delete boolStorage[_key];
    }
    
    function deleteInt(bytes32 _key) public onlyContractOwner {
        delete intStorage[_key];
    }
}