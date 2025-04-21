// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./FarmerRegistry.sol";

/**
 * @title FarmRegistry
 * @dev Manages farm registration and information
 */
contract FarmRegistry is FarmerRegistry {
    // Farm data structure
    struct Farm {
        uint256 id;
        string name;
        string location;
        string gpsCoordinates;
        uint256 size; // in hectares
        uint256 registrationDate;
        bool verified;
    }
    
    // Storage
    mapping(uint256 => Farm) public farms;
    mapping(uint256 => uint256) public farmToFarmer; // farmId => farmerId
    uint256 public farmCount;
    
    // Events
    event FarmRegistered(uint256 indexed farmId, uint256 indexed farmerId, string name, string location);
    event FarmVerified(uint256 indexed farmId);
    
    // Modifiers
    modifier farmExists(uint256 _farmId) {
        require(_farmId > 0 && _farmId <= farmCount, "Farm does not exist");
        _;
    }
    
    // Functions
    function registerFarm(
        string memory _name,
        string memory _location,
        string memory _gpsCoordinates,
        uint256 _size
    ) public farmerVerified(msg.sender) returns (uint256) {
        uint256 farmerId = farmerByAddress[msg.sender];
        require(farmerId != 0, "Farmer not registered");
        
        farmCount++;
        
        farms[farmCount] = Farm({
            id: farmCount,
            name: _name,
            location: _location,
            gpsCoordinates: _gpsCoordinates,
            size: _size,
            registrationDate: block.timestamp,
            verified: false
        });
        
        farmToFarmer[farmCount] = farmerId;
        
        emit FarmRegistered(farmCount, farmerId, _name, _location);
        
        return farmCount;
    }
    
    function verifyFarm(uint256 _farmId) public onlyVerifierOrAdmin farmExists(_farmId) {
        farms[_farmId].verified = true;
        emit FarmVerified(_farmId);
    }
    
    function getFarmDetails(uint256 _farmId) public view farmExists(_farmId) returns (
        string memory name,
        string memory location,
        string memory gpsCoordinates,
        uint256 size,
        uint256 farmerId
    ) {
        Farm memory farm = farms[_farmId];
        return (
            farm.name,
            farm.location,
            farm.gpsCoordinates,
            farm.size,
            farmToFarmer[_farmId]
        );
    }
    
    function getFarmerFarms(uint256 _farmerId) public view returns (uint256[] memory) {
        require(_farmerId > 0 && _farmerId <= farmerCount, "Farmer does not exist");
        
        // First, count farms for this farmer
        uint256 farmCounter = 0;
        for (uint256 i = 1; i <= farmCount; i++) {
            if (farmToFarmer[i] == _farmerId) {
                farmCounter++;
            }
        }
        
        // Then populate the array
        uint256[] memory farmerFarms = new uint256[](farmCounter);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= farmCount; i++) {
            if (farmToFarmer[i] == _farmerId) {
                farmerFarms[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return farmerFarms;
    }
}