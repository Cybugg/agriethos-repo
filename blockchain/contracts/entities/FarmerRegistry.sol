// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "contracts/access/AgriEthosAccess.sol";

/**
 * @title FarmerRegistry
 * @dev Manages farmer registration and verification
 */
contract FarmerRegistry is AgriEthosAccess {
    // Farmer status enum
    enum FarmerStatus {
        Verified,
        Pending,
        Suspended
    }
    
    // Farmer data structure
    struct Farmer {
        uint256 id;
        string name;
        string location;
        string contactInfo;
        address walletAddress;
        uint256 registrationDate;
        FarmerStatus status;
    }
    
    // Storage
    mapping(uint256 => Farmer) public farmers;
    mapping(address => uint256) public farmerByAddress;
    uint256 public farmerCount;
    
    // Events
    event FarmerRegistered(uint256 indexed farmerId, string name, address indexed walletAddress);
    event FarmerVerified(uint256 indexed farmerId);
    event FarmerSuspended(uint256 indexed farmerId);
    
    // Modifiers
    modifier farmerExists(uint256 _farmerId) {
        require(_farmerId > 0 && _farmerId <= farmerCount, "Farmer does not exist");
        _;
    }
    
    modifier farmerVerified(address _address) {
        uint256 farmerId = farmerByAddress[_address];
        require(
            farmerId != 0 && farmers[farmerId].status == FarmerStatus.Verified,
            "Farmer not verified"
        );
        _;
    }
    
    // Registration function
    function registerFarmer(
        string memory _name,
        string memory _location,
        string memory _contactInfo
    ) public returns (uint256) {
        require(farmerByAddress[msg.sender] == 0, "Farmer already registered");
        
        farmerCount++;
        
        farmers[farmerCount] = Farmer({
            id: farmerCount,
            name: _name,
            location: _location,
            contactInfo: _contactInfo,
            walletAddress: msg.sender,
            registrationDate: block.timestamp,
            status: FarmerStatus.Pending
        });
        
        farmerByAddress[msg.sender] = farmerCount;
        
        emit FarmerRegistered(farmerCount, _name, msg.sender);
        
        return farmerCount;
    }
    
    // Admin functions
    function verifyFarmer(uint256 _farmerId) public onlyVerifierOrAdmin farmerExists(_farmerId) {
        farmers[_farmerId].status = FarmerStatus.Verified;
        emit FarmerVerified(_farmerId);
    }
    
    function suspendFarmer(uint256 _farmerId) public onlyVerifierOrAdmin farmerExists(_farmerId) {
        farmers[_farmerId].status = FarmerStatus.Suspended;
        emit FarmerSuspended(_farmerId);
    }
    
    // Query functions
    function getFarmerDetails(uint256 _farmerId) public view farmerExists(_farmerId) returns (
        string memory name,
        string memory location,
        string memory contactInfo,
        address walletAddress,
        FarmerStatus status
    ) {
        Farmer memory farmer = farmers[_farmerId];
        return (
            farmer.name,
            farmer.location,
            farmer.contactInfo,
            farmer.walletAddress,
            farmer.status
        );
    }
}